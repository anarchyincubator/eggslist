<template>
  <div class="page">
    <div class="header-container">
      <h1>About</h1>
      <div class="body-1">
        Egglist is your virtual Farmer’s Market, where you can buy, sell, and
        connect with local farmers and gardeners to keep your food fresh and
        local!
      </div>
      <PatternTop color="#FEF3E1" class="header-container__bottom" />
    </div>
    <div class="page-container">
      <div class="page-container__questions">
        <h2>Frequently Asked Questions</h2>
        <div v-if="!loadingQuestions" class="page-container__questions__list">
          <QuestionSelect
            v-for="(item, index) in questions"
            :key="index"
            class="page-container__questions__list--item"
            :question="item.question"
            :answer="item.answer"
          />
        </div>
        <div v-else class="page-container__questions__list">
          <SkeletonItem
            v-for="(item, index) in 3"
            :key="index"
            class="page-container__questions__list--item--loading"
            :height="1.5"
            :height-mobile="44"
            :width="39.375"
            :width-mobile="280"
            :border="0"
            :border-mobile="0"
          />
        </div>
      </div>
      <div class="page-container__team">
        <h2>Our team</h2>
        <div class="page-container__team__list">
          <TeamCard
            v-for="(item, index) in loadingTeam ? 3 : team"
            :key="index"
            :loading="loadingTeam"
            :member="loadingTeam ? {} : item"
            class="page-container__team__list__item"
          ></TeamCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PatternTop from "../components/Page/index/PatternTop";
import QuestionSelect from "../components/Page/about/QuestionSelect";
import TeamCard from "../components/Page/about/TeamCard";
import SkeletonItem from "../components/Common/SkeletonItem";
export default {
  name: "AboutPage",
  components: {
    SkeletonItem,
    TeamCard,
    QuestionSelect,
    PatternTop,
  },
  data() {
    return {
      questions: [],
      team: [],
      loadingTeam: true,
      loadingQuestions: true,
    };
  },
  computed: {},

  async mounted() {
    try {
      this.loadingQuestions = true;
      this.$axios.$get("/site-configuration/about/faqs").then((response) => {
        this.loadingQuestions = false;
        this.questions = [...response];
      });
    } catch (e) {}

    try {
      this.loadingTeam = true;
      this.$axios
        .$get("/site-configuration/about/team-members")
        .then((response) => {
          this.team = [...response];
          this.loadingTeam = false;
        });
    } catch (e) {}
  },
  methods: {
    handleGoMarket() {
      this.$router.push("/catalog");
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 7.5rem;
  .header-container {
    background-color: $primary-black;
    padding-top: 10.5625rem;
    padding-bottom: 5rem;
    width: 100vw;
    margin-left: calc(0rem - $padding-with-width);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    @include layout-mobile() {
      margin-left: -$padding-left-mobile;
      padding-top: mvw(64px);
      padding-bottom: mvw(40px);
    }

    h1 {
      color: $primary-marigold;
      margin-bottom: 2rem;
      @include layout-mobile() {
        width: mvw(280px);
        margin-top: mvw(64px);
        margin-bottom: mvw(16px);
        text-align: left;
      }
    }
    .body-1 {
      color: $primary-white;
      width: 53.125rem;
      text-align: center;
      @include layout-mobile() {
        width: auto;
        text-align: left;
        margin-left: $padding-left-mobile;
        padding-right: $padding-left-mobile;
      }
    }

    &__bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1.5rem;
      background-size: cover;
      @include layout-mobile() {
        height: mvw(40px);
        bottom: mvw(-20px);
        width: 101%;
        transform: scale(1);
      }
    }
  }
  &-container {
    padding: 0;
    &__questions {
      display: flex;
      background-color: $primary-white;
      width: 100vw;
      margin-left: calc(0rem - $padding-with-width);
      padding: 7.5rem $padding-with-width 7.5rem;
      @include layout-mobile() {
        flex-direction: column;
        padding: mvw(86px) $padding-left-mobile mvw(64px) $padding-left-mobile;
        margin-left: calc(0rem - $padding-left-mobile);
        width: 100%;
      }
      h2 {
        margin-right: 15.625rem;
        width: 25.625rem;
        flex-shrink: 0;
        @include layout-mobile() {
          width: 100%;
          margin: 0;
        }
      }
      &__list {
        display: flex;
        flex-direction: column;
        &--item {
          &--loading {
            margin: 2.25rem 0;
            @include layout-mobile() {
              margin: mvw(20px) 0;
            }
          }
        }
      }
    }
    &__team {
      h2 {
        margin-top: 9rem;
        margin-bottom: 3.6875rem;
        @include layout-mobile() {
          margin-top: mvw(64px);
          margin-bottom: mvw(32px);
        }
      }
      &__list {
        display: flex;
        @include layout-mobile() {
          flex-direction: column;
        }
        &__item {
          margin-right: 1.875rem;
          @include layout-mobile() {
            margin-bottom: mvw(48px);
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
