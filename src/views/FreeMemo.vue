<template>
  <memo-editor ref="subComponent"/>
</template>

<script>
import Vue from "vue";
import MemoEditor from "../components/MemoEditor.vue";

export default Vue.extend({
  name: "FreeMemo",

  components: {
    MemoEditor,
  },
  beforeRouteLeave (to, from, next) {
    if(!this.$refs.subComponent.saved){
      let answer = window.confirm("保存してないよ？")
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
});
</script>