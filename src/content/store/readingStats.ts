import {atom} from "@reatom/core";

interface ReadingTime {
  minutes: number;
  words: number;
  text: string;
};

export const readingStatsAtom = atom<ReadingTime | null>(null);
