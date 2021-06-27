<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>组织: {{ info.name }}</strong>
        <!-- <div class="card-header-actions"></div> -->
      </CCardHeader>
      <CCardBody>
        <CTabs variant="pills" :vertical="{ navs: 'col-md-2', content: 'col-md-10' }">
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator" /> 流水线
            </template>
            <CDataTable
              :hover="true"
              :striped="true"
              :border="false"
              :small="true"
              :fixed="true"
              :fields="pipefields"
              :items="pipeitems"
            >
              <template #edit="{ item }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="goEdit(item.id)"
                  >
                    编辑
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CTab>
          <CTab>
            <template slot="title"> <CIcon name="cil-basket" /> 成员 </template>
            <CCard>
              <CCardHeader>
                <strong>所有者</strong>
                <!-- <div class="card-header-actions"></div> -->
              </CCardHeader>
              <CCardBody>
                <div>
                <div class="c-avatar">
                  <img
                    src="img/avatars/6.jpg"
                    class="c-avatar-img "
                  />
                </div>
                {{user.nick}}
                </div>
              </CCardBody>
            </CCard>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-chart-pie" /> 设置
            </template>
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
                <CButton color="info" @click="subFun()">保存</CButton>
              </CCol>
            </CRow>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import { UtilCatch, OrgInfo, OrgPipelineList, OrgSave } from "@/assets/js/apis";
export default {
  data() {
    return {
      info: {},
      user: {},
      pipefields: [
        {
          key: "name",
          label: "名称",
        },
        {
          key: "displayName",
          label: "描述",
        },
        {
          key: "edit",
          label: "操作",
          sorter: false,
          filter: false,
        },
      ],
      pipeitems: [],
      formData: {
        id: "",
        name: "",
        desc: "",
        public: false,
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
    getInfo(id) {
      OrgInfo(id)
        .then((res) => {
          this.info = res.data.org;
          this.user = res.data.user;
          this.formData.id = this.info.id;
          this.formData.name = this.info.name;
          this.formData.desc = this.info.desc;
          this.formData.public = this.info.public;
          this.getPipeList();
        })
        .catch((err) =>
          UtilCatch(this, err, (err) => {
            this.$router.push("/500");
          })
        );
    },
    getPipeList() {
      OrgPipelineList({ page: 0, orgId: this.info.id })
        .then((res) => {
          // this.page = res.data.page;
          // this.pages = res.data.pages;
          this.pipeitems = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    goEdit(id) {
      this.$router.push("/pipeline/info/" + id);
    },
    subFun() {
      if (this.formData.name == "") {
        console.log("name");
        this.$msgErr("请输入名称");
        return;
      }
      OrgSave(this.formData)
        .then((res) => {
          this.$msgOk("保存成功");
          // this.$router.push('info/'+res.data.id)
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