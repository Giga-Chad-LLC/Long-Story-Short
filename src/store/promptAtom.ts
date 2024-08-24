import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage";

export const promptAtom = atom("", "promptAtom")
  .pipe(withLocalStorage("promptAtom"));
