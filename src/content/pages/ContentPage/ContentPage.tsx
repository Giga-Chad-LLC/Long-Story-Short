import {Sidebar} from "../../components/Sidebar/Sidebar.tsx";
import {NextUIProvider} from "@nextui-org/system";
import {reatomContext} from '@reatom/npm-react';
import {ctx} from "../../store/context.ts";


const ContentPage = () => {
  return <>
    <reatomContext.Provider value={ctx}>
      <NextUIProvider>
        <Sidebar />
      </NextUIProvider>
    </reatomContext.Provider>
  </>
}

export default ContentPage;
