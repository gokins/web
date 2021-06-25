<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> 组织列表
        <div class="card-header-actions">
          <CButton size="sm" color="info" variant="outline" @click="goEdit()">新建组织</CButton>
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
export default {
  data() {
    return {
      fields: ["id", "name"],
      items: [],
    };
  },
  mounted() {},
  methods:{
      goEdit(){
          this.$router.push('edit')
      }
  }
};
</script>