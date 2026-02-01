export const state = () => ({
  siteName: "Eggslist",
  tagline: "Find Farmers Near You",
  siteDescription:
    "Your virtual Farmer's Market, where you can buy, sell, and connect" +
    " with local farmers and gardeners to keep your food fresh and local!",
  primaryColor: "#D4A843",
  logo: null,
  favicon: null,
  copyrightText: "Eggslist. All rights reserved.",
  ctaText: "Sign up to start buying and selling local food!",
});

export const getters = {
  siteName: (state) => state.siteName,
  tagline: (state) => state.tagline,
  siteDescription: (state) => state.siteDescription,
  primaryColor: (state) => state.primaryColor,
  logo: (state) => state.logo,
  favicon: (state) => state.favicon,
  copyrightText: (state) => state.copyrightText,
  ctaText: (state) => state.ctaText,
};

export const mutations = {
  setBranding(state, data) {
    if (data.site_name) state.siteName = data.site_name;
    if (data.tagline) state.tagline = data.tagline;
    if (data.site_description) state.siteDescription = data.site_description;
    if (data.primary_color) state.primaryColor = data.primary_color;
    if (data.logo !== undefined) state.logo = data.logo;
    if (data.favicon !== undefined) state.favicon = data.favicon;
    if (data.copyright_text) state.copyrightText = data.copyright_text;
    if (data.cta_text) state.ctaText = data.cta_text;
  },
};

export const actions = {
  async fetchBranding({ commit, state }) {
    try {
      const data = await this.$axios.$get("/site-configuration/branding");
      commit("setBranding", data);

      document.title = `${data.site_name || state.siteName} - ${
        data.tagline || state.tagline
      }`;

      if (data.favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = data.favicon;
      }

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = data.site_description || state.siteDescription;
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.content = data.site_name || state.siteName;
      }

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.content = data.site_description || state.siteDescription;
      }

      const color = data.primary_color || state.primaryColor;
      document.documentElement.style.setProperty("--brand-primary", color);
    } catch (e) {
      // Use defaults on failure
    }
  },
};
