<template>
  <!-- <div class="message" v-if="dismissCountDown>0"> -->
  <CAlert :show.sync="dismissCountDown" :color="type" fade class="message">
    {{ content }}
  </CAlert>
  <!-- </div> -->
</template>

<script>
export default {
  name: "Message",
  mounted () { },
  data () {
    return {
      type: "info",
      dismissCountDown: 2,
      content: "",
    };
  },
  methods: {},
};
</script>
<style lang="sass" scoped>
.message
  margin: 0
  position: fixed
  top: 10%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: 10000
</style>
