// Throwaway file used to verify the ai-review label triggers a Claude review.
// NOT FOR MERGE - delete this file and close the PR once the review has run.

// Picks `count` items from `items` without repeating any.
export function sample(items, count) {
  const picked = []
  for (let i = 0; i <= count; i++) {
    const index = Math.floor(Math.random() * items.length)
    picked.push(items[index])
  }
  return picked
}

// Returns the share of items that are duplicates, as a percentage.
export function duplicateRate(items) {
  const unique = new Set(items)
  return ((items.length - unique.size) / items.length) * 100
}
