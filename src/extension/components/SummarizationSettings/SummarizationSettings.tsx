import {Chip} from "@nextui-org/chip";
import {Button} from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import cn from "classnames";
import {PromptTextarea} from "../PromptTextarea/PromptTextarea.tsx";
import {useCallback, useEffect, useState} from "react";
import {ISummarizationInstruction, SummarizationRequestPayload} from "../../../types";
import {useAtom} from "@reatom/npm-react";
import {summarizationInstructionsAtom} from "../../../store/settings/summarization/SummarizationInstructionsAtom.ts";
import {MessageApi} from "../../../shared/protocol/MessageApi.ts";
import {messageActions} from "../../../data/message-actions.ts";
import {promptAtom} from "../../../store/settings/summarization/promptAtom.ts";
import {aiApiAtom} from "../../../store/settings/ai/ApiAtom.ts";
import {modelAtom} from "../../../store/settings/ai/ModelAtom.ts";
import {tokenAtom} from "../../../store/settings/ai/TokenAtom.ts";
import {encryptedTokenAtom} from "../../../store/encryptedTokenAtom.ts";


const SummarizationSettings = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [api] = useAtom(aiApiAtom)
  const [model] = useAtom(modelAtom)

  const [promptText] = useAtom(promptAtom);
  const [instructions, setInstructions] = useAtom(summarizationInstructionsAtom);

  const [encryptedToken] = useAtom(encryptedTokenAtom);

  // TODO: check correctness of this implementation
  useEffect(() => {
    if (errorMessage) {
      // clear error
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => setErrorMessage(null), 5000)
      setTimeoutId(id);
    }
  }, [errorMessage]);

  const handleClick = useCallback(async () => {
    if (!api || !model || !encryptedToken) {
      setErrorMessage(`Either api, model, or token were are unset (${api ? '' : 'api missing'}, ${model ? '' : 'model missing'}, ${encryptedToken ? '' : 'token missing'})`);
      return;
    }

    console.log("selected instructions", instructions
      .filter(item => item.selected))

    // send data to content script
    await MessageApi.send<SummarizationRequestPayload>(messageActions.requestSummarization, {
      request: {
        api: api!.id,
        model: model!,
      },
      iv: encryptedToken.iv,
      encryptedToken: encryptedToken.encryptedToken,
      objective: promptText,
      instructions: instructions
                      .filter(item => item.selected)
                      .map(item => item.instruction),
    });
  }, [api, model, promptText, instructions, encryptedToken]);

  return (
    <div className="flex flex-col gap-8">
      {/* TODO: how normal error notification */}
      {errorMessage ? <span className="text-red-700">{errorMessage}</span> : null}

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
        <Button color="primary" variant="shadow">Summarize in 10 words</Button>
        <Button color="primary" variant="shadow" onClick={handleClick}>Summarize the content</Button>
      </div>
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
        <Tooltip key={index} showArrow={true} delay={1200} content={item.description}>
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
