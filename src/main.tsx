import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {NextUIProvider} from "@nextui-org/system";

import App from './App.tsx'
import './styles/globals.css'
import {SummarizationSettingsProvider} from "./providers/SummarizationSettingsProvider.tsx";
import {AiSettingsProvider} from "./providers/AiSettingsProvider.tsx";
import {reatomContext} from '@reatom/npm-react';
import {createCtx} from "@reatom/core";

const ctx = createCtx()


createRoot(document.getElementById('root')!).render(
  <reatomContext.Provider value={ctx}>
    <StrictMode>
      {/*TODO: use withProviders */}
      <AiSettingsProvider>
        <SummarizationSettingsProvider>
          <NextUIProvider>
            <App/>
          </NextUIProvider>
        </SummarizationSettingsProvider>
      </AiSettingsProvider>
    </StrictMode>
  </reatomContext.Provider>
)
