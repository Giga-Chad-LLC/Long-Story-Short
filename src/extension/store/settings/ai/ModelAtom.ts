import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage";

export const modelAtom = atom<string | null>(null, "modelAtom")
  .pipe(withLocalStorage("modelAtom"));
