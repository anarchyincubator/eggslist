import Blog from "@/utils/adapters/Blog";
import BlogFull from "@/utils/adapters/BlogFull";
import BlogCategory from "../utils/adapters/BlogCategory";
import BigProduct from "../utils/adapters/BigProduct";
export const state = () => ({
  categories: [],
  editProduct: null,
});
export const getters = {
  categories: (state) =>
    (state.categories && state.categories?.map(BlogCategory)) || [],
  editBlog: (state) => (state.editBlog ? BlogFull(state.editBlog) : null),
};
export const actions = {
  async getBlog({ commit }, { slug, edit = false }) {
    try {
      const response = await this.$axios.$get(`/blogs/blogs/${slug}`);

      if (edit) commit("setEditBlog", response);

      return { blog: BlogFull(response) };
    } catch (e) {}
  },
  async getFeaturedBlogs({ commit }) {
    try {
      const response = await this.$axios.$get("/blogs/blogs/featured");
      return { blogs: response?.results.map(Blog) };
    } catch (e) {}
  },
  async getCategoriesBlogs({ commit }) {
    try {
      const response = await this.$axios.$get("/blogs/categories");
      commit("setCategories", response);
      return { categories: response };
    } catch (e) {}
  },
  async createBlog({ commit }, body) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.$axios.$post("/blogs/blogs/create", body);
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async deleteBlog({}, slug) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$delete(`/blogs/blogs/${slug}`);
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async saveBlog({ commit }, body) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.$axios.$patch(
          `/blogs/blogs/${body.id}`,
          body.params
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async getCategories({ commit }) {
    try {
      const response = await this.$axios.$get("/blogs/categories");
      commit("setCategories", response);
      return { categories: response.map(BlogCategory) };
    } catch (e) {}
  },
  async getBlogs({ commit }, params) {
    try {
      let query = "?";
      if (params.page) {
        query += query.length > 1 ? "&" : "";
        query += `page=${params.page}`;
      }
      if (params.search) {
        query += `&search=${params.search}`;
      }
      if (params.author) {
        query += `&author=${params.author}`;
      }
      if (params.category) {
        query += `&category=${params.category}`;
      }

      const response = await this.$axios.$get(`/blogs/blogs${query}`);
      return { blogs: response?.results.map(Blog) };
    } catch (e) {
      throw e;
    }
  },
};
export const mutations = {
  setCategories(state, categories) {
    state.categories = categories;
  },
  setEditBlog(state, blog) {
    state.editBlog = blog;
  },
};
