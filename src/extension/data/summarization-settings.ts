
interface SummarizationItem {
   label: string
   description: string
   instruction: string
}

export const summarizationSettings: SummarizationItem[] = [
   {
      label: "Formal",
      description: "Formal style of writing",
      instruction: "User formal style of writing that you would normally see in the articles or newspapers.",
   },
   {
      label: "Easy-to-read",
      description: "Easy-to-read summaries with fewer words in a sentence",
      instruction: "The response MUST be easy-to-read, and the sentences MUST NOT be longer than 40 words! Keep it as simple as possible!",
   },
   {
      label: "For 14-year-old",
      description: "Young kids should understand the summary",
      instruction: "The summary will be read by a your kid, near 14 years old. Your summary should be simple enough to allow the kid fully understand the summary. User simpler vocabulary in sentences that is common among students.",
   },
   {
      label: "Concise",
      description: "Concise summarization with a preference of button-points over paragraphs",
      instruction: "You response should be clear and concise. Your sentences should be short and easy-to-read. Use more button-point summarization rather then summarizing in paragraphs. Less text, the better! It it as short as possible but still present main aspects!",
   },
   {
      label: "For student",
      description: "University student should be able to understand the summary",
      instruction: "The summary will be read by a university student. Your summary should be simple enough to allow the student fully understand the summary. User simpler vocabulary in sentences that is common among students.",
   },
   {
      label: "Step-by-step",
      description: "Step-by-step summarization",
      instruction: "Let's summarize the text step-by-step providing a structured well-put-together narrative",
   },
]
