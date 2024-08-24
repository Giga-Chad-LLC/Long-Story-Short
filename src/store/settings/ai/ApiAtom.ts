import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage";
import {SupportedAiAPI} from "../../../types";

export const aiApiAtom = atom<SupportedAiAPI | null>(null, "aiApiAtom")
  .pipe(withLocalStorage("aiApiAtom"));
