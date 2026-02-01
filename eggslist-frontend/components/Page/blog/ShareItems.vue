<template>
  <div class="share-container">
    <p>Share</p>
    <div class="share-container__list">
      <div class="share-container__item" @click="copyToClipboard">
        <img src="@/assets/images/icons/link.svg" />
      </div>
      <div class="share-container__item" @click="share('fb')">
        <img src="@/assets/images/icons/social-facebook.svg" />
      </div>
      <div class="share-container__item" @click="share('tw')">
        <img src="@/assets/images/icons/social-twitter.svg" />
      </div>
      <div class="share-container__item" @click="share('ld')">
        <img src="@/assets/images/icons/social-linkedin.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import share from "../../../utils/share";
export default {
  name: "ShareItems",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    share(key) {
      share.open(key, { title: this.title });
    },
    copyToClipboard() {
      const text = window.location.href;
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
      } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported("copy")
      ) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
          return prompt("Copy to clipboard: Ctrl+C, Enter", text);
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.share-container {
  &__list {
    display: flex;
  }
  p {
    font-weight: 700;
    line-height: 1rem;
    font-size: 0.75rem;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 1rem;
    @include layout-mobile() {
      font-size: mvw(12px);
      line-height: mvw(16px);
      margin-bottom: mvw(16px);
    }
  }
  &__item {
    width: 3rem;
    height: 3rem;
    border: 1px solid $primary-marigold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    transition: all 0.5s;
    cursor: pointer;
    @include layout-mobile() {
      width: mvw(48px);
      height: mvw(48px);
      margin-right: mvw(20px);
      border: mvw(1px) solid $primary-marigold;
    }
    img {
      width: 1.5rem;
      @include layout-mobile() {
        width: mvw(20px);
      }
    }
    &:hover {
      background-color: $primary-marigold;
    }
  }
}
</style>
