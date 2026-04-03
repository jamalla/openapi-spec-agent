export interface ScoreInput {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  fixtureRequired: number;
  staticOnly: number;
  manualSpecIssueCount: number;
  avgCompatibility: number;
}

export function scoreRun(input: ScoreInput) {
  const manualSpecScore = Math.max(0, 100 - input.manualSpecIssueCount * 8);
  const productionOpenapi3Score = Math.round(input.avgCompatibility);
  const liveDenominator = Math.max(1, input.total - input.staticOnly);
  const liveVerifiedCoverageScore = Math.round((input.passed / liveDenominator) * 100);

  const generationReadiness = failedOrCritical(input.failed, input.blocked) ? 'NOT_READY' : manualSpecScore >= 80 && productionOpenapi3Score >= 80 && liveVerifiedCoverageScore >= 70 ? 'READY' : 'READY_WITH_FIXES';

  return { manualSpecScore, productionOpenapi3Score, liveVerifiedCoverageScore, generationReadiness };
}

function failedOrCritical(failed: number, blocked: number): boolean {
  return failed > 0 || blocked > 0;
}
