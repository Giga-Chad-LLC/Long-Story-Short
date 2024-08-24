import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage"

export const darkModeAtom = atom(false, 'darkModeAtom')
    .pipe(withLocalStorage("darkModeAtom"));