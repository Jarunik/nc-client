<template>
  <div class="items">
    <h1>{{ $t("Items") }} - {{ planetName }}</h1>
    <template v-if="items !== null && items.length > 0">
      <table>
        <thead>
          <th>{{ $t("Name") }}</th>
          <th>{{ $t("Quantity") }}</th>
          <th>{{ $t("Gift") }}</th>
          <th>{{ $t("Sell") }}</th>
          <th>{{ $t("Activate") }}</th>

          <th></th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in groupedItems" :key="item.uid">
            <td>{{ $t(item.name) }}</td>
            <td>{{ item.total }}</td>
            <td>
              <span v-if="gameUser === loginUser">
                <button @click="toggleGift(item.id)">
                  ...
                </button>
                <template v-if="showGift === item.id">
                  <input
                    v-model="recipient"
                    :placeholder="$t(placeholderGift)"
                  />
                  <button
                    :disabled="clicked.includes(item.id)"
                    @click="giftItem(item, index)"
                    v-if="item.total > 0"
                  >
                    {{ $t("Send") }}
                  </button>
                </template>
              </span>
              <span v-else>
                -
              </span>
            </td>
            <td>
              <span v-if="gameUser === loginUser">
                <button @click="toggleSell(item.id)">...</button>
                <template v-if="item.id !== null && showSell === item.id">
                  <input v-model="price" :placeholder="$t(placeholderPrice)" />
                  <button
                    :disabled="clicked.includes(item.id)"
                    @click="sell(item, price, index)"
                  >
                    {{ $t("Sell") }}
                  </button>
                </template>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <button
                v-if="
                  gameUser === loginUser && item.total > 0 && planetId !== null
                "
                @click="activateItem(item, planetId, index)"
                :disabled="clicked.includes(item.id)"
              >
                <white-balance-sunny-icon :title="$t('Activate')" />
              </button>
              <span v-else>
                -
              </span>
            </td>
            <td>
              <span v-if="chainResponse.includes(item.id)"
                ><timer-sand-icon :title="$t('Transaction sent')"
              /></span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="gameUser !== null">
        <p>
          {{ $t("You have no items. Buy some in the") }}
          <router-link to="/shop">{{ $t("shop") }}</router-link> .
        </p>
      </template>
      <template v-if="gameUser === null">
        <p>
          {{ $t("Please set the") }}
          {{ $t("user") }}
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import ItemsService from "@/services/items";
import SteemConnectService from "@/services/steemconnect";
import { mapState } from "vuex";
import TimerSandIcon from "vue-material-design-icons/TimerSand.vue";
import WhiteBalanceSunnyIcon from "vue-material-design-icons/WhiteBalanceSunny.vue";

export default {
  name: "items",
  components: {
    TimerSandIcon,
    WhiteBalanceSunnyIcon
  },
  data: function() {
    return {
      items: null,
      recipient: null,
      showGift: null,
      clicked: [],
      chainResponse: [],
      placeholderGift: "enter recipient",
      placeholderPrice: "enter SD price",
      price: null,
      showSell: null
    };
  },
  async mounted() {
    this.clicked = [];
    this.chainResponse = [];
    await this.prepareComponent();
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      planetName: state => state.planet.name
    }),
    groupedItems() {
      let obj = {};
      let filteredItems = this.items.filter(item => {
        return item.for_sale == 0;
      });
      return Object.keys(
        filteredItems.reduce((prev, next) => {
          if (!obj[next["id"]]) obj[next["id"]] = next;
          return obj;
        }, obj)
      ).map(i => obj[i]);
    }
  },
  methods: {
    async prepareComponent() {
      await this.getShop();
    },
    async getShop() {
      const response = await ItemsService.byUser(this.gameUser);
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
    //  ask(user, category, uid, price, market, cb)
    sell(item, index) {
      this.clicked.push(item.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.ask(
        this.loginUser,
        "item",
        item.uid,
        this.price,
        "jarunik",
        (error, result) => {
          if (error === null && result.success) {
            this.price = null;
            this.placeholderSell = "Success";
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
    toggleSell(itemId) {
      if (this.showSell !== itemId) {
        this.showSell = itemId;
      } else {
        this.showSell = null;
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
