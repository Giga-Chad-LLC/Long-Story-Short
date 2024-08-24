import {Chip} from "@nextui-org/chip";
import {Button} from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import cn from "classnames";
import {PromptTextarea} from "../PromptTextarea/PromptTextarea.tsx";
import {useCallback} from "react";
import * as browser from "webextension-polyfill";
import {ISummarizationInstruction, Message} from "../../../types";
import {useAtom} from "@reatom/npm-react";
import {summarizationInstructionsAtom} from "../../../store/settings/summarization/SummarizationInstructionsAtom.ts";


const SummarizationSettings = () => {
  // const {summarizationSettings, changeSummarizationSettings} = useSummarizationSettings();
   const [instructions, setInstructions] = useAtom(summarizationInstructionsAtom);

  const handleClick = useCallback(async () => {
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});
    if (tab.id) {
      await browser.tabs.sendMessage<Message>(tab.id, {
        action: "addSidebar",
        data: ""
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
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
