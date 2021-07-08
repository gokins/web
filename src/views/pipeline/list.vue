<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-sitemap" />
        流水线
        <div class="card-header-actions">
          <CButton
            size="sm"
            color="info"
            variant="outline"
            @click="goNew"
            v-if="uinfo.permPipe == 1"
          >
            新建流水线
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <PipelistView :items="items" :loading="loading" #default="{ item }">
          <CButton
            color="info"
            variant="outline"
            square
            size="sm"
            @click.stop="run(item.id)"
            class="pipeBtn"
          >
            运行
          </CButton>
        </PipelistView>
        <CPagination
          :activePage.sync="page"
          :pages="pages"
          size="sm"
          align="center"
          @update:activePage="getList"
          style="margin-top: 5px"
        />
      </CCardBody>
    </CCard>
    <SelectBranches :shown.sync="selectShow" :id="pipelineId" />
  </div>
</template>
<script>
import { OrgPipelineList, PipelineList, UtilCatch } from "@/assets/js/apis";
import PipelistView from "@/components/list/pipelist";
import SelectBranches from "@/components/modals/selectBranches";

export default {
  components: { PipelistView, SelectBranches },
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "id",
        },
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
      items: [],
      page: 0,
      pages: 0,
      orgId: "",
      pipelineId: "",
      selectShow: false,
      loading: false,
    };
  },
  computed: {
    uinfo() {
      return this.$store.state.uinfo || {};
    },
  },
  mounted() {
    if (
      this.$route.params != null &&
      this.$route.params.orgId != null &&
      this.$route.params.orgId != ""
    ) {
      this.orgId = this.$route.params.orgId;
    }
    this.getList(0);
  },
  methods: {
    getList(pg) {
      this.loading = true;
      if (this.orgId != "") {
        OrgPipelineList({ page: pg, orgId: this.orgId })
          .then((res) => {
            this.loading = false;
            this.page = res.data.page;
            this.pages = res.data.pages;
            this.items = res.data.data;
          })
          .catch((err) => UtilCatch(this, err));
        return;
      }
      PipelineList({ page: pg, orgId: this.orgId })
        .then((res) => {
          this.loading = false;
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    run(id) {
      this.pipelineId = id;
      this.selectShow = true;
    },
    goVersion(id) {
      this.$router.push("/pipeline/build/" + id);
    },
    goEdit(id) {
      this.$router.push("/pipeline/info/" + id);
    },
    goNew() {
      this.$router.push("/pipeline/new");
    },
  },
};
</script>
<style lang="sass" scoped>
.pipeBtn
  margin: 5px 0 0 5px
  line-height: 20px
  height: 20px
  padding-top: 0
</style>
