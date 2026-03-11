import { dictionary } from 'cmu-pronouncing-dictionary';
import { arpabetToIpa } from './arpabet-to-ipa';
import { isStopWord } from './stop-words';

export type WordPhonetics = Record<string, string>;

export function getWordPhonetics(words: string[]): WordPhonetics {
  const result: WordPhonetics = {};

  for (const raw of words) {
    const clean = raw.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!clean || isStopWord(clean) || result[clean]) continue;

    const arpabet = (dictionary as Record<string, string>)[clean];
    if (arpabet) {
      result[clean] = arpabetToIpa(arpabet);
    }
  }

  return result;
}
