import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import {useAtom} from "@reatom/npm-react";
import {countAtom} from "../../store/countAtom.ts";
import {parseStreamResponse} from "../../../util/parseStreamResponse.ts";
import ReactMarkdown from "react-markdown";


export const Sidebar = () => {
  const [count, setCount] = useAtom(countAtom);

  const [_finished, setFinished] = useState(false);
  const [parts, setAnswerParts] = useState<string[]>([]);

  useEffect(() => {
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

  return <>
    <div>Count: {count}</div>
    <Button onClick={() => setCount(count => count + 1)}>Add</Button>

    <div>
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  </>
}
