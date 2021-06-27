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
        >
          <template #aid="{ item }">
            <td style="text-align: center">
              <CLink :to="'info/' + item.aid"># {{ item.aid }}</CLink>
            </td>
          </template>
          <template #name="{ item }">
            <td>
              <CLink :to="'info/' + item.aid">{{ item.name }}</CLink>
            </td>
          </template>
          <template #pipelines="{ item }">
            <td class="py-2">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="goOrgPipelines(item.aid)"
              >
                查看流水线
              </CButton>
            </td>
          </template>
        </CDataTable>
        <CPagination
          :activePage="page"
          :pages="pages"
          @update:activePage="getList"
          style="float: right"
        />
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import { UtilCatch, OrgList } from "@/assets/js/apis";
export default {
  data() {
    return {
      fields: [
        {
          key: "aid",
          label: "编号",
          _style: "width:80px;text-align:center",
        },
        {
          key: "name",
          label: "名称",
        },
        {
          key: "desc",
          label: "描述",
        },
        {
          key: "created",
          label: "创建时间",
        },
        {
          key: "pipelines",
          label: "操作",
          sorter: false,
          filter: false,
        },
      ],
      items: [],
      page: 0,
      pages: 0,
    };
  },
  mounted() {
    this.getList(0);
  },
  methods: {
    getList(pg) {
      OrgList({ page: pg })
        .then((res) => {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    goOrgPipelines(orgId) {
      this.$router.push("/org/info/" + orgId);
    },
    goEdit() {
      this.$router.push("info");
    },
  },
};
</script>