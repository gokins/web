<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>流水线名称:{{ pipelineName }} </strong>
        <div class="card-header-actions">
          <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="run()"
              style="margin-left:5px"
          >
            运行
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTabs variant="pills" :vertical="{ navs: 'col-md-2', content: 'col-md-10' }">
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator"/>
              构建历史
            </template>
            <CDataTable :hover="true" :striped="true" :border="false" :small="true" :fixed="true"
                        :fields="versionfields" :items="versionitems">
              <template #number="{ item }">
                <td>
                  <CLink :to="'../build/'+item.id"># {{ item.number }}</CLink>
                </td>
              </template>
              <template #pipelineName="{ item }">
                <td>
                  <CLink :to="'../build/'+item.id">{{ item.pipelineName }}</CLink>
                </td>
              </template>
              <template #edit="{ item }">
                <td class="py-2">
                  <CButton color="primary" variant="outline" square size="sm" @click="goEdit(item.id)">
                    编辑
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-chart-pie"/>
              设置
            </template>
                <PipeNew :pipeId.sync="this.$route.params.id" :editf="true"/>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import {PipelineInfo, PipelineVersions,RunPipeline, UtilCatch,} from "@/assets/js/apis";
import {freeSet} from "@coreui/icons";
import PipeNew from "./new";

export default {
  coreics: freeSet,
  components: {PipeNew},
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
      pipelineName: "",
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
            this.pipeInfo(id)
          })
          .catch((err) => UtilCatch(this, err));
    },
    pipeInfo(pipeid) {
      PipelineInfo({id: pipeid}).then((res) => {
        this.pipelineName = res.data.name
      }).catch((err) => UtilCatch(this, err));
    },
    run() {
      RunPipeline({ pipelineId: this.$route.params.id, repoId: "1" })
          .then((res) => {
            this.goVersion(res.data.id);
          })
          .catch((err) => UtilCatch(this, err));
    },
    goVersion(id) {
      this.$router.push("/pipeline/build/" + id);
    },
    goEdit(id) {
      this.$router.push("/pipeline/info/" + id);
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