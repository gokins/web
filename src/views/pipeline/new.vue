<template>
  <div>
    <CRow>
      <CCol sm="2"></CCol>
      <CCol sm="8">
        <CCard>
          <CCardHeader>
            <strong>流水线</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CInput label="流水线名称" v-model="formData.name" placeholder="请输入流水线名称" Max="10" />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12">
                <CTextarea label="Yaml" v-model="formData.content" placeholder="Yaml" />
              </CCol>
            </CRow>
            <CRow class="subRow">
              <CCol sm="6">
                <CButton color="info" @click="subFun()">新建</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { UtilCatch, NewPipeline } from "@/assets/js/apis";
export default {
  data () {
    return {
      formData: {
        name: "",
        content: "",
        orgId: "",
      },
    };
  },
  mounted () {
    if (
      this.$route.params != null &&
      this.$route.params.orgId != null &&
      this.$route.params.orgId != ""
    ) {
      this.formData.orgId = this.$route.params.orgId;
    }
    this.formData.orgId = this.$route.params.orgId;
  },
  methods: {
    subFun () {
      if (this.formData.name == "") {
        this.$msgErr("请输入名称");
        return;
      }
      if (this.formData.content == "") {
        this.$msgErr("请输入Yaml");
        return;
      }
      NewPipeline(this.formData)
        .then((res) => {
          //   this.$msgOk('')
          if (this.formData.orgId && this.formData.orgId != '')
            this.$router.push("/pipeline/list/" + this.formData.orgId);
          else
            this.$router.push("/pipeline/list");
        })
        .catch((err) => UtilCatch(this, err));
    },
  },
};
</script>
<style lang="sass" scoped>
.subRow
  margin-top: 10px
</style>