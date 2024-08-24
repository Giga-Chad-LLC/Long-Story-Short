import SummarizationSettings from "../components/SummarizationSettings/SummarizationSettings.tsx";
import cn from "classnames";
import Header from "../components/Header/Header.tsx";
import {useDisclosure} from "@nextui-org/modal";
import AiSettingsModal from "../components/AiSettingsModal/AiSettingsModal.tsx";


interface MainProps {
   /**
    * Domain of the website viewed in the active tab
    */
   domain?: string
}

const Main = ({ domain }: MainProps) => {
   const {isOpen, onOpen, onOpenChange} = useDisclosure();

   return (
      <div className={cn(
         "container flex flex-col justify-between items-center py-4",
         "min-h-[600px] h-full w-[360px] overflow-auto m-auto",
      )}>
         <div>
            <Header className="mb-10" openSettings={() => onOpen()} />
            <SummarizationSettings />
         </div>

         <span className="font-light">{domain ? domain : "No website viewed"}</span>
         <AiSettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
   );
};

export default Main;
