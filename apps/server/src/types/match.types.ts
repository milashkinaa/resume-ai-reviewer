export interface ImprovementItem {
  title: string
  value: string
}

export interface MatchResponse {
  resumeImprovements: ImprovementItem[]
  knowledgeImprovements: ImprovementItem[]
}
