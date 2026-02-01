export const actions = {
  getStates({ commit }) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$get(
          "/site-configuration/location/states"
        );
        resolve(response);
      } catch (e) {
        console.log(e);
        reject(e.response.data.error);
      }
    });
  },
  getCities({ commit }, param) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$get(
          `/site-configuration/location/cities?state=${param.state}&search=${param.search}`
        );
        resolve(response);
      } catch (e) {
        console.log(e);
        reject(e.response.data.error);
      }
    });
  },
  getZipLocal({ commit }, param) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await fetch("/zip_codes.json").then((res) => res.json());
        resolve(response);
      } catch (e) {}
    });
  },
  getZip({ commit }, param) {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.$axios.$get(
          `/site-configuration/location/zip-codes?state=${param.state}&city=${param.city}`
        );
        resolve(response);
      } catch (e) {
        console.log(e);
        reject(e.response.data.error);
      }
    });
  },
};
