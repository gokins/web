<template>
  <CModal title="查看制品详情" size="lg" :show="shown" @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <CButton color="warning" @click="$emit('update:shown', false )">关闭</CButton>
    </template>
    <div style="display:flex">
      <div class="tlistDiv">
        <ul>
          <li v-for="it in items" :key="'actver:'+it.id" @click="showVer(it)">
            <div class="tits" v-if="it.version">{{it.sha}}</div>
            <div class="tits" v-else>{{it.sha}}</div>
          </li>
        </ul>
        <CPagination :activePage="page" :pages="pages" @update:activePage="getList" style="float:right" />
      </div>
      <div class="verInfos" v-show="infoShow">
        <div class="vers" v-if="infos.version">{{infos.version}}</div>
        <div>{{infos.sha}}</div>
        <div>{{$dateFmt(infos.created)}}</div>
        <div>{{infos.desc}}</div>
        <div>----------------------------------------</div>
        <div>
          <ul>
            <li v-for="(it,ix) in infos.files" :key="'verfl:'+ix">
              {{it.name}}
              <ul>
                <li v-for="(its,jx) in it.files" :key="'verfls:'+jx">
                  {{its.name}}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </CModal>
</template>
<script>
import { UtilCatch, ArtVerList, ArtVerInfos } from "@/assets/js/apis";
export default {
  props: {
    shown: Boolean,
    packArt: Object,
  },
  watch: {
    shown (nv) {
      if (nv == true) this.getList(0);
    },
  },
  data () {
    return {
      items: [],
      page: 0,
      pages: 0,

      infoShow: false,
      infos: {},
    };
  },
  methods: {
    getList (pg) {
      ArtVerList({ packId: this.packArt.id, page: pg }).then((res) => {
        this.page = res.data.page;
        this.pages = res.data.pages;
        this.items = res.data.data;
      }).catch((err) => UtilCatch(this, err));
    }, addFun (user) {
      this.$emit('addFun', user.id, ok => {
        if (ok == true) {
          user.added = true;
          this.$refs.table.$forceUpdate()
        }
      })
    }, showVer (it) {
      ArtVerInfos(it.id).then(res => {
        this.infoShow = true;
        this.infos = res.data.info;
      }).catch((err) => UtilCatch(this, err));
    }
  },
};
</script>
<style lang="sass" scoped>
.tlistDiv
  margin: 20px 10px
  text-align: center
  flex: 1
  ul
    margin-bottom: 20px
  li
    padding: 3px
    border-bottom: 1px solid #eee
    cursor: pointer
    border-radius: 8px
    // background: #fefefe
    // margin-bottom: 8px
    &:hover
      background: #eee
    .icons
      width: 25px
      margin-top: 5px
      margin-right: 5px
      line-height: 30px
    .tits
      color: #24292e
      font-size: 14px
      font-weight: bold
      line-height: 35px
      span
        font-size: 14px
        color: #888
        margin-left: 10px

.verInfos
  width: 500px
  padding: 0 10px
  border-left: 1px solid #ddd
  .vers
    color: red
</style>