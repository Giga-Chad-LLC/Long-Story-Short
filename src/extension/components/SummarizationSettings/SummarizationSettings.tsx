import {Chip} from "@nextui-org/chip";
import {Button} from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import cn from "classnames";
import {PromptTextarea} from "../PromptTextarea/PromptTextarea.tsx";
import {useCallback, useMemo} from "react";
import {ISummarizationInstruction, SelectorPayload, SummarizationRequestPayload} from "../../../shared/types";
import {useAction, useAtom} from "@reatom/npm-react";
import {summarizationInstructionsAtom} from "../../store/settings/summarization/SummarizationInstructionsAtom.ts";
import {MessageApi} from "../../../shared/protocol/MessageApi.ts";
import {messageActions} from "../../data/message-actions.ts";
import {promptAtom} from "../../store/settings/summarization/promptAtom.ts";
import {aiApiAtom} from "../../store/settings/ai/ApiAtom.ts";
import {modelAtom} from "../../store/settings/ai/ModelAtom.ts";
import {tokenAtom} from "../../store/settings/ai/TokenAtom.ts";
import {BODY_COMPONENT_CLASSNAME} from "../../../content/constants.ts";
import {domElementToText} from "../../../shared/util";
import {generateSummaryAction} from "../../../store/generateSummary.ts";
import {useDisclosure} from "@nextui-org/modal";
import {ShortPromptModal} from "../ShortPromptModal/ShortPromptModal.tsx";

const SummarizationSettings = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [api] = useAtom(aiApiAtom)
  const [model] = useAtom(modelAtom)
  const [token] = useAtom(tokenAtom)
  const generateSummary = useAction(generateSummaryAction);
  const [promptText] = useAtom(promptAtom);
  const [instructions, setInstructions] = useAtom(summarizationInstructionsAtom);

  const isInvalid = useMemo(() => {
    return !api || !model || !token
  }, [api, model, token]);

  const errorMessage = useMemo(() => {
    if (!isInvalid) return null;
    return `Either api, model, or token were are unset (${api ? '' : 'api missing'}, ${model ? '' : 'model missing'}, ${token ? '' : 'token missing'})`;
  }, [api, model, token, isInvalid])

  const handleClick = useCallback(() => {
    // send data to content script
    MessageApi.send<SummarizationRequestPayload>(messageActions.requestSummarization, {
      request: {
        api: api!.id,
        model: model!,
        token,
      },
      objective: promptText,
      instructions: instructions
        .filter(item => item.selected)
        .map(item => item.instruction),
    });
  }, [api, model, token, promptText, instructions]);

  const handleClickShort = useCallback(async () => {
    // send data to content script
    const fakeElement = document.createElement("div");
    fakeElement.innerText = await MessageApi.send<SelectorPayload, string>(messageActions.getElementBySelector, {
      selector: "html"
    });
    const body = fakeElement.querySelector('body > section.' + BODY_COMPONENT_CLASSNAME);
    const text = domElementToText(body);

    const queryParams: Record<string, string> = {
      short_summary: 'true',
      api: api!.id,
      model: model!,
      token: token,
      objective: promptText,
      text: text.slice(0, 5000),
    }

    const params = new URLSearchParams(queryParams);
    // insert instructions
    if (instructions.length > 0) {
      instructions.forEach(instruction => params.append("instructions", instruction.instruction));
    } else {
      params.append("instructions", "");
    }
    onOpen();
    generateSummary(params.toString());
  }, [onOpen, generateSummary, api, model, token, promptText, instructions])

  return (
    <div className="flex flex-col gap-8">
      {errorMessage && <span className="text-red-700">{errorMessage}</span>}

      <PromptTextarea/>

      <div>
        <h3>Select summarization style</h3>
        <ChipsContainer
          instructions={instructions}
          onChipClick={(item) => setInstructions(prev => (
            // toggle selection state of the clicked item
            prev.map(other => ({
              ...other,
              selected: (other.id === item.id) ? !other.selected : other.selected,
            }))
          ))
          }
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button isDisabled={isInvalid} color="primary" variant="shadow" onClick={handleClickShort}>Summarize in 10
          words</Button>
        <Button isDisabled={isInvalid} color="primary" variant="shadow" onClick={() => {
          window.close()
          handleClick();
        }}>Summarize the content</Button>
      </div>

      <ShortPromptModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};


interface ChipsContainerProps {
  className?: string;
  instructions: ISummarizationInstruction[]
  onChipClick: (item: ISummarizationInstruction) => void
}

const ChipsContainer = ({className, instructions, onChipClick}: ChipsContainerProps) => {
  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      className,
    )}>
      {instructions.map((item, index) => (
        <Tooltip key={index} placement={index > 2 ? "bottom" : "top"} showArrow={true} delay={1200}
                 content={item.description}>
          <Chip
            color={item.selected ? "primary" : "default"}
            variant="shadow"
            className="py-0.5 pr-1 cursor-pointer"
            onClick={() => onChipClick(item)}
          >
            {item.label}
          </Chip>
        </Tooltip>
      ))}
    </div>
  );
}

export default SummarizationSettings;
