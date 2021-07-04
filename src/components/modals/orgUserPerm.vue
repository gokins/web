<template>
  <CModal title="选择权限" size="sm" :show="shown" @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <CButton color="info" @click="$emit('subFun',formData)">提交</CButton>
    </template>

    <CInputCheckbox label="编辑权限" :checked.sync="formData.rw" />
    <CInputCheckbox label="执行权限" :checked.sync="formData.exec" />

  </CModal>
</template>
<script>
export default {
  props: {
    shown: Boolean,
    perm: Object,
  },
  watch: {
    shown (nv) {
      if (nv == true) {
        this.formData.id = this.perm.id;
        this.formData.rw = this.perm.rw;
        this.formData.exec = this.perm.exec;
      }
    },
  },
  data () {
    return {
      formData: {}
    };
  },
  methods: {
    subFun () {
      this.$emit('subFun', user.id, ok => {
        if (ok == true) {
          user.added = true;
          this.$refs.table.$forceUpdate()
        }
      })
    }
  },
};
</script>