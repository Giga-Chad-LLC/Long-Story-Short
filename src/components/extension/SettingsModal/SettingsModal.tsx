import {
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter
} from "@nextui-org/modal";
import {Select, SelectItem} from "@nextui-org/select";
import {Button} from "@nextui-org/button";
import {useAiSettings} from "../../../providers/AiSettingsProvider.tsx";
import {supportedAPIs} from "../../../data/llm-apis.ts";
import {Input} from "@nextui-org/input";
import {useEffect} from "react";


interface SettingsModalProps {
   isOpen: boolean
   onOpenChange: () => void
}

// TODO: create an array in data folder | after, use API to request models
const models = [{ label: "gpt-4o" }, { label: "gpt-4-turbo" }];


const SettingsModal = ({ isOpen, onOpenChange }: SettingsModalProps) => {
   const { settings, changeAiSettings } = useAiSettings()

   useEffect(() => {
      console.log(settings)
   }, [settings]);

   return (
      // TODO: dark mode for Modal not working
      <Modal
         isOpen={isOpen}
         placement="bottom"
         onOpenChange={onOpenChange}
         scrollBehavior="inside"
      >
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">Configure Extension</ModalHeader>
                  <ModalBody className="flex flex-col gap-6">
                     {/** Select with supported AI APIs */}
                     <Select
                        items={supportedAPIs}
                        label="Supported AI API"
                        labelPlacement="outside"
                        placeholder="Select one of the supported APIs"
                        classNames={{
                           // TODO: move into global css
                           label: "font-bold text-base"
                        }}
                        defaultSelectedKeys={
                           supportedAPIs
                              .map(item => item.id)
                              .filter(id => id === settings.api)
                        }
                        onChange={(event) => {
                           const value = (event.target.value === '') ? null : event.target.value;
                           changeAiSettings("api", value);
                        }}
                     >
                        {(api) => <SelectItem key={api.id}>{api.label}</SelectItem>}
                     </Select>


                     <Select
                        items={models}
                        label="API's Model"
                        labelPlacement="outside"
                        placeholder="Select API's model"
                        classNames={{
                           label: "font-bold text-base"
                        }}
                        defaultSelectedKeys={
                           models
                              .filter(model => model.label === settings.model)
                              .map(model => model.label)
                        }
                        onChange={(event) => {
                           const value = (event.target.value === '') ? null : event.target.value;
                           changeAiSettings("model", value);
                        }}
                     >
                        {(model) => <SelectItem key={model.label}>{model.label}</SelectItem>}
                     </Select>

                     <Input
                        type="password"
                        label="API Token"
                        labelPlacement="outside"
                        placeholder="Enter your API token"
                        value={settings.token}
                        classNames={{
                           label: "font-bold text-base"
                        }}
                        onChange={(event) => changeAiSettings("token", event.target.value)}
                     />
                  </ModalBody>

                  {/*<ModalFooter>
                     <Button color="danger" variant="light" onPress={onClose}>Dismiss</Button>
                  </ModalFooter>*/}
               </>
            )}
         </ModalContent>
      </Modal>
   );
};

export default SettingsModal;