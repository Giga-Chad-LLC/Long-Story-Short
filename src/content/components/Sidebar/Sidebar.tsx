import {useState} from "react";
import {Button} from "@nextui-org/button";

export const Sidebar = () => {
  const [count, setCount] = useState(0);
  return <>
    <div>Count: {count}</div>
    <Button onClick={() => setCount(count => count + 1)}>Add</Button>
  </>
}
