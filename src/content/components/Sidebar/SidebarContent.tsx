import {useEffect, useState} from "react";
import {parseStreamResponse} from "../../../util/parseStreamResponse.ts";
import ReactMarkdown from "react-markdown";
import {SidebarView} from "./SidebarView.tsx";


export const SidebarContent = () => {
  const [_finished, setFinished] = useState(false);
  const [parts, setAnswerParts] = useState<string[]>([]);

  useEffect(() => {
    // TODO: refactor + re-implement with axios
    fetch(`http://127.0.0.1:8000/get_answer?query=${"Hello"}`, {
      method: "GET",
    }).then(async (res) => {
      await parseStreamResponse(res, (done, data) => {
        if (done) {
          setFinished(true);
          return true;
        }

        switch (data.reason) {
          case "CHUNK": {
            setAnswerParts((prev) => [...prev, data.content]);
            break;
          }
          case "END": {
            setFinished(true);
            break;
          }
        }
        return false;
      });
    });
  }, []);

  const message = parts.join("");

  return (
    <SidebarView>
      <ReactMarkdown>{message}</ReactMarkdown>
    </SidebarView>
  );
}
