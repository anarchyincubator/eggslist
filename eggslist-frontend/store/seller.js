import Payment from "@/utils/adapters/Payment";
export const state = () => ({
  recentTransactions: [],
  isLoadingRecent: false,
});
export const getters = {
  recentTransactions: (state) =>
    state.recentTransactions ? state.recentTransactions.map(Payment) : [],
};
export const actions = {
  getRecentTransactions({ commit, dispatch, state }) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        commit("setLoading", true);
        response = await this.$axios.$get("/store/transactions-recent/seller");
        commit("setLoading", false);
        commit("setRecentTransactions", response);
        resolve(response);
      } catch (e) {
        console.log(e);
        reject(e.response.data.error);
      }
    });
  },
  getSpriteConnection({}) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$post("/users/connect-stripe");
        resolve(response?.redirect_url);
      } catch (e) {
        console.log(e);
        reject(e.response.data.error);
      }
    });
  },
  getPayments({ commit }, page = 1) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$get(
          `/store/transactions/seller?page=${page}`
        );
        resolve({
          total: response.total_sales,
          results: response.transaction_list?.results?.map(Payment),
        });
      } catch (e) {
        console.log(e);
        reject(e.response.data.error);
      }
    });
  },
};
export const mutations = {
  setRecentTransactions(state, transactions) {
    state.recentTransactions = transactions;
  },
  setLoading(state, loading) {
    state.isLoadingRecent = loading;
  },
};
