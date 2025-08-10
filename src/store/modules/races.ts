import type { Race, RacingResponse } from "@/types/racing";
import { getNextRaces } from "@/services/racingApi";
import type { Module } from "vuex";
import type { RacesState, RootState, FetchRacesPayload } from "@/types/state";

export const races: Module<RacesState, RootState> = {
  namespaced: true,

  state: (): RacesState => ({
    races: null,
    loading: false,
    error: null,
  }),

  mutations: {
    SET_RACES(state: RacesState, races: RacingResponse) {
      state.races = races;
    },
    SET_LOADING(state: RacesState, loading: boolean) {
      state.loading = loading;
    },
    SET_ERROR(state: RacesState, error: string | null) {
      state.error = error;
    },
  },

  actions: {
    async fetchRaces({ commit }: FetchRacesPayload, count = 5) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const races = await getNextRaces(count);
        commit("SET_RACES", races);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch races";
        commit("SET_ERROR", errorMessage);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },

  getters: {
    getRaces: (state: RacesState) => state.races,
    isLoading: (state: RacesState) => state.loading,
    getError: (state: RacesState) => state.error,
    getRaceList: (state: RacesState): Race[] => {
      if (!state.races) return [];
      return Object.values(state.races.data.race_summaries);
    },
  },
};
