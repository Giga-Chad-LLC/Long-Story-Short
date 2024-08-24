import {promptAtom} from "../../../store/settings/summarization/promptAtom.ts";
import {useAtom} from "@reatom/npm-react";
import {Textarea} from "@nextui-org/input";

export const PromptTextarea = () => {
  const [promptText, setPromptText] = useAtom(promptAtom);

  return <Textarea
    label="Summarization objective"
    disableAutosize={false}
    minRows={4}
    labelPlacement="outside"
    placeholder='Describe the goals you want to achieve by reading the resource, e.g. "Better understand the topic"'
    defaultValue={promptText}
    classNames={{
      label: "font-bold text-base"
    }}
    onValueChange={(value) => setPromptText(value)}
  />
}
