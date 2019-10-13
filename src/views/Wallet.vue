<template>
  <div class="wallet">
    <div v-if="wallet !== null">
      <h1>{{ $t("Wallet") }}</h1>
      <p>{{ $t("Total Supply") }}: {{ wallet.supply / 100000000 }}</p>
      <p>
        {{ $t("Your Balance") }}:
        <b
          ><font color="green">
            {{ Number(wallet.stardust / 100000000).toFixed(8) }}</font
          ></b
        >
        {{ $t("Stardust") }}
      </p>
      <h2>{{ $t("Transfer") }}</h2>
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
      <p>
        <font v-if="transferStatus === 'Transaction sent'" color="green">{{
          $t(transferStatus)
        }}</font
        ><font v-else>{{ $t(transferStatus) }}</font>
      </p>
      <h2>{{ $t("History") }}</h2>
      <table>
        <thead>
          <th>{{ $t("Date") }}</th>
          <th>{{ $t("Type") }}</th>
          <th>{{ $t("Sender") }}</th>
          <th>{{ $t("Recipient") }}</th>
          <th>{{ $t("Amount") }}</th>
          <th>{{ $t("Mission") }}</th>
          <th>{{ $t("Transaction") }}</th>
        </thead>
        <tbody>
          <tr v-for="transaction in wallet.transactions" :key="transaction.trx">
            <td>
              {{ moment.unix(transaction.date, "seconds").format("lll") }}
            </td>
            <td>
              {{ $t(transaction.tr_type) }}
            </td>
            <td>
              {{ transaction.from_user }}
            </td>
            <td>
              {{ transaction.to_user }}
            </td>
            <td>
              {{ transaction.amount / 100000000 }}
            </td>
            <td>
              <span v-if="transaction.mission_id !== null">
                {{ transaction.mission_id }}
              </span>
            </td>
            <td>
              <a
                :href="baseUrl() + '/loadtransaction?trx_id=' + transaction.trx"
                >{{ transaction.trx.substring(0, 8) }}...</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/user";
import WalletService from "@/services/wallet";
import { mapState } from "vuex";
import SteemConnectService from "@/services/steemconnect";

export default {
  name: "wallet",
  data: function() {
    return {
      wallet: null,
      recipient: null,
      amount: null,
      clicked: false,
      transferStatus: "-"
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
      const response = await WalletService.get(this.gameUser);
      this.wallet = response;
    },
    transferEnabled() {
      if (this.recipient === null) {
        return false;
      }
      if (this.recipient === this.loginUser) {
        return false;
      }
      if (this.loginUser !== this.gameUser) {
        return false;
      }
      if (this.amount > this.stardust / 100000000) {
        return false;
      }
      if (this.amount < 0.00000001) {
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
                this.wallet.stardust =
                  this.wallet.stardust - this.amount * 100000000;
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
      this.transferStatus = "-";
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    baseUrl() {
      return process.env.VUE_APP_ROOT_API;
    }
  }
};
</script>
