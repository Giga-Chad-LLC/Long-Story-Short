import {Textarea} from "@nextui-org/input";
import {Chip} from "@nextui-org/chip";
import {Button} from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import {useSummarizationSettings} from "../../../providers/SummarizationSettingsProvider.tsx";
import {ISummarizationInstruction} from "../../../providers/types.ts";
import {cn} from "../../../lib/utils.ts";


const SummarizationSettings = () => {
   // @ts-ignore
   const { summarizationSettings, changeSummarizationSettings } = useSummarizationSettings();

   return (
      <div className="flex flex-col gap-8">
         <Textarea
            label="Summarization objective"
            disableAutosize={false}
            minRows={4}
            labelPlacement="outside"
            placeholder='Describe the goals you want to achieve by reading the resource, e.g. "Better understand the topic"'
            defaultValue={summarizationSettings.objective}
            classNames={{
               label: "font-bold text-base"
            }}
            onChange={(event) => changeSummarizationSettings("objective", event.target.value)}
         />

         {/** chips */}
         <div>
            <h3>Select summarization style</h3>
            <ChipsContainer
               instructions={summarizationSettings.instructions}
               onChipClick={(item) => {
                  // toggle selection state of the clicked item
                  const updatedInstructions = summarizationSettings.instructions
                     .map(other => ({
                        ...other,
                        selected: (other.id === item.id) ? !other.selected : other.selected,
                     }));

                  changeSummarizationSettings("instructions", updatedInstructions);
               }}
            />
         </div>

         <div className="flex flex-col gap-4">
            <Button color="primary" variant="shadow">Summarize in 10 words</Button>
            <Button color="primary" variant="shadow">Summarize the content</Button>
         </div>
      </div>
   );
};


interface ChipsBlockProps {
   className?: string;
   instructions: ISummarizationInstruction[]
   onChipClick: (item: ISummarizationInstruction) => void
}

const ChipsContainer = ({ className, instructions, onChipClick }: ChipsBlockProps) => {
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