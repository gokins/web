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
        <!-- <div>
          <a :href="'api/art/pub/down/'+infos.id+'/'+'?authToken='+tokens()" target="_blank">下载全部</a>
        </div> -->
        <div class="fls">
          <DirsItem :verid="infos.id" :items="infos.files" pths="" />
        </div>
      </div>
    </div>
  </CModal>
</template>
<script>
import { getToken } from '@/assets/js/token';
import { UtilCatch, ArtVerList, ArtVerInfos } from "@/assets/js/apis";
import DirsItem from "@/components/view/dirsItem";
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
  components: { DirsItem },
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
      this.infoShow = false;
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
    }, tokens () {
      return getToken();
    }
  },
};
</script>
<style lang="sass" scoped>
.tlistDiv
  margin: 20px 10px
  text-align: center
  width: 300px
  border-right: 1px solid #ddd
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
  flex: 1
  padding: 0 10px
  .vers
    color: red
  .fls
    border: 1px solid #ccc
    padding: 10px
    margin-top: 20px
</style>