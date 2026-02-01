import City from "@/utils/adapters/City";

import { localStorageCookies, localStorageKeyAuth } from "../utils/data";

export const state = () => ({
  windowWidth: null,
  windowHeight: null,
  authComponentShow: false,
  cities: [],
  currentCity: null,
  currentRadius: null,
  acceptCookies: false,
});
export const getters = {
  isMobile: (state) => state.windowWidth <= 860,
  cities: (state) => state.cities,
  currentCity: (state) => state.currentCity && City(state.currentCity),
  acceptCookies: (state) => state.acceptCookies,
};
export const actions = {
  async getCities({ commit, state }) {
    try {
      const response = await fetch("/cities.json").then((res) => res.json());
      commit("setCities", response);
      return { cities: response };
    } catch (e) {}
  },
  async getLocate({ commit, state }, force = false) {
    if (!force && state.currentCity)
      return `${state.currentCity.city}, ${state.currentCity.state}`;

    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$get("/users/locate");
        const city = `${response.city}, ${response.state}`;
        commit("setCurrentCity", response);
        await resolve(city);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async saveCity({ commit, dispatch }, { slug, name, radius = 20 }) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$post("/users/set-location", {
          slug: slug,
          lookup_radius: radius,
        });
        await dispatch("getLocate", true);
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async nuxtClientInit({ dispatch, commit, state }, { app }) {
    dispatch("getCities");
    const token = localStorage.getItem(localStorageKeyAuth);
    await dispatch("getLocate");
    commit("setCookies", Boolean(localStorage.getItem(localStorageCookies)));
    if (token) {
      try {
        await dispatch("auth/setToken", token);
        await dispatch("user/getUserData");
      } catch (e) {
        console.log(e);
        await dispatch("auth/clearToken");
      }
    }
  },
  setAcceptCookies({ commit, state }) {
    localStorage.setItem(localStorageCookies, true);
    commit("setCookies", true);
  },
};
export const mutations = {
  changeWindowSize(state, { windowWidth, windowHeight }) {
    state.windowWidth = windowWidth;
    state.windowHeight = windowHeight;
  },
  setCookies(state, cookies) {
    state.acceptCookies = cookies;
  },
  setCities(state, cities) {
    state.cities = [...cities];
  },
  setCurrentCity(state, city) {
    //localStorage.setItem(localStorageKeyCity, city);
    state.currentCity = city;
  },
  setAuthComponent(state, show) {
    state.authComponentShow = show;
  },
};
