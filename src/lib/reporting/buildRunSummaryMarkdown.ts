export function buildRunSummaryMarkdown(runId: string, scores: { manualSpecScore: number; productionOpenapi3Score: number; liveVerifiedCoverageScore: number; generationReadiness: string }): string {
  return `# Run Summary ${runId}\n\n- Manual Spec Trustworthiness: ${scores.manualSpecScore}/100\n- Production OpenAPI 3 Compatibility: ${scores.productionOpenapi3Score}/100\n- Live Verified Coverage: ${scores.liveVerifiedCoverageScore}/100\n- Generation Readiness: ${scores.generationReadiness}\n`;
}
