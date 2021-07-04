<template>
  <div class="c-app">
    <TheSidebar />
    <CWrapper>
      <TheHeader />
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter />
    </CWrapper>
  </div>
</template>

<script>
import { UInfo } from "@/assets/js/apis";
import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
    TheHeader,
    TheFooter
  }, mounted () {
    this.getUInfo();
  }, methods: {
    getUInfo () {
      UInfo().then(res => {
        if (res.data.login == true) {
          this.$store.commit('setUserInfo', res.data.user, res.data.info);
        } else {
          this.$router.push('/login');
        }
      }).catch(err => {
        console.log('getUInfo err', err);
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
