<template>
  <CModal title="选择权限" size="sm" :show="shown" @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <CButton color="warning" variant="outline" @click="$emit('update:shown', false )">取消</CButton>
      <CButton color="info" @click="subFun" :disabled="loading">提交</CButton>
    </template>

    <CInputCheckbox label="新建用户" :checked.sync="formData.permUser" />
    <CInputCheckbox label="新建组织" :checked.sync="formData.permOrg" />
    <CInputCheckbox label="新建流水线" :checked.sync="formData.permPipe" />

  </CModal>
</template>
<script>
import { UtilCatch, UserInfo, UserPerm } from "@/assets/js/apis";
export default {
  props: {
    shown: Boolean,
    uid: String,
  },
  watch: {
    shown (nv) {
      if (nv == true) {
        this.loading = true;
        if (this.uid)
          this.getInfo(this.uid);
      }
    },
  },
  data () {
    return {
      user: {},
      uinfo: {},
      formData: {},
      loading: false,
    };
  },
  methods: {
    getInfo (id) {
      UserInfo(id).then(res => {
        this.loading = false;
        this.user = res.data.user;
        this.uinfo = res.data.info;
        this.formData = {
          id: this.user.id,
          permUser: this.uinfo.permUser == 1,
          permOrg: this.uinfo.permOrg == 1,
          permPipe: this.uinfo.permPipe == 1,
        }
      }).catch(err => UtilCatch(this, err));
    }, subFun () {
      this.loading = true;
      UserPerm(this.formData).then(() => {
        this.$emit('update:shown', false)
      }).catch(err => UtilCatch(this, err))
    }
  },
};
</script>