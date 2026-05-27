/**
 * Calculate priority score (0-100) based on multi-factor weights.
 *
 * Factors:
 * - Severity (30%): from urgency_score
 * - Frequency (25%): number of similar reports in cluster
 * - Vulnerability (20%): impacts vulnerable groups
 * - Recency (15%): how recent and trending
 * - Sentiment Intensity (10%): strength of negative sentiment
 */
function calculatePriorityScore({
  urgencyScore = 0,      // 0-1
  clusterSize = 1,       // number of reports in same cluster
  isVulnerable = false,  // impacts children, elderly, disabled
  recentTrend = 0,       // 0-1 (how much reports increased)
  sentimentScore = 0,    // 0-1 (intensity of negative sentiment)
}) {
  const severity = urgencyScore * 100 * 0.3;
  const frequency = Math.min(clusterSize / 50, 1) * 100 * 0.25;
  const vulnerability = (isVulnerable ? 1 : 0) * 100 * 0.2;
  const recency = recentTrend * 100 * 0.15;
  const sentiment = sentimentScore * 100 * 0.1;

  const total = severity + frequency + vulnerability + recency + sentiment;
  return Math.round(Math.min(total, 100));
}

module.exports = calculatePriorityScore;
