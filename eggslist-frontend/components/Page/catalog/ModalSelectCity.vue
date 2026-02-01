<template>
  <ModalSimple ref="modal" back-color="#FEF3E1" class="modal">
    <div class="modal__container">
      <h2>Your Location</h2>

      <SearchComponent
        v-model="city"
        class="modal__search"
        :result="resultCity"
        placeholder="Search city"
        no-text="No cities"
        @setupCity="handleEmitCity"
        @changeInput="handleChangeCity"
      >
        <p slot="label">Location</p>
        <img
          slot="icon"
          class="icon"
          src="@/assets/images/icons/map.svg"
          alt="search"
        />
      </SearchComponent>
      <CustomDropdown
        v-model="radius"
        class="modal__dropdown"
        :selects="selectsRadius"
        @input="handleChangeRadius"
        ><p slot="label" class="form__content__row--label">
          Radius
        </p></CustomDropdown
      >
      <div class="modal__buttons">
        <CustomButton
          class="modal__button modal__button__first"
          theme="secondary"
          @click="handleHide"
        >
          Cancel</CustomButton
        >
        <CustomButton
          class="modal__button modal__button__second"
          theme="primary"
          :is-loading="loading"
          @click="handleConfirm"
        >
          Confirm My Location</CustomButton
        >
      </div>
    </div>
  </ModalSimple>
</template>

<script>
import CustomDropdown from "../../Common/CustomDropdown";
import SearchComponent from "../../Common/SearchComponent";
import CustomButton from "../../Common/CustomButton";
import ModalSimple from "../../Common/ModalSimple";
import { debounce } from "lodash";
export default {
  name: "ModalSelectCity",
  components: { ModalSimple, CustomButton, SearchComponent, CustomDropdown },
  emits: ["send"],
  data() {
    return {
      city: "",
      selectedCity: "",
      resultCity: [],
      radius: {},
      loading: false,
      selectsRadius: [
        {
          key: 5,
          value: "5 mi",
        },
        {
          key: 10,
          value: "10 mi",
        },
        {
          key: 20,
          value: "20 mi",
        },
        {
          key: 50,
          value: "50 mi",
        },
        {
          key: 100,
          value: "100 mi",
        },
      ],
    };
  },
  computed: {
    cities() {
      return this.$store.getters["cities"];
    },
    currentCity() {
      return this.$store.getters["currentCity"];
    },
  },
  methods: {
    show(data) {
      this.$refs.modal.show();
      this.radius = this.selectsRadius.find(({ key }) => {
        return this.currentCity.radius === key;
      });

      this.city = `${this.currentCity.city}, ${this.currentCity.state}`;
      this.selectedCity = { slug: this.currentCity.slug };
    },
    handleHide() {
      this.$refs.modal.hide();
    },
    async handleConfirm() {
      this.loading = true;
      try {
        await this.$store.dispatch("saveCity", {
          slug: this.selectedCity.slug,
          name: this.city,
          radius: this.radius.key,
        });
        this.$emit("send");
        this.handleHide();
      } catch (e) {}
      this.loading = false;
    },
    handleEmitCity(val) {
      this.selectedCity = val;
    },
    handleChangeCity: debounce(function (val) {
      let city = val.toLowerCase().replace("-", " ");
      let states = [];
      this.resultCity = this.cities.filter((obj) => {
        if (obj.state_full_name.toLowerCase().includes(city)) states.push(obj);

        return obj.name.toLowerCase().includes(city);
      });

      this.resultCity.push(...states);
      this.resultCity = this.resultCity.map((obj) => {
        return { name: `${obj.name}, ${obj.state}`, slug: obj.slug };
      });
    }, 200),
    handleChangeRadius() {},
  },
};
</script>

<style lang="scss" scoped>
.modal {
  width: 100%;

  &__container {
    width: 100%;
    display: flex;
    color: $primary-black;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    @include layout-mobile() {
      margin-top: mvw(-32px);
    }
    h2 {
      text-align: left;
    }
  }
  &__search {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    position: relative;
    text-align: left;
    p {
      text-align: left;
    }
  }
  &__dropdown {
    position: relative;
    margin-bottom: 1.5rem;
    p {
      text-align: left;
    }
  }
  &__button {
    width: 100%;
    &__first {
      width: 70%;
      margin-right: 0.5rem;
      @include layout-mobile() {
        display: none;
      }
    }
    &__second {
      padding: 0rem;
    }
  }
  span {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
  &__buttons {
    display: flex;
    @include layout-mobile() {
      flex-direction: column-reverse;
    }
  }
}
.icon {
  position: absolute;
  left: 0.8125rem;
  width: 0.75rem;
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  @include layout-mobile() {
    width: mvw(18px);
    left: mvw(18px);
  }
}
</style>
