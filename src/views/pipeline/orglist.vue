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
            @click="$router.push('new')"
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
          <template #status="{ item }">
            <td>
              <CBadge :color="getBadge(item.status)" @click="goEdit(item.id)"
                >编辑</CBadge
              >
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
import { UtilCatch, OrgPipelineList } from "@/assets/js/apis";
export default {
  data() {
    return {
      fields: ["id", "name", "displayName", "status"],
      items: [],
      page: 0,
      pages: 0,
      orgId: "123",
    };
  },
  mounted() {
    this.getList(0);
  },
  methods: {
    getList(pg) {
      OrgPipelineList({ page: pg, orgId: this.orgId })
        .then((res) => {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    goEdit(id) {
      this.$router.push("info/" + id);
    },
    getBadge(status) {
      return status === "Active"
        ? "success"
        : status === "Inactive"
        ? "secondary"
        : status === "Pending"
        ? "warning"
        : status === "Banned"
        ? "danger"
        : "primary";
    },
  },
};
</script>