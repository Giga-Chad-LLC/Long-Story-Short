
export type SupportedApiId = "OPEN_API" | "HUGGING_FACE"

export interface SupportedAPI {
   id: SupportedApiId
   label: string
}

export const supportedAPIs: SupportedAPI[] = [
   {
      id: "OPEN_API",
      label: "OpenAI",
   },
   {
      id: "HUGGING_FACE",
      label: "Hugging Face",
   }
]
