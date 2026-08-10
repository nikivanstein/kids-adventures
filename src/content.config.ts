import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// All content lives in /content at the repo root (not src/content) so that
// non-technical contributors can find and edit it easily from the GitHub web UI,
// separate from the site's source code in /src.
const CONTENT_BASE = './content/worlds';

const langEnum = z.enum(['nl', 'en']);

function worldIdFromEntry(entry: string): string {
  // entry, e.g. "playmobil-funpark/world.yaml"
  return entry.split('/')[0];
}

function worldContentId(entry: string): string {
  // entry, e.g. "playmobil-funpark/world.nl.md"
  const match = entry.match(/^([^/]+)\/world\.(nl|en)\.md$/);
  if (!match) throw new Error(`Unexpected world content path: ${entry}`);
  const [, world, lang] = match;
  return `${world}--${lang}`;
}

function campaignId(entry: string): string {
  // entry, e.g. "playmobil-funpark/campaigns/de-verdwenen-snoeppot/campaign.yaml"
  const match = entry.match(/^([^/]+)\/campaigns\/([^/]+)\/campaign\.yaml$/);
  if (!match) throw new Error(`Unexpected campaign meta path: ${entry}`);
  const [, world, campaign] = match;
  return `${world}--${campaign}`;
}

function campaignContentId(entry: string): string {
  const match = entry.match(/^([^/]+)\/campaigns\/([^/]+)\/campaign\.(nl|en)\.md$/);
  if (!match) throw new Error(`Unexpected campaign content path: ${entry}`);
  const [, world, campaign, lang] = match;
  return `${world}--${campaign}--${lang}`;
}

function sessionId(entry: string): string {
  // entry, e.g. "playmobil-funpark/campaigns/de-verdwenen-snoeppot/sessions/01-het-verdwenen-snoepje/session.yaml"
  const match = entry.match(/^([^/]+)\/campaigns\/([^/]+)\/sessions\/([^/]+)\/session\.yaml$/);
  if (!match) throw new Error(`Unexpected session meta path: ${entry}`);
  const [, world, campaign, session] = match;
  return `${world}--${campaign}--${session}`;
}

function sessionContentId(entry: string): string {
  const match = entry.match(/^([^/]+)\/campaigns\/([^/]+)\/sessions\/([^/]+)\/(nl|en)\.md$/);
  if (!match) throw new Error(`Unexpected session content path: ${entry}`);
  const [, world, campaign, session, lang] = match;
  return `${world}--${campaign}--${session}--${lang}`;
}

// -- Worlds ------------------------------------------------------------

const worlds = defineCollection({
  loader: glob({
    pattern: '*/world.yaml',
    base: CONTENT_BASE,
    generateId: ({ entry }) => worldIdFromEntry(entry),
  }),
  schema: z.object({
    slug: z.string(),
    accentColor: z.string().optional(),
    cover: z.string().optional(),
    order: z.number().default(99),
  }),
});

const worldContent = defineCollection({
  loader: glob({
    pattern: '*/world.{nl,en}.md',
    base: CONTENT_BASE,
    generateId: ({ entry }) => worldContentId(entry),
  }),
  schema: z.object({
    world: z.string(),
    lang: langEnum,
    title: z.string(),
    summary: z.string().optional(),
  }),
});

// -- Campaigns -----------------------------------------------------------

const campaigns = defineCollection({
  loader: glob({
    pattern: '*/campaigns/*/campaign.yaml',
    base: CONTENT_BASE,
    generateId: ({ entry }) => campaignId(entry),
  }),
  schema: z.object({
    slug: z.string(),
    world: z.string(),
    order: z.number().default(99),
    cover: z.string().optional(),
  }),
});

const campaignContent = defineCollection({
  loader: glob({
    pattern: '*/campaigns/*/campaign.{nl,en}.md',
    base: CONTENT_BASE,
    generateId: ({ entry }) => campaignContentId(entry),
  }),
  schema: z.object({
    world: z.string(),
    campaign: z.string(),
    lang: langEnum,
    title: z.string(),
    summary: z.string().optional(),
  }),
});

// -- Sessions --------------------------------------------------------------

const bilingualText = z.object({ nl: z.string(), en: z.string() });

const playerSchema = z.object({
  role: bilingualText,
  age: z.number().optional(),
  note: bilingualText.optional(),
});

const materialSchema = z.object({
  icon: z.string(),
  nl: z.string(),
  en: z.string(),
});

const sessions = defineCollection({
  loader: glob({
    pattern: '*/campaigns/*/sessions/*/session.yaml',
    base: CONTENT_BASE,
    generateId: ({ entry }) => sessionId(entry),
  }),
  schema: z.object({
    slug: z.string(),
    world: z.string(),
    campaign: z.string(),
    order: z.number().default(99),
    durationMinutes: z.object({ min: z.number(), max: z.number() }),
    minAge: z.number(),
    maxAge: z.number(),
    players: z.array(playerSchema),
    materials: z.array(materialSchema),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
  }),
});

const sessionContent = defineCollection({
  loader: glob({
    pattern: '*/campaigns/*/sessions/*/{nl,en}.md',
    base: CONTENT_BASE,
    generateId: ({ entry }) => sessionContentId(entry),
  }),
  schema: z.object({
    world: z.string(),
    campaign: z.string(),
    session: z.string(),
    lang: langEnum,
    title: z.string(),
    summary: z.string().optional(),
  }),
});

export const collections = {
  worlds,
  worldContent,
  campaigns,
  campaignContent,
  sessions,
  sessionContent,
};
