<template>
  <CModal title="新建用户" :closeOnBackdrop="false" :show="shown" @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <CButton color="warning" variant="outline" @click="$emit('update:shown', false )">取消</CButton>
      <CButton color="info" @click="subFun" :disabled="subing">提交</CButton>
    </template>
    <CInput label="用户名" v-model="formData.name" placeholder="请输入用户名(必填)" />
    <CInput label="昵称" v-model="formData.nick" placeholder="请输入昵称(必填)" />
    <CInput label="密码" v-model="formData.pass" placeholder="请输入密码(必填)" type="password" />
    <div style="margin-top:10px;color:#b98a69">小提示:新用户需要另外授权权限</div>

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
      if (!this.formData.name) {
        this.$msgErr('用户名必填');
        return;
      }
      if (!this.formData.nick) {
        this.$msgErr('昵称必填');
        return;
      }
      if (!this.formData.pass) {
        this.$msgErr('密码必填');
        return;
      }
      this.subing = true;
      UserNew(this.formData).then(() => {
        this.$emit('update:shown', false)
      }).catch(err => UtilCatch(this, err, err => {
        this.subing = false;
        const stat = err.response ? err.response.status : 0;
        if (stat == 511) {
          this.$msgErr("用户名已存在");
        }
      }));
    }
  },
};
</script>