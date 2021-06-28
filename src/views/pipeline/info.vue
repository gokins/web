<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>构建历史: </strong>
        <!-- <div class="card-header-actions"></div> -->
      </CCardHeader>
      <CCardBody>
        <CTabs
          variant="pills"
          :vertical="{ navs: 'col-md-2', content: 'col-md-10' }"
        >
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator" /> 构建历史
            </template>
            <CDataTable
              :hover="true"
              :striped="true"
              :border="false"
              :small="true"
              :fixed="true"
              :fields="versionfields"
              :items="versionitems"
            >
              <template #number="{ item }">
                <td>
                  <CLink># {{ item.number }}</CLink>
                </td>
              </template>
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
            <template slot="title">
              <CIcon name="cil-chart-pie" /> 设置
            </template>
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
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import {
  UtilCatch,
  PipelineInfo,
  SavePipeline,
  PipelineList,
  PipelineVersions,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
import SelectUser from "@/components/modals/selectUser";
export default {
  coreics: freeSet,
  components: { SelectUser },
  data() {
    return {
      versionfields: [
        {
          key: "number",
          label: "number",
        },
        {
          key: "pipelineName",
          label: "流水线名称",
        },
        {
          key: "pipelineDisplayName",
          label: "流水线描述",
        },
        {
          key: "repoName",
          label: "仓库名称",
        },
      ],
      versionitems: [],
      formData: {
        name: "",
        content: "",
        pipelineId: "",
      },
    };
  },
  mounted() {
    console.log("$options.coreics", this.$options.coreics["cliXcircle"]);
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.getPipeList(this.$route.params.id);
  },
  methods: {
    getInfo(id) {
      PipelineInfo({ id: id })
        .then((res) => {
          this.formData.name = res.data.name;
          this.formData.content = res.data.jsonContent;
          this.formData.pipelineId = id;
        })
        .catch((err) =>
          UtilCatch(this, err, (err) => {
            this.$router.push("/500");
          })
        );
    },
    getPipeList(id) {
      PipelineVersions({
        page: 0,
        orgId: this.orgId,
        pipelineId: id,
      })
        .then((res) => {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.versionitems = res.data.data;
          this.getInfo(id);
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
      if (this.formData.content == "") {
        console.log("content");
        this.$msgErr("请输入yaml");
        return;
      }
      SavePipeline(this.formData)
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
.org-users
  display: flex
.item
  width: 100px
.tools
  text-align: center
</style>