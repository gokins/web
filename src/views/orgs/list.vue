<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> 组织列表
        <div class="card-header-actions">
          <CButton
            size="sm"
            color="info"
            variant="outline"
            @click="$router.push('new')"
            >新建组织</CButton
          >
        </div>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :hover="true"
          :striped="true"
          :border="true"
          :small="true"
          :fixed="true"
          :fields="fields"
          :items="items"
          :items-per-page="5"
          pagination
        >
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import { UtilCatch, OrgList } from "@/assets/js/apis";
export default {
  data() {
    return {
      fields: ["id", "name"],
      items: [],
      page:0,
    };
  },
  mounted() {
    this.getList(0);
  },
  methods: {
    getList(pg) {
      OrgList({ page: pg }).then((res) => {
        this.page=res.data.page;
        this.items=res.data.data;
      }).catch((err) => UtilCatch(this, err));
    },
    goEdit() {
      this.$router.push("info");
    },
  },
};
</script>