<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>流水线:{{ pipelineName }} </strong>
        <div class="card-header-actions">
          <CButton color="dark" variant="outline" square size="sm" @click="copy()" style="margin-left:5px">
            复制
          </CButton>
          <CButton color="info" variant="outline" square size="sm" @click="run()" style="margin-left:5px">
            运行
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTabs variant="pills" :vertical="{ navs: 'col-md-2', content: 'col-md-10' }">
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator" />
              构建历史
            </template>
            <VersionlistView :items="versionitems" :loading="loading" :hidepipe="true" />
            <CPagination :activePage="versionpage" :pages="versionpages" @update:activePage="getVersionList"
              style="float: right;margin-top:20px" />
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-chart-pie" />
              设置
            </template>
            <CCard>
              <PipeNew :pipeId.sync="this.$route.params.id" :editf="true" />
            </CCard>
            <CCard>
              <CCardHeader style="background-color: #ffe8e6">
                <strong>危险操作区</strong>
              </CCardHeader>
              <CCardBody style="display: flex">
                <div style="flex: 1">
                  <h5>删除流水线</h5>
                  <p>流水线删除之后无法恢复.请谨慎操作</p>
                </div>
                <div>
                  <CButton color="danger" variant="outline" square @click="deletedPipe">
                    删除流水线
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
    <SelectBranches :shown.sync="selectShow" :id="this.$route.params.id" />
  </div>
</template>
<script>
import { CopyPipeline, DeletedPipeline, PipelineInfo, PipelineVersions, UtilCatch, } from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
import PipeNew from "./new";
import SelectBranches from "@/components/modals/selectBranches";
import VersionlistView from "@/components/list/versionlist";

export default {
  coreics: freeSet,
  components: { PipeNew, VersionlistView, SelectBranches },
  data () {
    return {
      loading: true,
      versionpage: 0,
      versionpages: 0,
      versionitems: [],
      pipelineName: "",
      formData: {
        name: "",
        content: "",
        pipelineId: "",
      },
      pipelineId: "",
      selectShow: false,
    };
  },
  mounted () {
    console.log("$options.coreics", this.$options.coreics["cliXcircle"]);
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.pipelineId = this.$route.params.id
    this.getVersionList();
    this.pipeInfo()
  },
  methods: {
    getVersionList (pg) {
      this.loading = true;
      PipelineVersions({
        page: pg,
        pipelineId: this.pipelineId,
      }).then((res) => {
        this.loading = false;
        this.versionpage = res.data.page;
        this.versionpages = res.data.pages;
        this.versionitems = res.data.data;
      }).catch((err) => UtilCatch(this, err));
    },
    pipeInfo () {
      PipelineInfo({ id: this.pipelineId }).then((res) => {
        this.pipelineName = res.data.name
      }).catch((err) => UtilCatch(this, err));
    },
    run () {
      this.selectShow = true
    },
    goVersion (id) {
      this.$router.push("/pipeline/build/" + id);
    },
    goEdit (id) {
      this.$router.push("/pipeline/info/" + id);
    },
    copy () {
      this.$confirm("确定复制流水线?", null, () => {
        CopyPipeline(this.pipelineId)
          .then((res) => {
            this.$router.push("/pipeline/info/" + res.data.id);
          })
          .catch((err) => UtilCatch(this, err));
      })
    },
    deletedPipe () {
      this.$confirm("确定删除流水线?", null, () => {
        DeletedPipeline(this.pipelineId)
          .then((res) => {
            this.$router.back(-1)
          })
          .catch((err) => UtilCatch(this, err));
      })

    }
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