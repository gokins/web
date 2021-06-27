<template>
  <CModal
    title="选择用户"
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
          <template #aid="{ item }">
            <td style="text-align: center">
              # {{ item.aid }}
            </td>
          </template>
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
import { UtilCatch, UserPage } from "@/assets/js/apis";
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
          key: "aid",
          label: "编号",
          _style: "width:80px;text-align:center",
        },
        {
          key: "name",
          label: "名称",
        },
        {
          key: "nick",
          label: "昵称",
        },
        {
          key: "created",
          label: "创建时间",
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
      UserPage({ page: pg })
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