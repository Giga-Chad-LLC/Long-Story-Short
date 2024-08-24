import React, {createContext, useContext, useState} from "react";
import {ISummarizationSettings, ISummarizationSettingsContext} from "./types.ts";
import {summarizationSettings} from "../data/summarization-settings.ts";


// summarization settings data
const initialSummarizationSettings: ISummarizationSettings = {
   objective: "",
   instructions: summarizationSettings.map((item, index) => ({
      id: index,
      label: item.label,
      description: item.description,
      instruction: item.instruction,
      selected: false,
   })),
};

// Create context

const SummarizationSettingsContext = createContext<ISummarizationSettingsContext | null>(null);

// provider component
export const SummarizationSettingsProvider = ({ children }: React.PropsWithChildren) => {
   const [summarizationSettings, setSummarizationSettings] = useState<ISummarizationSettings>(initialSummarizationSettings)

   const changeSummarizationSettings = (
      whatToChange: keyof ISummarizationSettings,
      changeTo: ISummarizationSettings[keyof ISummarizationSettings],
   ) => {
      setSummarizationSettings(prev => ({
         ...prev,
         [whatToChange]: changeTo
      }));
   }

   return (
      <SummarizationSettingsContext.Provider value={{
         summarizationSettings,
         changeSummarizationSettings,
      }}>
         {children}
      </SummarizationSettingsContext.Provider>
   );
}

export const useSummarizationSettings = () => {
   const context = useContext(SummarizationSettingsContext);
   if (context == null) {
      throw new Error("Please use SummarizationSettingsProvider as a parent element");
   }
   return context;
};