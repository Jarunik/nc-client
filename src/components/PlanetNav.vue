<template>
  <span class="planetnav">
    <router-link :to="'/' + gameUser + '/planets'">
      <earth-icon :title="$t('Planets')" />
      <span v-for="planet in this.planets" :key="planet.id">
        <span v-if="planet.id === planetId">
          {{ planet.name }}
        </span>
      </span>
    </router-link>
  </span>
</template>

<script>
import PlanetsService from "@/services/planets";
import { mapState } from "vuex";
import EarthIcon from "vue-material-design-icons/Earth.vue";

export default {
  name: "planetnav",
  components: {
    EarthIcon
  },
  props: ["routeUser"],
  data: function() {
    return {
      planets: null
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id
    })
  },
  methods: {
    async prepareComponent() {
      await this.getPlanets();
    },
    async getPlanets() {
      const response = await PlanetsService.byUser(this.routeUser);
      this.planets = response.planets;
    },
    setPlanet(planet) {
      if (planet.id !== this.planetId) {
        this.$store.dispatch("planet/setId", planet.id);
        this.$store.dispatch("planet/setName", planet.name);
        this.$store.dispatch("planet/setPosX", planet.posx);
        this.$store.dispatch("planet/setPosY", planet.posy);
      } else {
        this.resetPlanet();
      }
    },
    resetPlanet() {
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
      this.$store.dispatch("planet/setPosX", null);
      this.$store.dispatch("planet/setPosY", null);
    }
  }
};
</script>
