import { atom } from '@reatom/core';
import {summarizationSettings} from "../../../data/summarization-settings.ts";
import {withLocalStorage} from "@reatom/persist-web-storage";
import {ISummarizationInstruction} from "../../../types";


// summarization settings data
const initialSummarizationInstructions: ISummarizationInstruction[] = summarizationSettings.map((item, index) => ({
  id: index,
  label: item.label,
  description: item.description,
  instruction: item.instruction,
  selected: false,
}));


export const summarizationInstructionsAtom = atom(initialSummarizationInstructions, "summarizationInstructionsAtom")
  .pipe(withLocalStorage("summarizationInstructionsAtom"));

