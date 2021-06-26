<template>
  <div>
    <CRow>
      <CCol sm="2"></CCol>
      <CCol sm="8">
        <CCard>
          <CCardHeader>
            <strong>组织信息 </strong> <small>Org</small>
            <!-- <div class="card-header-actions"></div> -->
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CInput
                  label="名称"
                  v-model="formData.name"
                  placeholder="请输入组织名称"
                  Max="10"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12">
                <CTextarea
                  label="描述"
                  v-model="formData.desc"
                  placeholder="请输入组织描述"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInputCheckbox label="公开" :checked.sync="formData.public" />
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
import { UtilCatch,OrgNew } from "@/assets/js/apis";
export default {
  data() {
    return {
      formData: {
        name: "",
        desc: "",
        public: false,
      },
    };
  },
  methods: {
    subFun() {
      if (this.formData.name == "") {
        console.log("name");
        this.$msgErr("请输入名称");
        return;
      }
      OrgNew(this.formData).then(res => {
          // this.$msgOk('')
          this.$router.push('info/'+res.data.id)
      }).catch(err => UtilCatch(this, err));
    },
  },
};
</script>
<style lang="sass" scoped>
.subRow
  margin-top: 10px
</style>