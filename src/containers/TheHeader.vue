<template>
  <CHeader fixed with-subheader light>
    <CToggler in-header class="ml-3 d-lg-none" @click="$store.commit('toggleSidebarMobile')" />
    <CToggler in-header class="ml-3 d-md-down-none" @click="$store.commit('toggleSidebarDesktop')" />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <CIcon name="logo" height="48" alt="Logo" />
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/org">
          组织
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/pipeline" exact>
          流水线
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink :to="`/user/info/${uids}`">
          个人信息
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt />
    </CHeaderNav>
    <CSubheader class="px-3">
      <CButton class="backBtn" @click="goBack" v-show="showBack">
        <CIcon :content="$options.coreics['cilChevronLeft']" />back
      </CButton>
      <CBreadcrumbRouter class="border-0 mb-0" />
    </CSubheader>
  </CHeader>
</template>

<script>
import { freeSet } from "@coreui/icons";
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'

export default {
  coreics: freeSet,
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  data () {
    return {
      showBack: false
    }
  },
  computed: {
    uids () {
      return this.$store.state.user?.id
    }
  },
  mounted () {
    // console.log('window.history.length', window.history.length);
    this.showBack = window.history.length > 1
  },
  methods: {
    goBack () {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="sass" scoped>
.backBtn
  height: 35px
  line-height: 20px
  margin-top: 6px
  color: blue
  border: 1px solid #ccc
</style>
