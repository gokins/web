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
                <CInput
                  label="流水线名称"
                  v-model="formData.name"
                  placeholder="请输入流水线名称"
                  Max="10"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12">
                <CTextarea
                  label="Yaml"
                  v-model="formData.content"
                  placeholder="Yaml"
                />
              </CCol>
            </CRow>
            <CRow class="subRow">
              <CCol sm="6">
                <CButton color="info" @click="subFun()">保存</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { UtilCatch, PipelineInfo } from "@/assets/js/apis";
export default {
  data() {
    return {
      formData: {
        name: "",
        content: "",
      },
    };
  },
  mounted() {
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.getInfo(this.$route.params.id);
  },
  methods: {
    subFun() {
      //   if (this.formData.name == "") {
      //     this.$msgErr("请输入名称");
      //     return;
      //   }
      //   if (this.formData.content == "") {
      //     this.$msgErr("请输入Yaml");
      //     return;
      //   }
      //   NewPipeline(this.formData)
      //     .then((res) => {
      //       //   this.$msgOk('')
      //       this.$router.push("/pipeline/list");
      //     })
      //     .catch((err) => UtilCatch(this, err));
    },
    getInfo(id) {
      PipelineInfo({ id: id })
        .then((res) => {
          this.formData.name = res.name;
          this.formData.content = res.content;
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