<template>
  <div class="administration">
    <h1>{{ $t("Administration") }} - {{ loginUser }}</h1>
    <template v-if="gameUser !== 'null'">
      <!-- Commands -->
      <p>
        {{ $t("Command") }}
        <select @change="onCommand()" v-model="command">
          <option value="updateshop">{{ $t("Update Shop") }} </option>
          <option value="issue">{{ $t("Issue Item") }} </option>
          <option value="issuestardust">{{ $t("Issue Stardust") }}</option>
          <option value="newseason">{{ $t("New Season") }}</option>
        </select>
      </p>
      <!-- Update Shop -->
      <template v-if="command == 'updateshop'">
        <p>
          {{ $t("Item") }}:
          <select v-model="shopItem">
            <option value="chest_01">{{ $t("Chest") }}</option>
            <option value="chest_02">{{ $t("Huge Chest") }}</option>
            <option value="chest_03">{{ $t("Imperium Chest") }}</option>
            <option value="booster_01">{{ $t("Rune") }}</option>
            <option value="booster_02">{{ $t("Mighty Rune") }}</option>
            <option value="booster_03">{{ $t("Holy Rune") }}</option>
            <option value="blueprint_11"
              >{{ $t("Blueprint") }} {{ $t("Scout Athene") }}</option
            >
            <option value="blueprint_12"
              >{{ $t("Blueprint") }} {{ $t("Patrol Hermes") }}</option
            >
            <option value="blueprint_13"
              >{{ $t("Blueprint") }} {{ $t("Cutter Canard") }}</option
            >
            <option value="blueprint_01"
              >{{ $t("Blueprint") }} {{ $t("Corvette Petunia") }}</option
            >
            <option value="blueprint_02"
              >{{ $t("Blueprint") }} {{ $t("Frigate Redmill") }}</option
            >
            <option value="blueprint_03"
              >{{ $t("Blueprint") }} {{ $t("Destroyer Janus") }}</option
            >
            <option value="blueprint_04"
              >{{ $t("Blueprint") }} {{ $t("Cruiser Drake") }}</option
            >
            <option value="blueprint_05"
              >{{ $t("Blueprint") }} {{ $t("Battlecruiser Lion") }}</option
            >
            <option value="blueprint_06"
              >{{ $t("Blueprint") }} {{ $t("Carrier Unicorn") }}</option
            >
            <option value="blueprint_07"
              >{{ $t("Blueprint") }} {{ $t("Dreadnought Imperial") }}</option
            >
            <option value="blueprint_08"
              >{{ $t("Blueprint") }} {{ $t("Explorer II") }}</option
            >
            <option value="blueprint_09"
              >{{ $t("Blueprint") }} {{ $t("Transporter II") }}</option
            >
          </select>
          &nbsp;
          <input v-model="shopItem" />
        </p>
        <p>
          {{ $t("Parameter") }}:
          <select v-model="shopParameter">
            <option value="sales_per_day">{{ $t("Sales per Day") }}</option>
            <option value="max_supply">{{ $t("Maximal Supply") }}</option>
            <option value="price">{{ $t("Price") }}</option>
          </select>
          &nbsp;
          <input v-model="shopParameter" />
        </p>
        <p>
          {{ $t("Value") }}:
          <input v-model="shopValue" />
        </p>
        <p>
          <button :disabled="clicked" @click="sendUpdateShop()">
            {{ $t("Send Update Shop") }}
          </button>
        </p>
        <p v-if="error != null">
          <font color="red">{{ $t("Error") }}:</font>
          {{ JSON.stringify(error) }}
        </p>
        <p v-if="result != null">
          <font color="green">{{ $t("Result") }}:</font>
          {{ result.message }}
        </p>
      </template>
      <!-- Issue Item -->
      <template v-if="command == 'issue'">
        <p>
          {{ $t("Item") }}:
          <select v-model="issueItem">
            <option value="blueprint_10"
              >{{ $t("Blueprint") }}{{ $t("Transporter III") }}</option
            >
            <option value="blueprint_14"
              >{{ $t("Blueprint") }} {{ $t("Yamato") }}</option
            >
            <option value="blueprint_15"
              >{{ $t("Blueprint") }} {{ $t("Scout Minerva") }}</option
            >
            <option value="blueprint_16"
              >{{ $t("Blueprint") }} {{ $t("Patrol Cruqal") }}</option
            >
            <option value="blueprint_17"
              >{{ $t("Blueprint") }} {{ $t("Cutter Orchis") }}</option
            >
            <option value="blueprint_18"
              >{{ $t("Blueprint") }} {{ $t("Corvette Najtar") }}</option
            >
            <option value="blueprint_19"
              >{{ $t("Blueprint") }} {{ $t("Frigate Droeel") }}</option
            >
            <option value="blueprint_20"
              >{{ $t("Blueprint") }} {{ $t("Destroyer Halgoin") }}</option
            >
            <option value="blueprint_21"
              >{{ $t("Blueprint") }} {{ $t("Cruiser Eceza") }}</option
            >
            <option value="blueprint_22"
              >{{ $t("Blueprint") }} {{ $t("Battlecruiser Dejah") }}</option
            >
            <option value="blueprint_23"
              >{{ $t("Blueprint") }} {{ $t("Carrier Bhun'il") }}</option
            >
            <option value="blueprint_24"
              >{{ $t("Blueprint") }} {{ $t("Dreadnought Zaneel") }}</option
            >
          </select>
          &nbsp;
          <input v-model="issueItem" />
        </p>
        <p>{{ $t("Amount") }}: <input v-model="issueAmount" /></p>
        <p>{{ $t("Recipient") }}: <input v-model="issueRecipient" /></p>
        <p>
          <button :disabled="clicked" @click="sendIssue()">
            {{ $t("Send Issue Item") }}
          </button>
        </p>
        <p v-if="error != null">
          <font color="red">{{ $t("Error") }}:</font>
          {{ JSON.stringify(error) }}
        </p>
        <p v-if="result != null">
          <font color="green">{{ $t("Result") }}:</font>
          {{ result.message }}
        </p>
      </template>

      <!-- Issue Stardust -->
      <template v-if="command == 'issuestardust'">
        <p>{{ $t("Amount") }}: <input v-model="issueStardustAmount" /></p>
        <p>{{ $t("Recipient") }}: <input v-model="issueStardustRecipient" /></p>
        <p>
          <button :disabled="clicked" @click="sendIssueStardust()">
            {{ $t("Send Issue Stardust") }}
          </button>
        </p>
        <p v-if="error != null">
          <font color="red">{{ $t("Error") }}:</font>
          {{ JSON.stringify(error) }}
        </p>
        <p v-if="result != null">
          <font color="green">{{ $t("Result") }}:</font>
          {{ result.message }}
        </p>
      </template>
      <!-- New Season -->
      <template v-if="command == 'newseason'">
        <p>{{ $t("Name") }}: <input v-model="seasonName" /></p>
        <p>{{ $t("Length in days") }}: <input v-model="seasonLength" /></p>
        <p>
          {{ $t("Start") }}: {{ moment.utc().format("MMM D HH:mm") }}
          {{ $t("End") }}:
          {{
            moment
              .utc()
              .add(seasonLength, "days")
              .format("MMM D HH:mm")
          }}
        </p>
        <p>{{ $t("Steem reward") }}: <input v-model="seasonReward" /></p>
        <p>{{ $t("Leach rate") }}: <input v-model="seasonLeachRate" /></p>
        <p>{{ $t("Deploy rate") }}: <input v-model="seasonDeployRate" /></p>
        <p>
          <button :disabled="clicked" @click="sendNewSeason()">
            {{ $t("Send New Season") }}
          </button>
        </p>
        <p v-if="error != null">
          <font color="red">{{ $t("Error") }}:</font>
          {{ JSON.stringify(error) }}
        </p>
        <p v-if="result != null">
          <font color="green">{{ $t("Result") }}:</font>
          {{ result.message }}
        </p>
      </template>
    </template>
    <template v-else>
      <template v-if="gameUser === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import SteemConnectService from "@/services/steemconnect";
import { mapState } from "vuex";

export default {
  name: "administration",
  data: function() {
    return {
      command: null,
      clicked: false,
      shopItem: null,
      shopParameter: null,
      shopValue: null,
      error: null,
      result: null,
      issueItem: null,
      issueAmount: null,
      issueRecipient: null,
      issueStardustAmount: null,
      issueStardustRecipient: null,
      seasonName: null,
      seasonLength: null,
      seasonReward: null,
      seasonLeachRate: null,
      seasonDeployRate: null
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
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      gameLocale: state => state.game.gameLocale
    })
  },
  methods: {
    prepareComponent() {
      null;
    },
    onCommand() {
      this.clicked = false;
      this.error = null;
      this.result = null;
    },
    sendUpdateShop() {
      this.clicked = true;
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.updateShop(
        this.loginUser,
        this.shopItem,
        this.shopParameter,
        this.shopValue,
        (error, result) => {
          if (error === null && result.success) {
            this.error = error;
            this.result = result;
          }
        }
      );
    },
    sendIssue() {
      this.clicked = true;
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.issue(
        this.loginUser,
        this.issueItem,
        this.issueAmount,
        this.issueRecipient,
        (error, result) => {
          if (error === null && result.success) {
            this.error = error;
            this.result = result;
          }
        }
      );
    },
    sendIssueStardust() {
      this.clicked = true;
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.issueStardust(
        this.loginUser,
        this.issueStardustAmount,
        this.issueStardustRecipient,
        (error, result) => {
          if (error === null && result.success) {
            this.error = error;
            this.result = result;
          }
        }
      );
    },
    sendNewSeason() {
      this.clicked = true;
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.newSeason(
        this.loginUser,
        this.seasonName,
        this.seasonLength,
        this.seasonReward,
        this.seasonLeachRate,
        this.seasonDeployRate,
        (error, result) => {
          if (error === null && result.success) {
            this.error = error;
            this.result = result;
          }
        }
      );
    }
  }
};
</script>
<style>
.administration input {
  width: 30ch;
}
</style>
