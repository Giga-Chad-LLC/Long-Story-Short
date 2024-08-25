
interface SummarizationItem {
   label: string
   description: string
   instruction: string
}

export const summarizationSettings: SummarizationItem[] = [
   {
      label: "Formal",
      description: "Formal",
      instruction: "Use formal writing style",
   },
   {
      label: "Easy-to-read",
      description: "Easy-to-read",
      instruction: "Your response should be easy-to-read",
   },
   {
      label: "For 14-year-old",
      description: "For 14-year-old",
      instruction: "Your response should be understandable by a 14-year-old kid",
   },
   {
      label: "Concise",
      description: "Concise",
      instruction: "You response should be clear and concise",
   },
   {
      label: "For student",
      description: "For student",
      instruction: "You response should be easily understandable by a university student",
   },
   {
      label: "Step-by-step",
      description: "Step-by-step",
      instruction: "Let's summarize the text step-by-step providing a structured well-put-together narrative",
   },
]
