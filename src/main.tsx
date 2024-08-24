import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {NextUIProvider} from "@nextui-org/system";

import App from './App.tsx'
import './styles/globals.css'
import {SummarizationSettingsProvider} from "./providers/SummarizationSettingsProvider.tsx";
import {DarkModeProvider} from "./providers/DarkModeProvider.tsx";
import {AiSettingsProvider} from "./providers/AiSettingsProvider.tsx";


createRoot(document.getElementById('root')!).render(
   <StrictMode>
      {/*TODO: use withProviders */}
      <AiSettingsProvider>
         <DarkModeProvider>
            <SummarizationSettingsProvider>
               <NextUIProvider>
                  <App />
               </NextUIProvider>
            </SummarizationSettingsProvider>
         </DarkModeProvider>
      </AiSettingsProvider>
   </StrictMode>,
)
