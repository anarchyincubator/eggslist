import { localStorageKeyAuth } from "../utils/data";

export const state = () => ({
  token: undefined,
});
export const getters = {
  token: (state) => state.token,
  isAuthenticated: (state) => state.token && state.token.length > 0,
};
export const actions = {
  login({ dispatch }, user) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$post("/users/sign-in", user);
        localStorage.setItem(localStorageKeyAuth, response.access);
        await dispatch("setToken", response.access);
        await dispatch("user/getUserData", {}, { root: true });
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async requestPassword({}, email) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$post(
          "/users/password-reset-request",
          { email }
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async resetPassword({}, { code, password }) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$post(
          "/users/password-reset-confirm",
          { code, password }
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  register({ dispatch }, user) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$post("/users/sign-up", user);
        localStorage.setItem(localStorageKeyAuth, response.access);
        await dispatch("setToken", response.access);
        await dispatch("user/getUserData", {}, { root: true });
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async sendEmailVerify() {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$post("/users/email-verify-request");
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async verifyEmailVerify({}, code) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$post("/users/email-verify-confirm", {
          code: code,
        });
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async verifyUserVerify({}, data) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const formData = new FormData();

        if (data.image) formData.append("image", data.image);

        formData.append("text", data.text);
        response = await this.$axios.$post(
          "/users/become-verified-seller",
          formData
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  setToken({ commit }, token) {
    this.$axios.setToken(token, "Bearer");
    commit("setToken", token);
  },
  clearToken({ commit }) {
    this.$axios.setToken(false);
    localStorage.removeItem(localStorageKeyAuth);
    commit("clearToken");
  },
};
export const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  clearToken(state) {
    state.token = undefined;
  },
};
