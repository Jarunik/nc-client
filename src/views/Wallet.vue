<template>
  <div class="wallet">
    <h1>{{ $t("Wallet") }}</h1>
    <p>{{ Number(stardust / 100000000).toFixed(8) }} {{ $t("Stardust") }}</p>
    <p>
      {{ $t("Username") }}:
      <input type="text" v-model="recipient" v-on:change="onInput()" />
    </p>
    <p>
      {{ $t("Stardust Amount") }}:
      <input type="number" v-model="amount" v-on:change="onInput()" />
    </p>
    <p>
      <button @click="transfer" :disabled="!transferEnabled() || clicked">
        {{ $t("Transfer") }}
      </button>
    </p>
    <p>{{ $t(transferStatus) }}</p>
  </div>
</template>

<script>
import UserService from "@/services/user";
import { mapState } from "vuex";
import SteemConnectService from "@/services/steemconnect";

export default {
  name: "wallet",
  data: function() {
    return {
      stardust: null,
      recipient: null,
      amount: null,
      clicked: false,
      transferStatus: null
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
      await this.getStardust();
      this.clicked = false;
    },
    async getStardust() {
      const response = await UserService.get(this.gameUser);
      this.stardust = response.stardust;
    },
    transferEnabled() {
      if (this.recipient === null) {
        return false;
      }
      if (this.amount > this.stardust / 100000000) {
        return false;
      }
      if (this.amount <= 0) {
        return false;
      }
      return true;
    },
    transfer() {
      this.clicked = true;
      this.fetchUser(this.recipient).then(searchedUser => {
        if (searchedUser !== null && searchedUser === this.recipient) {
          SteemConnectService.setAccessToken(this.accessToken);
          SteemConnectService.transferStardust(
            this.loginUser,
            this.amount,
            this.recipient,
            (error, result) => {
              if (error === null && result.success) {
                this.transferStatus = "Transaction sent";
                this.stardust = this.stardust - this.amount * 100000000;
              } else {
                this.transferStatus = "Broadcast error";
              }
            }
          );
        } else {
          this.transferStatus = "Unknown User";
        }
      });
    },
    onInput() {
      this.clicked = false;
      this.transferStatus = null;
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    }
  }
};
</script>
