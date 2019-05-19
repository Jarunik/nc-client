<template>
  <div class="items">
    <h1>{{ $t("Items") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
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
            <td v-if="routeUser === loginUser">
              <button @click="toggleGift(item.id)">
                ...
              </button>
              <template v-if="showGift === item.id">
                <input v-model="recipient" :placeholder="$t(placeholderGift)" />
                <button
                  :disabled="clicked.includes(item.id)"
                  @click="giftItem(item, index)"
                  v-if="item.total > 0"
                >
                  {{ $t("Send") }}
                </button>
              </template>
            </td>
            <td>
              <button
                v-if="
                  routeUser === loginUser && item.total > 0 && planetId !== null
                "
                @click="activateItem(item, planetId, index)"
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
      <template v-if="routeUser !== 'null'">
        <p>
          {{ $t("You have no items. Buy some in the") }}
          <router-link to="/shop">{{ $t("shop") }}</router-link> .
        </p>
      </template>
      <template v-if="routeUser === 'null'">
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
import { mapState } from "vuex";

export default {
  name: "items",
  props: ["routeUser"],
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
      await this.getShop();
    },
    async getShop() {
      const response = await ItemsService.byUser(this.routeUser);
      this.items = response;
    },
    giftItem(item, index) {
      this.clicked.push(item.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.giftItem(
        this.loginUser,
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
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.activateItem(
        this.loginUser,
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
