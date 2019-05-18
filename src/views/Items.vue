<template>
  <div class="items">
    <h1>{{ $t("Items") }}</h1>
    <template v-if="user !== this.$store.state.game.user">
      <p>
        {{ $t("User: ") + user }}
      </p>
    </template>
    <template v-if="items !== null && items.length > 0">
      <table>
        <thead>
          <th>{{ $t("Name") }}</th>
          <th>{{ $t("Quantity") }}</th>
          <th>{{ $t("Gift") }}</th>
          <th>{{ $t("Activate") }}</th>
          <th>{{ $t(" ") }}</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.uid">
            <td>{{ $t(item.name) }}</td>
            <td>{{ item.total }}</td>
            <td v-if="user === $store.state.game.loginUser">
              <button @click="toggleGift(item.id)">
                ...
              </button>
              <template v-if="showGift === item.id">
                <input v-model="recipient" :placeholder="$t(placeholderGift)" />
                <button @click="giftItem(item, index)" v-if="item.total > 0">
                  {{ $t("Send") }}
                </button>
              </template>
            </td>
            <td>
              <button
                v-if="
                  user === $store.state.game.loginUser &&
                    item.total > 0 &&
                    $store.state.planet.id !== null
                "
                @click="activateItem(item, $store.state.planet.id, index)"
                :disabled="clicked.includes(item.id)"
              >
                {{ $t("☀") }}
              </button>
            </td>
            <td>
              <span v-if="chainResponse.includes(item.id)">{{ $t("⌛") }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="user !== 'null'">
        <p>
          {{ $t("You have no items. Buy some in the") }}
          <router-link to="/shop">{{ $t("shop") }}</router-link> .
        </p>
      </template>
      <template v-if="user === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import ItemsService from "@/services/items";
import SteemConnectService from "@/services/steemconnect";

export default {
  name: "items",
  props: ["user"],
  data: function() {
    return {
      items: null,
      recipient: null,
      showGift: null,
      clicked: [],
      chainResponse: [],
      placeholderGift: "enter recipient"
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  methods: {
    async prepareComponent() {
      await this.getShop();
    },
    async getShop() {
      const response = await ItemsService.byUser(this.user);
      this.items = response;
    },
    giftItem(item, index) {
      SteemConnectService.setAccessToken(this.$store.state.game.accessToken);
      SteemConnectService.giftItem(
        this.$store.state.game.loginUser,
        item.uid,
        this.recipient,
        (error, result) => {
          if (error === null && result.success) {
            this.recipient = null;
            this.placeholderGift = "Success";
            this.items[index].total = this.items[index].total - 1;
          }
        }
      );
    },
    toggleGift(itemId) {
      if (this.showGift !== itemId) {
        this.showGift = itemId;
      } else {
        this.showGift = null;
      }
    },
    activateItem(item, planetId, index) {
      this.clicked.push(item.id);
      SteemConnectService.setAccessToken(this.$store.state.game.accessToken);
      SteemConnectService.activateItem(
        this.$store.state.game.loginUser,
        item.uid,
        planetId,
        (error, result) => {
          if (error === null && result.success) {
            this.chainResponse.push(item.id);
            this.items[index].total = this.items[index].total - 1;
          }
        }
      );
    }
  }
};
</script>

<style>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
