import {atom} from "@reatom/core";
import {withLocalStorage} from "@reatom/persist-web-storage"

interface EncryptedToken {
  iv: string;
  encryptedToken: string;
}

export const encryptedTokenAtom = atom<EncryptedToken | null>(null, 'encryptedTokenAtom')
  .pipe(withLocalStorage("encryptedTokenAtom"));
