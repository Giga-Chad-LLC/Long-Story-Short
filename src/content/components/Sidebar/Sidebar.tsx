import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import {useAtom} from "@reatom/npm-react";
import {countAtom} from "../../store/countAtom.ts";


const decoder = new TextDecoder();

export const Sidebar = () => {
  const [count, setCount] = useAtom(countAtom);

  const [finished, setFinished] = useState(false);
  const [parts, setAnswerParts] = useState<string[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/get_answer?query=${"Hello"}`, {
      method: "GET",
    }).then(async (res) => {
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Reader is undefined");

      let done = false;
      const chunks = new Array<string>();

      while (!done) {
        const {value, done: isDone} = await reader.read();
        done = isDone;

        if (value) {
          const responses = decoder.decode(value).split("\n");
          responses.forEach((response) => {
            try {
              const chunkText = response.replace("data:", "").trim();
              const data = JSON.parse(chunkText);

              switch (data.reason) {
                case "CHUNK": {
                  chunks.push(data.content);
                  setAnswerParts((prev) => [...prev, data.content]);
                  break;
                }
                case "END": {
                  setFinished(true);
                  break;
                }
              }
            } catch {
              console.log(parts)
            }
          });
        }

        if (done) {
          setFinished(true);
        }
      }
    });
  }, []);

  const message = parts.join("");

  return <>
    <div>Count: {count}</div>
    <Button onClick={() => setCount(count => count + 1)}>Add</Button>
    Done: {finished ? "true" : "false"}
    Message:<br/>{message}
  </>
}
