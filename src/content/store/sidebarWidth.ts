import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage";


export const sidebarWidthAtom = atom(300, "sidebarWidthAtom")
  .pipe(withLocalStorage("sidebarWidthAtom"));
