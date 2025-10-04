// Общее хранилище для активных анализов
export const activeAnalyses = new Map<string, any>()

export function setAnalysisStatus(requestId: string, status: any) {
  activeAnalyses.set(requestId, status)
}

export function getAnalysisStatus(requestId: string) {
  return activeAnalyses.get(requestId)
}

export function deleteAnalysis(requestId: string) {
  activeAnalyses.delete(requestId)
}
