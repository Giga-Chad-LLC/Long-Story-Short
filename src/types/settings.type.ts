export interface ISummarizationInstruction {
  id: number;
  label: string;
  description: string;
  instruction: string;
  selected: boolean;
}

export interface SupportedAiAPI {
  id: "OPEN_API" | "HUGGING_FACE"
  label: string
}
