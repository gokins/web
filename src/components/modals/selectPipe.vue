<template>
  <CModal
    title="选择流水线"
    size="lg"
    :show="shown"
    @update:show="(val) => $emit('update:shown', val)"
  >
    <template #footer>
      <CButton color="warning" @click="$emit('update:shown', false )">关闭</CButton>
    </template>
        <CDataTable
        ref="table"
          :hover="true"
          :striped="true"
          :border="true"
          :small="true"
          :fixed="true"
          :fields="fields"
          :items="items"
        >
          <template #btns="{ item }">
            <td class="py-2">
              <CButton
                color="info"
                square
                size="sm"
                @click="addFun(item)"
                :disabled="item.added==true"
              >
                添加
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
  </CModal>
</template>
<script>
import { UtilCatch, PipelineList } from "@/assets/js/apis";
export default {
  props: {
    shown: Boolean,
  },
  watch: {
    shown(nv) {
      if (nv == true) this.getList(0);
    },
  },
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
          key: "btns",
          label: "操作",
          sorter: false,
          filter: false,
        },
      ],
      items: [],
      page: 0,
      pages: 0
    };
  },
  methods: {
    getList(pg) {
      PipelineList({ page: pg })
        .then((res) => {
          this.page = res.data.page;
          this.pages = res.data.pages;
          this.items = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },addFun(user){
      this.$emit('addFun',user.id,ok=>{
        if(ok==true){
          user.added=true;
          this.$refs.table.$forceUpdate()
        }
      })
    }
  },
};
</script>