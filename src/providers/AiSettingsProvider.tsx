import React, {createContext, useContext, useState} from "react";

interface IAiSettings {
   model: string | null
   token: string
}

interface IAiSettingsContext {
   settings: IAiSettings
   changeAiSettings: (
      whatToChange: keyof IAiSettings,
      changeTo: IAiSettings[keyof IAiSettings],
   ) => void;
}

const AiSettingsContext = createContext<IAiSettingsContext | null>(null);

const initialAiSettings: IAiSettings = {
   model: null,
   token: "",
}

export const AiSettingsProvider = ({ children }: React.PropsWithChildren) => {
   const [settings, setSettings] = useState<IAiSettings>(initialAiSettings);

   const changeAiSettings = (
      whatToChange: keyof IAiSettings,
      changeTo: IAiSettings[keyof IAiSettings],
   ) => {
      setSettings(prev => ({
         ...prev,
         [whatToChange]: changeTo
      }));
   };

   return (
      <AiSettingsContext.Provider value={{ settings, changeAiSettings }}>
         {children}
      </AiSettingsContext.Provider>
   );
}

export const useAiSettings = () => {
   const context = useContext(AiSettingsContext);
   if (context == null) {
      throw new Error("Please use AiSettingsProvider as a parent element");
   }
   return context;
};
