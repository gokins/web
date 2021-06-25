<template>
  <div class="message">
    <CAlert :show.sync="dismissCountDown" :color="type" fade>
      {{ content }}
    </CAlert>
  </div>
</template>

<script>
export default {
  name: "Message",
  mounted() {},
  data() {
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
  position: absolute
  top: 10%
  left: 50%
  transform: translate(-50%, -50%)
</style>
