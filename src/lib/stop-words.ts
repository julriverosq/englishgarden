export const STOP_WORDS = new Set([
  // Articles
  'a', 'an', 'the',
  // Pronouns
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his',
  'she', 'her', 'it', 'its', 'they', 'them', 'their',
  // Prepositions
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up',
  'about', 'into', 'over', 'after',
  // Conjunctions
  'and', 'but', 'or', 'nor', 'so', 'yet',
  // Auxiliary/Common verbs
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'shall', 'should', 'may', 'might', 'can', 'could',
  // Other common fillers
  'not', 'no', 'if', 'then', 'than', 'that', 'this', 'these', 'those',
  'what', 'which', 'who', 'whom', 'when', 'where', 'how', 'why',
  'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'only', 'own', 'same', 'too', 'very', 'just',
  'as', 'also',
]);

export function isStopWord(word: string): boolean {
  return STOP_WORDS.has(word.toLowerCase());
}
