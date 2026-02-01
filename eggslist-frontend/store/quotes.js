import Quote from "@/utils/adapters/Quote";
export const state = () => ({});
export const getters = {};
export const actions = {
  async getQuotes({ commit }) {
    try {
      const response = await this.$axios.$get(
        "/site-configuration/testimonials"
      );
      return { quotes: response?.map(Quote) };
    } catch (e) {}
  },
};
export const mutations = {};
