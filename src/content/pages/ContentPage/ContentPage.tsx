import {Sidebar} from "../../components/Sidebar/Sidebar.tsx";
import {NextUIProvider} from "@nextui-org/system";
import {reatomContext} from '@reatom/npm-react';
import {ctx} from "../../store/context.ts";
import {SummarizationRequestPayload} from "../../../types";

interface ContentPageProps {
  payload: SummarizationRequestPayload
}

const ContentPage = ({ payload }: ContentPageProps) => {
  return <>
    <reatomContext.Provider value={ctx}>
      <NextUIProvider>
        <Sidebar payload={payload} />
      </NextUIProvider>
    </reatomContext.Provider>
  </>
}

export default ContentPage;
