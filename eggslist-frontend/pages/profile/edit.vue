<template>
  <div class="page">
    <div class="page__header" @click="handleToProfile">
      <div class="page__header__button">
        <img src="@/assets/images/icons/arrow-forward.svg" />
      </div>
      <span> Profile</span>
    </div>
    <div class="page__content">
      <h1>Edit Page</h1>
      <UploadPhoto
        v-model="profile.file"
        class="page__content__upload"
        title="Upload a profile photo."
        :preview="profile.preview"
        subtitle="Optimal size 1000x1000. Images will be cropped to a square"
      />
      <div class="page__content__row">
        <CustomInput
          v-model="profile.firstName"
          class="page__content__row--input"
          ><span slot="label" class="page__content__row--label"
            >First Name <strong>*</strong>
          </span></CustomInput
        >
        <CustomInput
          v-model="profile.lastName"
          class="page__content__row--input"
          ><span slot="label" class="page__content__row--label"
            >Last Name
          </span></CustomInput
        >
      </div>
      <h4>
        Location
        <TooltipComponent
          >Contact information is required to start selling.
        </TooltipComponent>
      </h4>
      <div class="page__content__row">
        <CustomDropdown
          v-model="profile.selectedCountry"
          class="page__content__row--input"
          :selects="selectsCountry"
          :is-lock="true"
          ><span slot="label" class="page__content__row--label"
            >Country
          </span></CustomDropdown
        >
        <SearchComponent
          v-model="selectedState"
          class="page__content__row--input"
          :result="searchStates"
          :is-padding="true"
          placeholder="Search state"
          no-text="No states"
          :is-in-valid="Boolean(errorState)"
          :error-text="errorState"
          @setupCity="handleEmitState"
          @changeInput="handleChangeState"
          ><span slot="label" class="page__content__row--label"
            >State
          </span></SearchComponent
        >
      </div>
      <div class="page__content__row">
        <SearchComponent
          v-model="selectedCity"
          :is-padding="true"
          placeholder="Search city"
          no-text="No cities"
          :result="searchCitiesCut"
          :is-in-valid="Boolean(errorCity)"
          :error-text="errorCity"
          class="page__content__row--input page__content__row--input--half"
          @setupCity="handleEmitCity"
          @changeInput="handleChangeCity"
          ><span slot="label" class="page__content__row--label"
            >City
          </span></SearchComponent
        >
        <SearchComponent
          v-model="selectedZip"
          :is-padding="true"
          placeholder="Search zip"
          no-text="No zip"
          :is-in-valid="Boolean(errorZip)"
          :error-text="errorZip"
          :result="searchZipCut"
          class="page__content__row--input page__content__row--input--half"
          @setupCity="handleEmitZip"
          @changeInput="handleChangeZip"
          ><span slot="label" class="page__content__row--label"
            >Zip Code
          </span></SearchComponent
        >
      </div>
      <h4>
        Contact info
        <TooltipComponent
          >Contact information is required to start selling.
        </TooltipComponent>
      </h4>
      <div class="page__content__row">
        <CustomInput
          v-model="profile.phone"
          class="page__content__row--input"
          :mask="'+1(###)-###-####'"
          :is-in-valid="Boolean(errorPhone)"
          :error-text="errorPhone"
          placeholder="+1("
          ><span slot="label" class="page__content__row--label"
            >Phone Number
          </span></CustomInput
        >
      </div>
      <h4>About</h4>
      <div class="page__content__row">
        <CustomTextarea
          v-model="profile.bio"
          class="page__content__row--input"
          placeholder="Tell other farmers a bit about yourself."
          ><span slot="label" class="page__content__row--label"
            >Bio
          </span></CustomTextarea
        >
      </div>
      <div class="page__content__buttons">
        <CustomButton
          class="page__content__buttons--verified"
          :theme="theme"
          :is-loading="loadingSave"
          @click="handleUpdate"
          >Update Profile</CustomButton
        >
        <CustomButton
          class="page__content__buttons--cancel"
          theme="secondary"
          @click="handleToProfile"
          >Cancel</CustomButton
        >
        <span
          class="page__content__buttons--cancel--mobile button-1"
          @click="handleToProfile"
          >Cancel</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import CustomButton from "../../components/Common/CustomButton";
import UploadPhoto from "../../components/Common/UploadPhoto";
import CustomInput from "../../components/Common/CustomInput";
import CustomDropdown from "../../components/Common/CustomDropdown";
import SearchComponent from "../../components/Common/SearchComponent";
import CustomTextarea from "../../components/Common/CustomTextarea";
import TooltipComponent from "../../components/Common/Tooltip";
export default {
  name: "EditPage",
  components: {
    TooltipComponent,
    CustomTextarea,
    SearchComponent,
    CustomDropdown,
    CustomInput,
    UploadPhoto,
    CustomButton,
  },
  middleware: ["auth"],
  data() {
    return {
      selectsCountry: [{ key: "usa", value: "United States" }],
      states: [],
      searchCities: [],
      searchCitiesCut: [],
      searchStates: [],
      searchZip: [],
      zipCodes: [],
      searchZipCut: [],
      selectedZip: "",
      selectedCity: "",
      selectedState: "",
      errorLogin: "",
      errorCity: "",
      errorZip: "",
      errorState: "",
      errorPhone: "",
      loadingSave: false,
      isChooseCity: false,
      isChooseState: false,
      isZipCode: false,
      profile: {
        file: null,
        firstName: "",
        lastName: "",
        selectedCountry: { key: "usa", value: "United States" },
        selectedState: "",
        city: "",
        zipCode: "",
        bio: "",
        phone: "",
        email: "",
      },
    };
  },
  computed: {
    isState() {
      return this.profile.selectedState !== null;
    },
    user() {
      return this.$store.getters["user/user"];
    },
    theme() {
      return this.canSave ? "primary" : "disabled";
    },
    canSave() {
      return Boolean(!this.errorLogin && this.profile.firstName);
    },
    cities() {
      return this.$store.getters["cities"];
    },
  },
  async mounted() {
    this.setProfileData();
    await this.$store.dispatch("getCities");
    this.states = await this.$store.dispatch("utils/getStates");
    this.zipCodes = await this.$store.dispatch("utils/getZipLocal");
    await this.setAdditionalData();
  },
  methods: {
    handleChangeState: debounce(function (val) {
      let valu = val.toLowerCase();
      this.searchStates = this.states
        .filter(({ name }) => {
          return name.toLowerCase().includes(valu);
        })
        .map((item) => {
          return { name: item.name, value: item.slug };
        });
      this.searchCities = [...this.cities];
      this.searchCitiesCut = [...this.searchCities];
      this.searchZip = [...this.zipCodes];
      this.selectedZip = "";
      this.searchZipCut = [...this.searchZip];
      this.selectedCity = "";
      this.isZipCode = false;
      this.isChooseCity = false;
      this.isChooseState = false;
    }, 200),
    handleFocusEmail() {
      this.errorLogin = null;
    },
    validatePhone() {
      let ph = new RegExp(
        "^(1\\s?)?(\\d{3}|\\(\\d{3}\\))[\\s\\-]?\\d{3}[\\s\\-]?\\d{4}$"
      );
      let val = true;
      if (
        this.profile.phone &&
        !ph.test(this.profile.phone.replace(/\D/g, ""))
      ) {
        this.errorPhone = "Phone is not valid";
        val &= false;
      }

      if (val) this.errorPhone = null;
      return val;
    },
    validateLoginField(email) {
      this.errorLogin = null;
      let re = /\S+@\S+\.\S+/;
      let val = true;

      if (!re.test(email)) {
        this.errorLogin = "Email is not valid";
        val &= false;
      }
      this.errorLogin = null;
      return true;
    },
    validateStateZip() {
      this.errorCity = null;
      this.errorZip = null;
      this.errorState = null;

      if (!this.isChooseCity || !this.profile.city)
        this.errorCity = "Please fill out a city to update your location";

      if (!this.isZipCode || !this.profile.zipCode)
        this.errorZip = "Please fill out a zip code to update your location";

      if (!this.isChooseState || !this.profile.selectedState)
        this.errorState = "Please fill out a state to update your location";

      return !this.errorCity && !this.errorZip && !this.errorState;
    },
    setProfileData() {
      this.profile.firstName = this.user.firstName;
      this.profile.lastName = this.user.lastName;
      this.profile.email = this.user.email;
      this.profile.phone = this.user.phone;
      this.profile.bio = this.user.bio;
      this.profile.preview = this.user.avatar;
    },

    async setAdditionalData() {
      let state = this.states.find(
        (item) => item.name === this.user.location?.state
      );

      if (!state) return;

      this.profile.selectedState = state.slug;
      this.profile.zipCode = this.user.location.zip_code;
      this.profile.city = this.user.location.city;
      this.selectedZip = this.user.location.zip_code;
      this.selectedCity = this.user.location.city;
      this.selectedState = this.user.location.state;
      this.isZipCode = true;
      this.isChooseCity = true;
      this.isChooseState = true;
      this.searchZip = this.zipCodes.filter((obj) => {
        return (
          obj.city.includes(this.profile.city) &&
          obj.state.toLowerCase() === this.profile.selectedState
        );
      });
    },

    handleToProfile() {
      this.$router.push("/profile");
    },
    handleEmitState(val) {
      this.isChooseState = true;
      this.errorState = null;
      this.profile.selectedState = val.value;
      this.selectedState = val.name;
      this.selectedZip = "";
      this.selectedCity = "";
      this.profile.city = "";
      this.profile.zipCode = "";
      this.isChooseCity = false;
      this.isZipCode = false;
      this.searchZip = this.zipCodes.filter((obj) => {
        return obj.state.toLowerCase() === this.profile.selectedState;
      });
      this.searchCities = this.cities.filter((obj) => {
        return obj.state.toLowerCase() === this.profile.selectedState;
      });
      this.searchCitiesCut = [...this.searchCities];
      this.selectedZip = "";
      this.searchZipCut = [...this.searchZip];
    },

    async handleEmitCity(val) {
      this.isChooseCity = true;
      this.errorCity = null;
      this.profile.city = val.slug;
      this.isChooseState = true;
      this.errorState = null;
      const state = this.states.find(({ name }) => {
        return name === val.state;
      });
      this.profile.selectedState = state.slug;
      this.selectedState = state.name;
      this.searchZip = this.zipCodes.filter((obj) => {
        return (
          obj.city.includes(val.name) &&
          obj.state.toLowerCase() === this.profile.selectedState
        );
      });
      this.isZipCode = false;
      this.selectedZip = "";
      this.searchZipCut = [...this.searchZip];
    },
    async handleUpdate() {
      if (
        !this.validateLoginField(this.profile.email) ||
        !this.validatePhone() ||
        !this.validateStateZip()
      )
        return;

      if (!this.canSave) return;

      this.loadingSave = true;

      let data = {
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        email: this.profile.email,
        bio: this.profile.bio,
        zipCode: this.profile.zipCode,
      };

      if (this.profile.phone)
        data.phone = "+" + this.profile.phone.replace(/\D/g, "");

      if (this.profile.file) data.avatar = this.profile.file;

      try {
        await this.$store.dispatch("user/updateProfile", data);
        await this.$store.dispatch("user/getUserData");
        await this.$router.push("/profile");
      } catch (e) {
        if (e.phone_number) {
          this.errorPhone = e.phone_number[0];
        }
      }

      this.loadingSave = false;
    },
    handleEmitZip(val) {
      this.selectedState = " ";
      this.isZipCode = true;
      this.errorZip = null;
      this.profile.zipCode = val.slug;

      const zip = this.zipCodes.find(({ slug }) => slug === val.slug);
      const city = this.cities.find((obj) => {
        return obj.name === zip.city;
      });

      this.isChooseCity = true;
      this.errorCity = null;
      this.profile.city = city.slug;
      this.selectedCity = zip.city;

      this.isChooseState = true;
      this.errorState = null;
      const state = this.states.find(({ name }) => {
        return name === city.state;
      });
      this.profile.selectedState = state.slug;
      this.selectedState = zip.state;
      this.searchCities = this.cities.filter((obj) => {
        return obj.state.toLowerCase() === this.profile.selectedState;
      });
      this.searchZip = this.zipCodes.filter((obj) => {
        return (
          obj.city.includes(zip.city) &&
          obj.state.toLowerCase() === this.profile.selectedState
        );
      });
    },
    handleChangeZip(val) {
      this.isZipCode = false;
      this.searchZipCut = this.searchZip
        .filter(({ name }) => {
          return name.includes(val);
        })
        .map((obj) => {
          return { name: obj.name, slug: obj.slug };
        });
    },

    handleChangeCity: debounce(async function (val) {
      this.isChooseCity = false;
      this.isZipCode = false;
      this.selectedZip = "";
      this.profile.zipCode = "";

      let city = val.toLowerCase().replace("-", " ");
      this.searchCitiesCut = this.searchCities.filter((obj) => {
        return obj.name.toLowerCase().includes(city);
      });
    }, 200),
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: calc(100% + #{$padding-with-width} * 2);
  margin-left: calc(0rem - $padding-with-width);
  padding: 8rem $padding-with-width 8.6875rem $padding-with-width;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: $primary-white;
  @include layout-mobile() {
    width: calc(100% + #{$padding-left-mobile} * 2);
    margin-left: calc(0rem - $padding-left-mobile);
    padding: mvw(80px) $padding-left-mobile;
  }
  &__header {
    display: flex;
    margin-bottom: 3rem;
    align-items: center;
    margin-right: auto;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 2rem;
      border: 1.5px solid $primary-marigold;
      border-radius: 50%;
      height: 2rem;
      img {
        width: 1rem;
        height: 1rem;
        transform: rotate(180deg);
        @include layout-mobile() {
          width: mvw(16px);
          height: mvw(16px);
        }
      }
      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
      }
    }
    span {
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 600;
      margin-left: 0.5rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin-left: mvw(8px);
      }
    }
    @include layout-mobile() {
      margin-bottom: mvw(38px);
    }
  }
  &__content {
    width: 39.375rem;
    display: flex;
    flex-direction: column;
    @include layout-mobile() {
      width: 100%;
    }

    h1 {
      margin-bottom: 3rem;
      @include layout-mobile() {
        margin-bottom: mvw(32px);
      }
    }
    h4 {
      margin-top: 2rem;
      display: flex;
      margin-bottom: 1rem;
      @include layout-mobile() {
        margin-top: mvw(32px);
        margin-bottom: mvw(16px);
      }
      div {
        margin-left: 0.5rem;
      }
    }
    &__upload {
      margin-bottom: 3rem;
    }
    &__row {
      display: flex;
      margin-bottom: 1rem;
      @include layout-mobile() {
        flex-direction: column;
        margin-bottom: mvw(16px);
      }
      div:first-child {
        @include layout-mobile() {
          margin-bottom: mvw(16px);
        }
      }
      &--input {
        margin-right: 1.5rem;
        &:last-child {
          margin-right: 0;
        }
        &--half {
          width: calc(50% - 0.75rem);
          @include layout-mobile() {
            width: 100%;
          }
        }
      }
      &--label {
        strong {
          color: #b00020;
        }
      }
    }
    &__buttons {
      display: flex;
      margin-top: 3rem;
      @include layout-mobile() {
        flex-direction: column;
        align-items: center;
      }
      &--verified {
        margin-right: 1.5rem;
        width: 10.9375rem;
        @include layout-mobile() {
          width: 100%;
          padding: 0;
          margin: 0;
        }
      }
      &--cancel {
        display: flex;
        @include layout-mobile() {
          display: none;
        }
        &--mobile {
          border-bottom: 2px solid $primary-marigold;
          display: none;
          @include layout-mobile() {
            display: flex;
            width: mvw(58px);
            margin-top: mvw(24px);
          }
        }
      }
    }
  }
}
</style>
