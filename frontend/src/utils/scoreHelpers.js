/**
 * Get text color based on priority score
 */
export function getScoreColor(score, dark = false) {
  if (score >= 85) return "#cf0000";
  if (score >= 65) return dark ? "#e8a020" : "#cf6800";
  return dark ? "#5ecf30" : "#68cf00";
}

/**
 * Get progress bar color based on score
 */
export function getBarColor(score) {
  if (score >= 85) return "#cf0000";
  if (score >= 70) return "#cf9f00";
  if (score >= 60) return "#cf6800";
  return "#68cf00";
}

/**
 * Get bar width percentage
 */
export function getBarWidth(score) {
  return `${score}%`;
}
