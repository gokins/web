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
        <ul class="orgList">
          <li v-for="item in items" :key="'org:'+item.id" @click="$router.push('info/' + item.aid)">
            <div class="tit">
              <div class="tits">{{ item.name }}</div>
              <div class="tips" v-show="item.public=='1'">公开</div>
              <div style="flex:1"></div>
              <div class="tipln"><i class="iconfont icon-liushuixian" />&nbsp;{{item.pipeln}}</div>
              <div class="tipln"><i class="iconfont icon-chengyuan" />&nbsp;{{item.userln}}</div>
            </div>
            <div class="infos">
              <div class="fg">{{item.desc}}</div>
              <div class="fg">{{$dateFmt(item.created)}}</div>
              <div style="flex:1"></div>
              <myavatar :src="item.avat" :nick="item.nick" imgw="18px" class="avat" />
            </div>
          </li>
        </ul>
        <CPagination :activePage="page" :pages="pages" @update:activePage="getList" style="float: right" />
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import myavatar from "@/components/avatar";
import { UtilCatch, OrgList } from "@/assets/js/apis";
export default {
  components: { myavatar },
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
<style lang="sass" scoped>
.orgList
  margin-bottom: 20px
  li
    padding: 10px
    border-bottom: 1px solid #eee
    cursor: pointer
    border-radius: 8px
    &:hover
      background: #eee
    .tit
      display: flex
      .tits
        color: #3577b1
        font-size: 20px
        font-weight: bold
        line-height: 35px
      .tips
        color: #aaa
        font-size: 10px
        margin: 10px 0 0 10px
        width: 30px
        height: 20px
        border: 1px solid #ddd
        text-align: center
      .tipln
        color: #537898
        font-size: 10px
        margin-left: 10px

    .infos
      display: flex
      color: #aaa
      font-size: 12px
      line-height: 30px
      .fg
        margin-right: 10px
      .avat
        line-height: 30px
</style>