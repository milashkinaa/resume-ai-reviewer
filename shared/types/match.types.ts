/** Элемент рекомендации (улучшение резюме или навык) */
export interface ImprovementItem {
  title: string
  value: string
}

/** Ответ API проверки соответствия резюме и вакансии */
export interface MatchResponse {
  resumeImprovements: ImprovementItem[]
  knowledgeImprovements: ImprovementItem[]
}
