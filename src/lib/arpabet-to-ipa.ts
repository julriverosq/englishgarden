const ARPABET_TO_IPA: Record<string, string> = {
  // Vowels
  'AA': 'ɑ',
  'AE': 'æ',
  'AH': 'ʌ',
  'AO': 'ɔ',
  'AW': 'aʊ',
  'AX': 'ə',
  'AY': 'aɪ',
  'EH': 'ɛ',
  'ER': 'ɝ',
  'EY': 'eɪ',
  'IH': 'ɪ',
  'IX': 'ɨ',
  'IY': 'i',
  'OW': 'oʊ',
  'OY': 'ɔɪ',
  'UH': 'ʊ',
  'UW': 'u',
  'UX': 'ʉ',
  // Consonants
  'B': 'b',
  'CH': 'tʃ',
  'D': 'd',
  'DH': 'ð',
  'DX': 'ɾ',
  'EL': 'l̩',
  'EM': 'm̩',
  'EN': 'n̩',
  'F': 'f',
  'G': 'ɡ',
  'HH': 'h',
  'H': 'h',
  'JH': 'dʒ',
  'K': 'k',
  'L': 'l',
  'M': 'm',
  'N': 'n',
  'NG': 'ŋ',
  'NX': 'ɾ̃',
  'P': 'p',
  'Q': 'ʔ',
  'R': 'ɹ',
  'S': 's',
  'SH': 'ʃ',
  'T': 't',
  'TH': 'θ',
  'V': 'v',
  'W': 'w',
  'WH': 'ʍ',
  'Y': 'j',
  'Z': 'z',
  'ZH': 'ʒ',
};

export function arpabetToIpa(arpabet: string): string {
  const phonemes = arpabet.split(' ');
  const ipa = phonemes
    .map(p => {
      // Strip stress markers (0, 1, 2) to get the base phoneme
      const base = p.replace(/[012]/g, '');
      return ARPABET_TO_IPA[base] || '';
    })
    .join('');

  return `/${ipa}/`;
}
