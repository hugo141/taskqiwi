<template>
  <TaskView />
</template>

<script lang="ts">
import Vue from "vue";
import TaskView from "../components/TaskView.vue";

export default Vue.extend({
  name: "Home",

  components: {
    TaskView,
  },
});
</script>
