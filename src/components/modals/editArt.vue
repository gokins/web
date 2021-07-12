<template>
  <CModal title="编辑制品库" :closeOnBackdrop="false" :show="shown" @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <CButton color="warning" variant="outline" @click="$emit('update:shown', false )">取消</CButton>
      <CButton color="info" @click="subFun" :disabled="subing">提交</CButton>
    </template>
    <CInput label="名称" v-model="formData.name" placeholder="请输入名称(必填)" />
    <!-- <CInputCheckbox label="是否已归档" :checked.sync="formData.disabled" style="margin-bottom:10px" /> -->
    <div style="margin-bottom:10px;display:flex;">
      <div style="line-height:27x">是否已归档:&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <CSwitch color="info" variant="3d" :checked.sync="formData.disabled" />
    </div>
    <CTextarea label="描述" v-model="formData.desc" placeholder="请输入描述" rows="10" />

    <!-- <CInputCheckbox label="执行权限" :checked.sync="formData.exec" /> -->

  </CModal>
</template>
<script>
import { UtilCatch, ArtEdit } from "@/assets/js/apis";
export default {
  props: {
    shown: Boolean,
    orgId: String,
    info: Object,
  },
  watch: {
    shown (nv) {
      if (nv == true) {
        if (!this.orgId) {
          this.$emit('update:shown', false)
          return
        }
        this.subing = false;
        this.formData = {
          name: '',
          disabled: false,
          desc: '',
        };
        if (this.info && this.info.id && this.info.id != '') {
          this.formData.id = this.info.id;
          this.formData.name = this.info.name;
          this.formData.disabled = this.info.disabled == 1;
          this.formData.desc = this.info.desc;
        }
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
      this.subing = true;
      this.formData.orgId = this.orgId;
      ArtEdit(this.formData).then(res => {
        this.$emit('update:shown', false)
        this.$emit('subOk', res.data)
      }).catch(err => UtilCatch(this, err, () => {
        this.subing = false;
        /* const stat = err.response ? err.response.status : 0;
        if (stat == 511) {
          this.$msgErr("用户名已存在");
        } */
      }));
    }
  },
};
</script>