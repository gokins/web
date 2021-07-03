<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> 组织列表
        <div class="card-header-actions">
          <CButton size="sm" color="info" variant="outline" @click="$router.push('new')">
            新建组织
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <OrglistView :items="items" />
        <CPagination :activePage="page" :pages="pages" @update:activePage="getList"
          style="float: right;margin-top:20px" />
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import OrglistView from "@/components/list/orglist";
import { UtilCatch, OrgList } from "@/assets/js/apis";
export default {
  components: { OrglistView },
  data () {
    return {
      items: [],
      page: 0,
      pages: 0,
    };
  },
  mounted () {
    this.getList(0);
  },
  methods: {
    getList (pg) {
      OrgList({ page: pg })
        .then((res) => {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    goOrgPipelines (orgId) {
      this.$router.push("/org/info/" + orgId);
    },
    goEdit () {
      this.$router.push("info");
    },
  },
};
</script>