import type { RacingResponse } from "@/types/racing";

export type RacesState = {
  races: RacingResponse | null;
  loading: boolean;
  error: string | null;
};

export type FetchRacesPayload = {
  commit: (
    mutation: string,
    payload?: RacingResponse | boolean | string | null
  ) => void;
};

export interface RootState {
  races: RacesState;
}
