/**
 * Compares two strings using Dice's Coefficient algorithm.
 * Returns a value between 0 (completely different) and 1 (identical).
 *
 * The algorithm works by:
 * 1. Converting each string into bigrams (pairs of adjacent characters)
 * 2. Counting the number of common bigrams
 * 3. Applying the formula: (2 × common bigrams) / (total bigrams in both strings)
 *
 * @param str1 - First string to compare
 * @param str2 - Second string to compare
 * @returns Similarity score between 0 and 1
 *
 * @example
 * compareTwoStrings('hello', 'hallo') // Returns ~0.67
 * compareTwoStrings('same', 'same')   // Returns 1
 * compareTwoStrings('abc', 'xyz')     // Returns 0
 */
export function compareTwoStrings(str1: string, str2: string): number {
  // Identical strings
  if (str1 === str2) return 1;

  // Strings too short to have bigrams
  if (str1.length < 2 || str2.length < 2) return 0;

  // Build bigram frequency map for first string
  const bigrams = new Map<string, number>();
  for (let i = 0; i < str1.length - 1; i++) {
    const bigram = str1.substring(i, i + 2);
    bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
  }

  // Count matching bigrams from second string
  let matches = 0;
  for (let i = 0; i < str2.length - 1; i++) {
    const bigram = str2.substring(i, i + 2);
    const count = bigrams.get(bigram) || 0;
    if (count > 0) {
      matches++;
      bigrams.set(bigram, count - 1);
    }
  }

  // Calculate Dice's Coefficient
  const totalBigrams = (str1.length - 1) + (str2.length - 1);
  return (2 * matches) / totalBigrams;
}
