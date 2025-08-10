import { createStore } from "vuex";
import { races } from "./modules/races";

export default createStore({
  modules: {
    races,
  },
});
