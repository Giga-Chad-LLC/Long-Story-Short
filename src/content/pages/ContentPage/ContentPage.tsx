import {SidebarContent} from "../../components/Sidebar/SidebarContent.tsx";
import {NextUIProvider} from "@nextui-org/system";
import {reatomContext} from '@reatom/npm-react';
import {ctx} from "../../store/context.ts";


const ContentPage = () => {
  return <>
    <reatomContext.Provider value={ctx}>
      <NextUIProvider>
        <SidebarContent />
      </NextUIProvider>
    </reatomContext.Provider>
  </>
}

export default ContentPage;
