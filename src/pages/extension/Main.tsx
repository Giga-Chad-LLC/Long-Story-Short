import SummarizationSettings from "../../components/extension/SummarizationSettings/SummarizationSettings.tsx";
import {cn} from "../../lib/utils.ts";
import Header from "../../components/extension/Header/Header.tsx";
import {useDisclosure} from "@nextui-org/modal";
import SettingsModal from "../../components/extension/SettingsModal/SettingsModal.tsx";


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
         <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
   );
};

export default Main;