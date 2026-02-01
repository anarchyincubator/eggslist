import throttle from "lodash.throttle";

export default ({ store }) => {
  store.commit("changeWindowSize", {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });

  const handleResize = ({ target }) => {
    store.commit("changeWindowSize", {
      windowWidth: target.innerWidth,
      windowHeight: target.innerHeight,
    });
  };

  window.addEventListener("resize", handleResize);
};
