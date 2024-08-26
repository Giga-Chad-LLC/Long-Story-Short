import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage"

export const darkModeAtom = atom(false, 'darkModeAtom')
    .pipe(withLocalStorage("darkModeAtom"));

//
// export const isUserLoading = atom(
//   (ctx) => ctx.spy(darkModeAtom.pendingAtom) > 0,
//   "getMeLoading",
// );
