<template>
  <CSidebar fixed :minimize="minimize" :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
    <CSidebarBrand class="d-md-down-none" to="/">
      <div class="logos">
        <img src="gokinsui/imgs/logo.png" />
        <span>Gokins</span>
      </div>
      <!-- <CIcon class="c-sidebar-brand-full" name="logo" size="custom-size" :height="35"
        viewBox="0 0 556 134" /> -->
      <!-- <CIcon class="c-sidebar-brand-minimized" name="logo" size="custom-size" :height="35" viewBox="0 0 110 134" /> -->
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="$options.nav" />
    <!-- <CSidebarMinimizer class="d-md-down-none" @click.native="$store.commit('set', ['sidebarMinimize', !minimize])" /> -->
  </CSidebar>
</template>

<script>
import nav from './_nav'

export default {
  name: 'TheSidebar',
  nav,
  computed: {
    show () {
      return this.$store.state.sidebarShow
    },
    minimize () {
      return this.$store.state.sidebarMinimize
    }
  }
}
</script>
<style lang="sass" scoped>
.logos
  img
    width: 50px
    float: left
    margin: 5px 5px 0 0
  span
    font-size: 24px
    text-decoration: none
</style>
