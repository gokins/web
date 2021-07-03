<template>
  <CModal title="新建用户" :show="shown" @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <CButton color="info" @click="subFun" :disabled="subing">提交</CButton>
    </template>
    <CInput label="用户名" v-model="formData.name" placeholder="请输入用户名(必填)" />
    <CInput label="昵称" v-model="formData.nick" placeholder="请输入昵称(必填)" />
    <CInput label="密码" v-model="formData.pass" placeholder="请输入密码(必填)" type="password" />

    <!-- <CInputCheckbox label="编辑权限" :checked.sync="formData.rw" /> -->
    <!-- <CInputCheckbox label="执行权限" :checked.sync="formData.exec" /> -->

  </CModal>
</template>
<script>
import { UtilCatch, UserNew } from "@/assets/js/apis";
export default {
  props: {
    shown: Boolean,
    perm: Object,
  },
  watch: {
    shown (nv) {
      if (nv == true) {
        this.subing = false;
        this.formData = {
          name: '',
          nick: '',
          pass: '',
        };
      }
    },
  },
  data () {
    return {
      subing: false,
      formData: {}
    };
  },
  methods: {
    subFun () {
      this.subing = true;
      UserNew(this.formData).then(() => {
        this.$emit('update:shown', false)
      }).catch(err => UtilCatch(this, err, err => {
        this.subing = false;
        const stat = err.response ? err.response.status : 0;
        if (stat == 511) {
          fn(true);
          this.$msgErr("用户名已存在");
        }
      }));
    }
  },
};
</script>