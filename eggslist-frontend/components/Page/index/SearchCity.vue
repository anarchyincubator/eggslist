<template>
  <div class="search-city">
    <div class="search-city__first">
      <img
        slot="icon"
        class="icon"
        src="@/assets/images/icons/search.svg"
        alt="search"
      />
      <CustomInput
        v-model="listing"
        class="search-clear"
        :padding-default="false"
        placeholder="Search for listings"
        @keyup.enter.native="handleFindListings"
      >
      </CustomInput>
    </div>

    <div class="search-city__line" />
    <SearchComponent
      v-model="city"
      class="search-city__second search-clear"
      :result="resultCity"
      placeholder="Search city"
      no-text="No cities"
      @keyup.enter.native="handleFindListings"
      @setupCity="handleEmitCity"
      @changeInput="handleChangeCity"
    >
      <img
        slot="icon"
        class="icon"
        src="@/assets/images/icons/map.svg"
        alt="search"
      />
    </SearchComponent>
    <CustomButton
      class="search-city__button"
      theme="primary"
      @click="handleFindListings"
    >
      Find Food
    </CustomButton>
  </div>
</template>

<script>
import { debounce } from "lodash";
import SearchComponent from "@/components/Common/SearchComponent.vue";
import CustomButton from "../../Common/CustomButton";
import CustomInput from "../../Common/CustomInput";

export default {
  name: "SearchCity",
  components: {
    CustomInput,
    CustomButton,
    SearchComponent,
  },
  props: {
    cities: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      listing: "",
      city: "",
      resultCity: [],
    };
  },
  mounted() {
    this.getCity();
  },
  methods: {
    async getCity() {
      this.city = await this.$store.dispatch("getLocate");
    },
    async handleEmitCity(val) {
      try {
        await this.$store.dispatch("saveCity", val);
        this.$emit("save");
      } catch (e) {}
    },
    handleChangeCity: debounce(function (val) {
      let city = val.toLowerCase().replace("-", " ");
      let states = [];
      this.resultCity = [
        ...this.cities.filter((obj) => {
          if (obj.state_full_name.toLowerCase().includes(city))
            states.push(obj);

          return obj.name.toLowerCase().includes(city);
        }),
      ];

      this.resultCity.push(...states);
      this.resultCity = this.resultCity.map((obj) => {
        return { name: `${obj.name}, ${obj.state}`, slug: obj.slug };
      });
    }, 200),
    handleFindListings() {
      this.$router.push({ path: "catalog", query: { search: this.listing } });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-city {
  width: 100%;
  display: flex;
  background: #fef3e1;
  border-radius: 0.75rem;
  padding: 0.9375rem 0.9375rem 0.9375rem 0.9375rem;
  height: 3.5rem;
  &__first,
  &__second {
    display: flex;
    position: relative;
    align-items: center;
  }
  &__first {
    width: 25.625rem;
    @include layout-mobile() {
      width: 100%;
    }
  }
  &__second {
    width: 20rem !important;
    margin-right: auto;
    @include layout-mobile() {
      margin: 0;
      width: 100% !important;
    }
  }
  &__line {
    width: 0.125rem;
    height: 100%;
    margin-right: 1.25rem;
    background-color: $neutral-70;
    @include layout-mobile() {
      display: none;
    }
  }
  &__button {
    width: 10.375rem;
    font-size: 1rem;
    @include layout-mobile() {
      width: 100%;
      font-size: mvw(14px);
    }
  }
  @include layout-mobile() {
    flex-direction: column;
    padding: 0 0 mvw(60px);
    border-radius: inherit;
    height: auto;

    background-color: transparent;
    & > * {
      margin-bottom: mvw(16px);
    }
  }
}
.icon {
  position: absolute;
  left: 0;
  width: 1.125rem;
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  @include layout-mobile() {
    width: mvw(18px);
    left: mvw(18px);
  }
}
</style>
