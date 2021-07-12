<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-user" />
        用户管理
        <div class="card-header-actions">
          <CButton size="sm" color="info" variant="outline" @click="newshow=true" v-if="lginfo.permUser==1">
            新建用户
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CDataTable :hover="true" :striped="true" :border="true" :small="true" :fixed="true" :fields="fields"
          :items="items">
          <template #aid="{ item }">
            <td style="text-align: center">
              {{ item.aid }}
            </td>
          </template>
          <template #name="{ item }">
            <td class="pthands" style="color:blue" @click="$router.push(`/user/info/${item.aid}`)">
              {{item.name}}
            </td>
          </template>
          <template #nick="{ item }">
            <td class="pthands" style="color:blue" @click="$router.push(`/user/info/${item.aid}`)">
              <myavatar :src="item.avat" :nick="item.nick" imgw="18px" />
            </td>
          </template>
          <template #created="{ item }">
            <td>
              {{$dateFmt(item.created)}}
            </td>
          </template>
          <template #active="{ item }">
            <td>
              {{item.active==1?'已激活':'未激活'}}
            </td>
          </template>
          <template #btns="{ item }">
            <td class="py-2">
              <CButton color="info" square size="sm" @click="$router.push(`/user/info/${item.aid}`)">
                详细
              </CButton>
              <CButton color="warning" square size="sm" @click="permSel=true;permUid=item.id" style="margin-left:10px"
                v-if="lginfo.permUser==1">
                权限
              </CButton>
            </td>
          </template>
        </CDataTable>
        <CPagination :activePage="page" :pages="pages" @update:activePage="getList" style="float: right" />
      </CCardBody>
    </CCard>
    <NewUser :shown.sync="newshow" @subOk="getList(page)" />
    <SelUserPerm :shown.sync="permSel" :uid="permUid" />
  </div>
</template>
<script>
import SelUserPerm from "@/components/modals/selUserPerm";
import NewUser from "@/components/modals/newUser";
import myavatar from "@/components/avatar";
import { UserPage, UtilCatch } from "@/assets/js/apis";
export default {
  components: { myavatar, NewUser, SelUserPerm },
  data () {
    return {
      fields: [
        {
          key: "aid",
          label: "编号",
          _style: "width:80px;text-align:center",
        },
        {
          key: "name",
          label: "用户名",
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
          key: "active",
          label: "状态",
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
      pages: 0,

      newshow: false,
      permSel: false,
      permUid: '',
    }
  }, computed: {
    lginfo () {
      return this.$store.state.uinfo || {}
    },
  }, mounted () {
    this.getList();
  }, methods: {
    getList (pg) {
      UserPage({ page: pg }).then((res) => {
        this.page = res.data.page;
        this.pages = res.data.pages;
        this.items = res.data.data;
      }).catch((err) => UtilCatch(this, err));
    }
  }
}
</script>