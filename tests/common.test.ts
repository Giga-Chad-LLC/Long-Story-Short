import { test } from "bun:test";
import {Message} from "../src/types";

test("common", () => {
  const msg: Message = {
    action: "",
    selector: "",
    data: "",
  }

  console.log(Object.keys(msg));
});
