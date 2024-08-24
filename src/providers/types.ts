export interface ISummarizationInstruction {
   id: number;
   label: string;
   description: string;
   instruction: string;
   selected: boolean;
}

export interface ISummarizationSettings {
   objective: string
   instructions: ISummarizationInstruction[]
}

export interface ISummarizationSettingsContext {
   summarizationSettings: ISummarizationSettings;
   changeSummarizationSettings: (
      whatToChange: keyof ISummarizationSettings,
      changeTo: ISummarizationSettings[keyof ISummarizationSettings],
   ) => void;
}