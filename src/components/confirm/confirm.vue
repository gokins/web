<template>
  <CModal :show.sync="modalShow" :no-close-on-backdrop="true" :centered="true" :size="conf.size" :color="conf.colors">
    <div v-html="content"></div>
    <template #header>
      <h6 class="modal-title">{{ conf.title }}</h6>
      <CButtonClose @click="modalShow = false" class="text-white" />
    </template>
    <template #footer>
      <CButton @click="Discard" color="light">取消</CButton>
      <CButton @click="Accept" color="info">确认</CButton>
    </template>
  </CModal>
</template>

<script>
export default {
  name: "Confirm",
  mounted () {
  },
  data () {
    return {
      conf: {
        content: "",
        size: "sm",
        colors: "dark",
        title: "提示",
      },
      yes: null,
      no: null,
      title: "",
      modalShow: true,
    };
  },
  methods: {
    Accept () {
      if (this.yes != null) {
        this.yes()
      }
      this.modalShow = false
    },
    Discard () {
      if (this.no != null) {
        this.no()
      }
      this.modalShow = false
    }
  },
};
</script>
<style lang="sass" scoped>
</style>
