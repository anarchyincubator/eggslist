import Category from "@/utils/adapters/Category";
export const state = () => ({
  categories: [],
});
export const getters = {
  categories: (state) =>
    (state.categories && state.categories?.map(Category)) || [],
};
export const actions = {
  async getCategories({ commit }) {
    try {
      const response = await this.$axios.$get("/store/categories");
      commit("setCategories", response);
      return { categories: response.map(Category) };
    } catch (e) {}
  },
};
export const mutations = {
  setCategories(state, categories) {
    state.categories = categories;
  },
};
