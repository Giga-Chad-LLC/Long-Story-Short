import {useAtom} from "@reatom/npm-react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {generateSummaryAtom} from "../../../store/generateSummary.ts";
import rehypeRaw from "rehype-raw";
import {PluggableList} from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface SettingsModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

export const ShortPromptModal = ({isOpen, onOpenChange}: SettingsModalProps) => {
  const [parts] = useAtom(generateSummaryAtom);
  const message = parts.join("");

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Short summary</ModalHeader>
        <ModalBody className="text-xl"><ReactMarkdown
          className={"prose prose-pre:p-0 prose-pre:bg-zinc-700"}
          rehypePlugins={[rehypeRaw] as PluggableList}
          remarkPlugins={[remarkGfm]}
        >
          {message}
        </ReactMarkdown>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
