import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {NextUIProvider} from "@nextui-org/system";

import App from './App.tsx'
import './styles/globals.css'
import {reatomContext} from '@reatom/npm-react';
import {createCtx} from "@reatom/core";

const ctx = createCtx()


createRoot(document.getElementById('root')!).render(
  <reatomContext.Provider value={ctx}>
    <StrictMode>
      <NextUIProvider>
        <App/>
      </NextUIProvider>
    </StrictMode>
  </reatomContext.Provider>
)
