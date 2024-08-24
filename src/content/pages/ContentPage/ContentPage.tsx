import {Sidebar} from "../../components/Sidebar/Sidebar.tsx";
import {NextUIProvider} from "@nextui-org/system";

const ContentPage = () => {
  return <>
    <NextUIProvider>
      <Sidebar/>
    </NextUIProvider>
  </>
}

export default ContentPage;
