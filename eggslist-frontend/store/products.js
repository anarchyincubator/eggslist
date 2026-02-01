import Product from "../utils/adapters/Product";
import BigProduct from "../utils/adapters/BigProduct";
import { generateFormDataProduct } from "../utils/data";

export const state = () => ({
  editProduct: null,
});
export const getters = {
  editProduct: (state) =>
    state.editProduct ? BigProduct(state.editProduct) : null,
};
export const actions = {
  async getProductPurchase({ commit }, slug) {
    try {
      const response = await this.$axios.$post(
        `/store/products/${slug}/purchase`
      );
      return response?.redirect_url;
    } catch (e) {}
  },
  async getProductsPopular({ commit }) {
    try {
      const response = await this.$axios.$get("/store/products/popular");
      return { products: response?.results.map(Product) };
    } catch (e) {}
  },
  async getProduct({}, slug) {
    try {
      const response = await this.$axios.$get(`/store/products/${slug}`);
      return { product: BigProduct(response) };
    } catch (e) {}
  },
  async getEditProduct({ commit }, slug) {
    try {
      const response = await this.$axios.$get(`/store/products/${slug}`);
      commit("setEditProduct", response);
      return { product: BigProduct(response) };
    } catch (e) {}
  },
  async getProducts({ commit }, query) {
    try {
      const response = await this.$axios.$get(
        "/store/products" + (query ? `?${query}` : "")
      );
      return {
        products: response?.results.map(Product),
        totalPage: response?.total_pages,
        count: response?.count,
      };
    } catch (e) {}
  },
  async getSellerProducts({ commit }, id) {
    try {
      const response = await this.$axios.$get(
        `/store/products/other-user/${id}`
      );
      return {
        products: response?.results.map(Product),
        totalPage: response?.total_pages,
        count: response?.count,
      };
    } catch (e) {}
  },
  async getMyProducts({ commit }, page = 1) {
    try {
      const response = await this.$axios.$get(
        "/store/products/my?page=" + page
      );
      return {
        products: response?.results.map(Product),
        totalPage: response?.total_pages,
        count: response?.count,
      };
    } catch (e) {}
  },
  async getMyHiddenProducts({ commit }, page = 1) {
    try {
      const response = await this.$axios.$get(
        "/store/products/my-hidden?page=" + page
      );
      return {
        products: response?.results.map(Product),
        totalPage: response?.total_pages,
        count: response?.count,
      };
    } catch (e) {}
  },
  async getRecentProducts({ commit }) {
    try {
      const response = await this.$axios.$get(
        "/store/products/recently-viewed"
      );
      return {
        products: response?.results.map(Product),
        totalPage: response?.total_pages,
        count: response?.count,
      };
    } catch (e) {}
  },
  async createProduct({}, data) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$post(
          "store/products/create",
          generateFormDataProduct(data)
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async deleteProduct({}, slug) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$delete(`/store/products/${slug}`);
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async updateProduct({}, params) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$patch(
          `/store/products/${params.slug}`,
          { ...params.params }
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async updateProductForm({}, params) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$patch(
          `/store/products/${params.slug}`,
          params.params
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
  async createContact({}, slug) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const response = await this.$axios.$post(
          `store/products/${slug}/contact`
        );
        await resolve(response);
      } catch (e) {
        reject(e.response);
      }
    });
  },
};
export const mutations = {
  setEditProduct(state, product) {
    state.editProduct = product;
  },
};
