<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> 流水线
        <div class="card-header-actions">
          <CButton
            size="sm"
            color="info"
            variant="outline"
            @click="goNew"
            >新建流水线</CButton
          >
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
import { UtilCatch, PipelineList, OrgPipelineList } from "@/assets/js/apis";
export default {
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
    };
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
      if (this.orgId != "") {
        OrgPipelineList({ page: pg, orgId: this.orgId })
          .then((res) => {
            this.page = res.data.page;
            this.pages = res.data.pages;
            this.items = res.data.data;
          })
          .catch((err) => UtilCatch(this, err));
          return
      }
      PipelineList({ page: pg, orgId: this.orgId })
        .then((res) => {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    goEdit(id) {
      this.$router.push("/pipeline/info/" + id);
    },
    goNew() {
      this.$router.push('/pipeline/new/'+this.orgId)
    },
  },
};
</script>