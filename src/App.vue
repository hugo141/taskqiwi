<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Task Qiwi"
          class="shrink mr-2"
          contain
          src="./assets/picker-50.png"
          transition="scale-transition"
          width="40"
        />

        <h1 class="Heading-4">Task Qiwi</h1>
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  }),
});
</script>
