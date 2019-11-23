<template>
  <div class="buffs">
    <h1>{{ $t("Buffs") }} {{ gameUser }}</h1>
    <p>
      {{ $t("Next Buff End") }}: {{ nextEventDuration() || "-" }}
      <br />
      {{ $t("Next Refresh") }}: {{ nextRefreshFormatted() || "-" }}
    </p>
    <template v-if="gameUser !== null">
      <p>
        {{ $t("Your Balance") }}:
        <b
          ><font v-if="wallet != null" color="#72bcd4">
            {{
              Number(wallet.stardust / 100000000).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}</font
          ></b
        >&nbsp;
        <span :style="{ color: '#72bcd4' }">{{ $t("SD") }}</span>
      </p>
      <table>
        <thead>
          <th @click="sort('name')">{{ $t("Buff") }}</th>
          <th>{{ $t("Description") }}</th>
          <th @click="sort('price')">{{ $t("Price") }}</th>
          <th @click="sort('buff_duration')">{{ $t("Duration") }}</th>
          <th @click="sort('buff_end')">{{ $t("End Date") }}</th>
          <th @click="sort('buff_end')">{{ $t("Active") }}</th>
          <th @click="sort('buff_end')">{{ $t("Ends in") }}</th>
          <th v-if="loginUser !== null && loginUser === gameUser">
            {{ $t("Buff") }}
          </th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="buff in sortedBuffs" :key="buff.name">
            <td>{{ $t(buff.name) }}</td>
            <td>{{ $t(buffDescription(buff.name)) }}</td>
            <td :style="{ color: '#72bcd4' }">
              {{
                Number(buff.price / 1e8).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
              {{ $t("SD") }}
            </td>
            <td>{{ buff.buff_duration }} {{ $t("days") }}</td>
            <td>
              <span v-if="buff.buff_end > 0">
                {{
                  moment.unix(buff.buff_end, "seconds").format("MMM D HH:mm")
                }}</span
              ><span v-else>-</span>
            </td>
            <td>
              {{ buff.buff_end | activeCharges(buff.buff_duration) }}
            </td>
            <td>
              <span v-if="chainResponse.includes(buff.name)">
                <timer-sand-icon :title="$t('Transaction sent')" />
                {{ nextRefreshFormatted() }}
              </span>
              <span v-else>{{ buff.buff_end | busyPretty(now) }}</span>
            </td>
            <td>
              <span v-if="loginUser !== null && loginUser === gameUser">
                <button
                  :disabled="inWork(buff) || processing"
                  v-if="buffPossible(buff)"
                  @click="sendBuff(buff)"
                >
                  <arrow-up-bold-icon :title="$t('Buff')" />
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>{{ $t("Please set the") }} {{ $t("user") }}</p>
    </template>
  </div>
</template>

<script>
import BuffsService from "@/services/buffs";
import WalletService from "@/services/wallet";
import SteemConnectService from "@/services/steemconnect";
import moment from "moment";
import { mapState } from "vuex";
import TimerSandIcon from "vue-material-design-icons/TimerSand.vue";
import ArrowUpBoldIcon from "vue-material-design-icons/ArrowUpBold.vue";
import * as types from "@/store/mutation-types";

export default {
  name: "buffs",
  components: {
    TimerSandIcon,
    ArrowUpBoldIcon
  },
  data: function() {
    return {
      buffs: null,
      wallet: null,
      quantity: null,
      interval: null,
      coal: null,
      ore: null,
      copper: null,
      uranium: null,
      clicked: [],
      chainResponse: [],
      currentSort: "name",
      currentSortDir: "asc",
      processing: false,
      now: moment.utc(),
      nextRefresh: null
    };
  },
  async mounted() {
    this.clicked = [];
    this.chainResponse = [];
    await this.prepareComponent();
    this.now = moment.utc();
    this.interval = setInterval(() => {
      this.now = moment.utc();
      if (this.nextRefresh !== null && this.nextRefresh.isBefore(this.now)) {
        this.refreshFromApi();
      }
    }, 1000);
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "planet/" + types.SET_PLANET_ID:
          this.clicked = [];
          this.chainResponse = [];
          this.prepareComponent();
      }
    });
  },
  filters: {
    busyPretty(busy, now) {
      var busyUntil = moment(new Date(busy * 1000));
      if (busy === 0) {
        return "-";
      } else {
        if (now.isAfter(busyUntil)) {
          return "-";
        } else {
          return moment.duration(now.diff(busyUntil)).humanize();
        }
      }
    },
    timePretty(time) {
      if (time === 0) {
        return "-";
      }
      return moment.duration(parseInt(time), "seconds").humanize();
    },
    activeCharges(endDate, duration) {
      let active = 0;
      let now = moment().unix();
      if (endDate > now) {
        active = Math.ceil((endDate - now) / (86400 * duration));
      }
      return active;
    }
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      posX: state => state.planet.posX,
      posY: state => state.planet.posY,
      gameLocale: state => state.game.gameLocale
    }),
    sortedBuffs() {
      var sortedBuffs = this.buffs;
      if (sortedBuffs !== null) {
        return sortedBuffs.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedBuffs;
      }
    }
  },
  methods: {
    async prepareComponent() {
      if (this.$route.name == "buffs") {
        await this.getBuffs();
        await this.getStardust();
      }
    },
    async getBuffs() {
      const response = await BuffsService.all(this.gameUser);
      this.buffs = response;
    },
    async getStardust() {
      const response = await WalletService.get(this.gameUser);
      this.wallet = response;
    },
    refreshDone(buff) {
      let refreshed = false;
      this.clicked.forEach(buffWaiting => {
        if (buffWaiting.name == buff.name) {
          if (buffWaiting.buff_end < buff.buff_end) {
            refreshed = true;
          }
        }
      });
      return refreshed;
    },
    sendBuff(buff) {
      let self = this;
      this.processing = true;
      this.clicked.push({ name: buff.name, buff_end: buff.buff_end });
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.buff(this.loginUser, buff.name, (error, result) => {
        if (error === null && result.success) {
          self.handleCallback(this, buff);
        }
      });
      // For non-working callbacks
      setTimeout(function() {
        self.handleCallback(self, buff);
      }, 700);
    },
    handleCallback(self, buff) {
      if (self.processing) {
        self.chainResponse.push(buff.name);
        self.processing = false;
        this.wallet.stardust = this.wallet.stardust - buff.price;
        this.nextRefresh = moment.utc().add(6, "seconds");
      }
    },
    buffPossible(buff) {
      if (this.wallet != null && this.wallet.stardust >= buff.price) {
        return true;
      } else {
        return false;
      }
    },
    inWork(buff) {
      let inWork = false;
      if (this.clicked != null) {
        if (this.clicked.some(c => c.name == buff.name)) {
          inWork = true;
        }
      }
      return inWork;
    },
    buffDescription(buffName) {
      let description = "-";
      if (buffName == "missioncontrol") {
        description = "400 Missions";
      }
      return description;
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    nextEventDuration() {
      let nextEvent = null;
      if (this.buffs !== null) {
        this.buffs.forEach(buff => {
          let busy = moment(new Date(buff.buff_end * 1000));
          if (nextEvent === null) {
            if (busy !== null && busy.isAfter(this.now)) {
              nextEvent = busy;
            }
          }

          if (
            nextEvent !== null &&
            nextEvent.isAfter(busy) &&
            busy.isAfter(this.now)
          ) {
            nextEvent = moment(busy);
          }
        });
        if (nextEvent === null) {
          return null;
        }
        let duration = this.moment.duration(nextEvent.diff(this.now));
        //Get Days and subtract from duration
        let days = ("0" + duration.days()).slice(-2);
        duration.subtract(this.moment.duration(days, "days"));

        //Get hours and subtract from duration
        let hours = ("0" + duration.hours()).slice(-2);
        duration.subtract(this.moment.duration(hours, "hours"));

        //Get Minutes and subtract from duration
        let minutes = ("0" + duration.minutes()).slice(-2);
        duration.subtract(this.moment.duration(minutes, "minutes"));

        //Get seconds
        let seconds = ("0" + duration.seconds()).slice(-2);
        return days + ":" + hours + ":" + minutes + ":" + seconds;
      } else {
        return null;
      }
    },
    nextRefreshFormatted() {
      if (this.nextRefresh != null) {
        let duration = this.moment.duration(this.nextRefresh.diff(this.now));

        //Get Days and subtract from duration
        let days = ("0" + duration.days()).slice(-2);
        duration.subtract(this.moment.duration(days, "days"));

        //Get hours and subtract from duration
        let hours = ("0" + duration.hours()).slice(-2);
        duration.subtract(this.moment.duration(hours, "hours"));

        //Get Minutes and subtract from duration
        let minutes = ("0" + duration.minutes()).slice(-2);
        duration.subtract(this.moment.duration(minutes, "minutes"));

        //Get seconds
        let seconds = ("0" + duration.seconds()).slice(-2);
        if (seconds < 0) {
          seconds = "00";
        }
        return minutes + ":" + seconds;
      } else {
        return null;
      }
    },
    async refreshFromApi() {
      await this.getBuffs();
      this.buffs.forEach(buff => {
        if (this.chainResponse.includes(buff.name)) {
          if (this.refreshDone(buff)) {
            this.chainResponse = this.chainResponse.filter(value => {
              return value !== buff.name;
            });
          }
        }
      });
      if (this.chainResponse.length > 0) {
        this.nextRefresh = moment.utc().add(6, "seconds");
      } else {
        this.clicked = [];
        this.nextRefresh = null;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>
