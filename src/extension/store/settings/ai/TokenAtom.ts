import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage";

export const tokenAtom = atom<string>("", "tokenAtom")
  .pipe(withLocalStorage("tokenAtom"));
