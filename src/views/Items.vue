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
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.uid">
            <td>{{ $t(item.name) }}</td>
            <td>{{ item.total }}</td>
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

export default {
  name: "items",
  props: ["user"],
  data: function() {
    return {
      items: null
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
