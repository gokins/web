<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> 构建历史
        <div class="card-header-actions">
          <!-- <CButton size="sm" color="info" variant="outline" @click="goNew"
            >新建流水线</CButton
          > -->
        </div>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :hover="true"
          :striped="true"
          :border="false"
          :small="true"
          :fixed="true"
          :fields="fields"
          :items="items"
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
                查看
              </CButton>
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="run(item.id)"
              >
                运行
              </CButton>
            </td>
          </template>
        </CDataTable>
        <CPagination
          :activePage.sync="page"
          :pages="pages"
          size="sm"
          align="center"
          @update:activePage="getList"
        />
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import { UtilCatch, PipelineVersions } from "@/assets/js/apis";
export default {
  data() {
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
        {
          key: "repoName",
          label: "仓库名称",
        },
      ],
      items: [],
      page: 0,
      pages: 0,
      orgId: "",
      pipelineId: "",
    };
  },
  mounted() {
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
    getList(pg) {
      // if (this.orgId != "") {
      PipelineVersions({
        page: pg,
        orgId: this.orgId,
        pipelineId: this.pipelineId,
      })
        .then((res) => {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
      return;
      // }
      // PipelineList({ page: pg, orgId: this.orgId })
      //   .then((res) => {
      //     this.page = res.data.page;
      //     this.pages = res.data.pages;
      //     this.items = res.data.data;
      //   })
      //   .catch((err) => UtilCatch(this, err));
    },
    run(id) {
      RunPipeline({ pipelineId: id, orgId: this.orgId, repoId: "1" })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => UtilCatch(this, err));
    },
    goEdit(id) {
      this.$router.push("/pipeline/info/" + id);
    },
    goNew() {
      this.$router.push("/pipeline/new/" + this.orgId);
    },
  },
};
</script>