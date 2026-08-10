import type { Lang } from '../lib/content';

export const ui = {
  nl: {
    siteTitle: 'Kinderavonturen',
    tagline: 'Zelfgemaakte mini-avonturen om te spelen met je speelgoed',
    nav: { worlds: 'Werelden' },
    world: { campaigns: 'Campagnes' },
    campaign: { sessions: 'Avonturen', backToWorld: 'Terug naar' },
    session: {
      duration: 'Duur',
      players: 'Spelers',
      materials: 'Benodigdheden',
      age: 'Leeftijd',
      print: 'Print dit avontuur',
      backToCampaign: 'Terug naar',
    },
    translationBanner: 'Dit avontuur is nog niet vertaald naar het Nederlands. Hieronder zie je de Engelse versie.',
    languageSwitchLabel: 'English',
    minutes: 'minuten',
    yearsOld: 'jaar',
    journalStamp: 'Logboek',
  },
  en: {
    siteTitle: 'Kids Adventures',
    tagline: 'Homemade mini-adventures to play with your toys',
    nav: { worlds: 'Worlds' },
    world: { campaigns: 'Campaigns' },
    campaign: { sessions: 'Adventures', backToWorld: 'Back to' },
    session: {
      duration: 'Duration',
      players: 'Players',
      materials: 'What you need',
      age: 'Age',
      print: 'Print this adventure',
      backToCampaign: 'Back to',
    },
    translationBanner: 'This adventure has not been translated into English yet. Showing the Dutch version below.',
    languageSwitchLabel: 'Nederlands',
    minutes: 'minutes',
    yearsOld: 'years old',
    journalStamp: 'Field log',
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}
