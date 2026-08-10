import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

export type Lang = 'nl' | 'en';

export function otherLang(lang: Lang): Lang {
  return lang === 'nl' ? 'en' : 'nl';
}

// Picks the entry matching `lang`, falling back to the other language if the
// requested one isn't written yet. `translated` is false when we had to fall back,
// which pages use to show the "not yet translated" banner.
function pickTranslated<T extends { data: { lang: Lang } }>(
  entries: T[],
  lang: Lang,
): { entry: T; translated: boolean } | undefined {
  const exact = entries.find((e) => e.data.lang === lang);
  if (exact) return { entry: exact, translated: true };
  const fallback = entries.find((e) => e.data.lang === otherLang(lang));
  if (fallback) return { entry: fallback, translated: false };
  return undefined;
}

export interface ResolvedWorld {
  meta: CollectionEntry<'worlds'>;
  content: CollectionEntry<'worldContent'>;
  translated: boolean;
}

export interface ResolvedCampaign {
  meta: CollectionEntry<'campaigns'>;
  content: CollectionEntry<'campaignContent'>;
  translated: boolean;
}

export interface ResolvedSession {
  meta: CollectionEntry<'sessions'>;
  content: CollectionEntry<'sessionContent'>;
  translated: boolean;
}

export async function getWorlds(lang: Lang): Promise<ResolvedWorld[]> {
  const [metas, allContent] = await Promise.all([getCollection('worlds'), getCollection('worldContent')]);
  const resolved = metas
    .map((meta) => {
      const contentEntries = allContent.filter((c) => c.data.world === meta.data.slug);
      const picked = pickTranslated(contentEntries, lang);
      if (!picked) return undefined;
      return { meta, content: picked.entry, translated: picked.translated };
    })
    .filter((w): w is ResolvedWorld => Boolean(w));
  return resolved.sort((a, b) => a.meta.data.order - b.meta.data.order);
}

export async function getWorld(worldSlug: string, lang: Lang): Promise<ResolvedWorld | undefined> {
  const worlds = await getWorlds(lang);
  return worlds.find((w) => w.meta.data.slug === worldSlug);
}

export async function getCampaigns(worldSlug: string, lang: Lang): Promise<ResolvedCampaign[]> {
  const [metas, allContent] = await Promise.all([getCollection('campaigns'), getCollection('campaignContent')]);
  const resolved = metas
    .filter((m) => m.data.world === worldSlug)
    .map((meta) => {
      const contentEntries = allContent.filter(
        (c) => c.data.world === worldSlug && c.data.campaign === meta.data.slug,
      );
      const picked = pickTranslated(contentEntries, lang);
      if (!picked) return undefined;
      return { meta, content: picked.entry, translated: picked.translated };
    })
    .filter((c): c is ResolvedCampaign => Boolean(c));
  return resolved.sort((a, b) => a.meta.data.order - b.meta.data.order);
}

export async function getCampaign(
  worldSlug: string,
  campaignSlug: string,
  lang: Lang,
): Promise<ResolvedCampaign | undefined> {
  const campaigns = await getCampaigns(worldSlug, lang);
  return campaigns.find((c) => c.meta.data.slug === campaignSlug);
}

export async function getSessions(
  worldSlug: string,
  campaignSlug: string,
  lang: Lang,
): Promise<ResolvedSession[]> {
  const [metas, allContent] = await Promise.all([getCollection('sessions'), getCollection('sessionContent')]);
  const resolved = metas
    .filter((m) => m.data.world === worldSlug && m.data.campaign === campaignSlug)
    .map((meta) => {
      const contentEntries = allContent.filter(
        (c) =>
          c.data.world === worldSlug && c.data.campaign === campaignSlug && c.data.session === meta.data.slug,
      );
      const picked = pickTranslated(contentEntries, lang);
      if (!picked) return undefined;
      return { meta, content: picked.entry, translated: picked.translated };
    })
    .filter((s): s is ResolvedSession => Boolean(s));
  return resolved.sort((a, b) => a.meta.data.order - b.meta.data.order);
}

export async function getSession(
  worldSlug: string,
  campaignSlug: string,
  sessionSlug: string,
  lang: Lang,
): Promise<ResolvedSession | undefined> {
  const sessions = await getSessions(worldSlug, campaignSlug, lang);
  return sessions.find((s) => s.meta.data.slug === sessionSlug);
}

export { render, getEntry };

// -- Static path helpers ----------------------------------------------------
// The slug of a world/campaign/session is shared across languages (folder
// names aren't translated), so the set of valid params is language-independent
// and can be read straight from the meta collections.

export async function worldParams(): Promise<{ world: string }[]> {
  const worlds = await getCollection('worlds');
  return worlds.map((w) => ({ world: w.data.slug }));
}

export async function campaignParams(): Promise<{ world: string; campaign: string }[]> {
  const campaigns = await getCollection('campaigns');
  return campaigns.map((c) => ({ world: c.data.world, campaign: c.data.slug }));
}

export async function sessionParams(): Promise<{ world: string; campaign: string; session: string }[]> {
  const sessions = await getCollection('sessions');
  return sessions.map((s) => ({ world: s.data.world, campaign: s.data.campaign, session: s.data.slug }));
}

// -- URL helpers -----------------------------------------------------------
// Astro's `import.meta.env.BASE_URL` already reflects the `base` option from
// astro.config.mjs, so links work both locally and once deployed under
// /kids-adventures on GitHub Pages.

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function homePath(lang: Lang): string {
  return `${BASE}/${lang}/`;
}

export function worldPath(lang: Lang, worldSlug: string): string {
  return `${BASE}/${lang}/${worldSlug}/`;
}

export function campaignPath(lang: Lang, worldSlug: string, campaignSlug: string): string {
  return `${BASE}/${lang}/${worldSlug}/${campaignSlug}/`;
}

export function sessionPath(
  lang: Lang,
  worldSlug: string,
  campaignSlug: string,
  sessionSlug: string,
): string {
  return `${BASE}/${lang}/${worldSlug}/${campaignSlug}/${sessionSlug}/`;
}

// Cover images referenced from world.yaml/campaign.yaml/session.yaml (e.g.
// `cover: /images/worlds/playmobil-funpark/cover.jpg`) live in /public, so
// they need the same GitHub Pages `base` prefix as everything else.
export function assetPath(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}
