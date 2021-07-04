<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-history" />
        构建历史
        <div class="card-header-actions">
          <!-- <CButton size="sm" color="info" variant="outline" @click="goNew"
            >新建流水线</CButton
          > -->
        </div>
      </CCardHeader>
      <CCardBody>
        <VersionlistView :items="items" :loading="loading" />
        <CPagination :activePage="page" :pages="pages" @update:activePage="getList"
          style="float: right;margin-top:20px" />
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import { PipelineVersions, UtilCatch } from "@/assets/js/apis";
import VersionlistView from "@/components/list/versionlist";
export default {
  components: { VersionlistView },
  data () {
    return {
      fields: [
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
      ],
      loading: true,
      items: [],
      page: 0,
      pages: 0,
      orgId: "",
      pipelineId: "",
    };
  },
  mounted () {
    if (
      this.$route.params != null &&
      this.$route.params.pipelineId != null &&
      this.$route.params.pipelineId != ""
    ) {
      this.pipelineId = this.$route.params.pipelineId;
    }
    this.getList(0);
  },
  methods: {
    getList (pg) {
      PipelineVersions({
        page: pg,
        orgId: this.orgId,
        pipelineId: this.pipelineId,
      }).then((res) => {
        this.loading = false;
        if (res.data != null) {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        }
      }).catch((err) => UtilCatch(this, err));
    },
    goEdit (id) {
      this.$router.push("/pipeline/info/" + id);
    },
    goNew () {
      this.$router.push("/pipeline/new/" + this.orgId);
    },
  },
};
</script>