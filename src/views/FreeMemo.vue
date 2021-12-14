<template>
  <memo-editor />
</template>

<script lang="ts">
import Vue from "vue";
import MemoEditor from "../components/MemoEditor.vue";

export default Vue.extend({
  name: "FreeMemo",

  components: {
    MemoEditor,
  },
});
</script>