import type { Lang } from '../lib/content';

// A small, stable vocabulary of session tags. Content authors reference tags by
// key in session.yaml; this dictionary supplies the bilingual display label so
// the wording only has to be maintained in one place.
export const tagLabels: Record<string, Record<Lang, string>> = {
  counting: { nl: 'Tellen', en: 'Counting' },
  teamwork: { nl: 'Samenwerken', en: 'Teamwork' },
  'low-combat': { nl: 'Weinig geweld', en: 'Low combat' },
  courage: { nl: 'Moed', en: 'Courage' },
  choices: { nl: 'Eigen keuzes', en: 'Own choices' },
};

export function tagLabel(tag: string, lang: Lang): string {
  return tagLabels[tag]?.[lang] ?? tag;
}
