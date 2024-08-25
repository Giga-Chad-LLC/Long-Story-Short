import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody, ModalFooter,
} from "@nextui-org/modal";
import {Select, SelectItem} from "@nextui-org/select";
import {supportedAiAPIs} from "../../../data/llm-apis.ts";
import {Input} from "@nextui-org/input";
import {aiApiAtom} from "../../../store/settings/ai/ApiAtom.ts";
import {useAtom} from "@reatom/npm-react";
import {tokenAtom} from "../../../store/settings/ai/TokenAtom.ts";
import {modelAtom} from "../../../store/settings/ai/ModelAtom.ts";
import {useEffect} from "react";
import {encryptToken} from "../../../util/encryptToken.ts";
import {Tooltip} from "@nextui-org/tooltip";
import {encryptedTokenAtom} from "../../../store/encryptedTokenAtom.ts";


interface SettingsModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

// TODO: create an array in data folder | after, use API to request models
const models = [{label: "gpt-4o"}, {label: "gpt-4-turbo"}];


const AiSettingsModal = ({isOpen, onOpenChange}: SettingsModalProps) => {
  const [aiApi, setAiApi] = useAtom(aiApiAtom);
  const [aiModel, setAiModel] = useAtom(modelAtom);
  const [token, setToken] = useAtom(tokenAtom);

  const [, setEncryptedToken] = useAtom(encryptedTokenAtom);

  useEffect(() => {
    console.log({
      api: aiApi,
      model: aiModel,
      token,
    });
  }, [aiApi, aiModel, token])

  return (
    // TODO: dark mode for Modal not working
    <Modal
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(_onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Configure Extension</ModalHeader>
            <ModalBody className="flex flex-col gap-6">
              {/** Select with supported AI APIs */}
              <Select
                items={supportedAiAPIs}
                label="Supported AI API"
                labelPlacement="outside"
                placeholder="Select one of the supported APIs"
                classNames={{
                  // TODO: move into global css
                  label: "font-bold text-base",
                }}
                defaultSelectedKeys={
                  supportedAiAPIs
                    .map(item => item.id)
                    .filter(id => id === aiApi?.id)
                }
                onChange={(event) => {
                  const filtered = supportedAiAPIs.filter(item => item.id === event.target.value)
                  if (filtered.length > 0) {
                    setAiApi(filtered[0]);
                  }
                  else {
                    setAiApi(null);
                  }
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
                  label: "font-bold text-base",
                }}
                defaultSelectedKeys={
                  models.filter(model => model.label === aiModel)
                    .map(model => model.label)
                }
                onChange={(event) => {
                  const filtered = models.filter(model => model.label === event.target.value);
                  if (filtered.length > 0) {
                    setAiModel(event.target.value);
                  }
                  else {
                    setAiModel(null);
                  }
                }}
              >
                {(model) => <SelectItem key={model.label}>{model.label}</SelectItem>}
              </Select>

              <Tooltip showArrow={true} delay={500} content="We store encrypted tokens to avoid token leakage on frontend">
                <Input
                  type="password"
                  label="API Token"
                  labelPlacement="outside"
                  placeholder="Enter your API token"
                  value={token}
                  classNames={{
                    label: "font-bold text-base",
                  }}
                  onValueChange={async (value) => {
                    if (value) {
                      // NOTE: store only encrypted token on the frontend to prevent token leakage
                      const { iv, encryptedToken } = await encryptToken(value);
                      setEncryptedToken({ iv, encryptedToken });
                      setToken("*".repeat(value.length));
                    }
                    else {
                      setEncryptedToken(null);
                      setToken(value);
                    }
                  }}
                />
              </Tooltip>
            </ModalBody>

            <ModalFooter>
              {/*<Button color="danger" variant="light" onPress={onClose}>Dismiss</Button>*/}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AiSettingsModal;
