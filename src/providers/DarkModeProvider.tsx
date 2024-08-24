import React, {createContext, useContext, useState} from "react";

interface IDarkModeContext {
   darkMode: boolean
   toggleDarkMode: () => void
}

const DarkModeContext = createContext<IDarkModeContext | null>(null);

export const DarkModeProvider = ({ children }: React.PropsWithChildren) => {
   const [darkMode, setDarkMode] = useState(false);

   const toggleDarkMode = () => setDarkMode(prev => !prev);

   return (
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
         {children}
      </DarkModeContext.Provider>
   );
}

export const useDarkMode = () => {
   const context = useContext(DarkModeContext);
   if (context == null) {
      throw new Error("Please use DarkModeProvider as a parent element");
   }
   return context;
}