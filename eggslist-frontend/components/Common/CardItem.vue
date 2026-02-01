<template>
  <div :class="classes" @click.self="handleClick">
    <div
      :class="['card__background', { 'card__background--small': smallCard }]"
      :style="backgroundStyle"
      @mouseover="handleEnterMouse"
      @click.self="handleClick"
      @mouseleave="handleLeaveMouse"
    >
      <div
        :class="[
          'card__background--fade',
          { 'card__background--fade--default': !isEdit },
          { 'card__background--fade--active': isHidden || outStock },
        ]"
      />
      <div
        v-if="!isMobile && isEdit && isHover"
        :class="[
          'card__background__edit',
          { 'card__background__edit--active': isEditActive },
        ]"
        @click="handleClickEdit"
      >
        <img
          class="card__background__edit--settings"
          src="@/assets/images/icons/settings.svg"
        />
        <img
          class="card__background__edit--dropdown"
          src="@/assets/images/icons/drop-down.svg"
        />
        <div v-if="isEditActive" class="card__background__edit--popup">
          <p class="button-2" @click="handleEdit">Edit</p>
          <p class="button-2" @click="handleHide">
            {{ isHidden ? "Unhide" : "Hide" }}
          </p>
          <p class="button-2" @click="handleOut">
            {{ outStock ? "Mark as “In Stock”" : "Mark as “Out of Stock”" }}
          </p>
          <strong class="button-2" @click="handleDelete">Delete</strong>
        </div>
      </div>
      <div v-else class="">
        <div v-if="outStock" class="card__background--out">out of stock</div>
        <div v-if="isHidden" class="card__background--hidden">
          <img src="@/assets/images/icons/visibility_off.svg" />
          <h4>Hidden</h4>
        </div>
      </div>
    </div>
    <h4>{{ title }}</h4>
    <div class="card__price body-1">${{ price }}</div>
    <div v-if="authorConfig" class="card__author">
      <span>{{ authorConfig.firstName }}</span>
      <img
        v-if="authorConfig.isVerified"
        class="card__author--verified"
        src="@/assets/images/icons/verified.svg"
      />
      <img
        v-if="authorConfig.isFavourite"
        class="card__author--like"
        src="@/assets/images/icons/like_dark.svg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "CardItem",
  props: {
    title: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    authorConfig: {
      type: Object,
      default: null,
    },
    isBigHeight: {
      type: Boolean,
      default: true,
    },
    smallCard: {
      type: Boolean,
      default: false,
    },
    outStock: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["hide", "out-stock", "delete"],
  data() {
    return {
      isHover: false,
      isEditActive: false,
    };
  },
  computed: {
    backgroundStyle() {
      return {
        "background-image": `url(${this.background})`,
      };
    },
    classes() {
      return [
        "card",
        {
          "card-small": !this.isBigHeight,
        },
        {
          "card-edit": this.isEdit,
        },
      ];
    },
    isMobile() {
      return this.$store.getters["isMobile"];
    },
  },
  methods: {
    handleClick() {
      this.$router.push({
        path: `/catalog/product`,
        query: { slug: this.slug },
      });
    },
    handleEnterMouse() {
      this.isHover = true;
    },
    handleClickEdit(e) {
      this.isEditActive = true;
    },
    handleLeaveMouse() {
      this.isHover = false;
      this.isEditActive = false;
    },
    handleHide() {
      this.$emit("hide");
    },
    handleOut() {
      this.$emit("out-stock");
    },
    handleDelete() {
      this.$emit("delete");
    },
    handleEdit() {
      this.$router.push({
        path: "/product/edit",
        query: { slug: this.slug },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  cursor: pointer;
  max-width: 18.75rem;
  h4 {
    height: 3.5625rem;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
    @include layout-mobile() {
      font-size: mvw(16px);
      height: mvw(45px);
      margin-bottom: mvw(12px);
    }
  }
  &__background {
    width: 18.75rem;
    height: 18.75rem;
    border-radius: 1.875rem;
    margin-bottom: 1rem;
    background-color: $neutral-70;
    background-size: cover;
    position: relative;
    &:hover {
      // opacity: 0.8;
    }
    &--small {
      width: 11.875rem;
      height: 11.875rem;
    }
    &--fade {
      position: absolute;
      width: 100%;
      pointer-events: none;
      z-index: 5;
      height: 100%;
      background: linear-gradient(
        0deg,
        rgba(254, 243, 225, 0.6),
        rgba(254, 243, 225, 0.6)
      );
      opacity: 0;
      &--active {
        opacity: 1;
      }
    }
    &--hidden {
      position: absolute;
      left: 50%;
      top: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      z-index: 10;
      translate: -50% -50%;
      img {
        width: 1.375rem;
        margin-bottom: 0.375rem;
        @include layout-mobile() {
          width: mvw(18px);
        }
      }
      h4 {
        height: auto;
      }
    }
    &--out {
      font-weight: 700;
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      text-transform: uppercase;
      font-size: 0.75rem;
      line-height: 1rem;
      letter-spacing: 1.2px;
      color: $primary-white;
      background-color: $neutral-30;
      border-radius: 6.25rem;
      padding: 0.5rem 0.75rem;
      box-sizing: border-box;
      z-index: 10;
      @include layout-mobile() {
        top: 0;
        left: 0;
        width: 100%;
        font-size: mvw(12px);
        line-height: mvw(16px);
        padding: mvw(8px) mvw(14px);
        border-radius: mvw(15px) mvw(15px) 0px 0px;
      }
    }
    &__edit {
      width: 4.875rem;
      height: 3rem;
      border-radius: 6.25rem;
      background-color: $neutral-30;
      z-index: 10;
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      box-sizing: border-box;
      padding: 0.875rem 1.0625rem 0.875rem 0.75rem;
      display: flex;
      align-items: center;
      &:hover {
        opacity: 0.8;
      }
      &--active {
        background-color: $primary-black;
        &:hover {
          opacity: 1;
        }
      }
      &--settings {
        width: 1.1875rem;
        margin-right: auto;
      }
      &--dropdown {
        width: 0.625rem;
      }
      &--popup {
        position: absolute;
        display: flex;
        flex-direction: column;
        left: 0;
        background: $primary-white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 0.75rem;
        width: 12.125rem;
        height: 7.9375rem;
        bottom: calc(-8.3125rem);
        padding: 1rem;
        box-sizing: border-box;
        z-index: 10;
        p {
          margin-bottom: 0.75rem;
          cursor: pointer;
          font-size: 0.875rem;
          line-height: 1rem;
          &:hover {
            opacity: 0.8;
          }
        }
        strong {
          cursor: pointer;
          color: #b00020;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
    @include layout-mobile() {
      width: mvw(130px);
      height: mvw(130px);
      margin-bottom: mvw(16px);
      border-radius: mvw(15px);
    }
  }
  &:hover {
    opacity: 0.7;
    .card__background--fade {
      opacity: 0.2;
    }
  }
  &-edit {
    &:hover {
      opacity: 1;
      .card__background--fade {
        opacity: 0.7;
      }
    }
  }
  &__price {
    color: $neutral-30;
  }
  &__author {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $neutral-70;
    border-radius: 6.25rem;
    padding: 0.5rem 0.75rem;
    width: max-content;
    margin-top: 0.8125rem;
    color: $neutral-30;
    span {
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: 600;
    }
    img {
      margin-left: 0.3125rem;
    }
    &--verified {
      width: 0.9375rem;
    }
    &--like {
      width: 0.8125rem;
    }
    @include layout-mobile() {
      display: none;
    }
  }
  &-small {
    h4 {
      height: auto;
    }
  }
}
</style>
