export const PROJECT_DESCRIPTION_MAX_WORDS = 40

export function countProjectDescriptionWords(description: string): number {
  const normalized = description.trim()
  return normalized ? normalized.split(/\s+/).length : 0
}
