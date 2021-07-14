<template>
  <CModal title="查看制品详情" size="lg" :show="shown" @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <span></span>
    </template>
    <div style="display:flex">
      <div class="tlistDiv">
        <ul>
          <li v-for="it in items" :key="'actver:'+it.id" @click="showVer(it.id)">
            <div class="tits">
              {{it.version?it.version:it.sha}}
              <i class="iconfont icon-release releaseCls" v-c-tooltip.hover.click="'release'" v-if="it.preview!=1" />
            </div>
          </li>
        </ul>
        <CPagination :activePage="page" :pages="pages" @update:activePage="getList" style="float:right" />
      </div>
      <div class="verInfos" v-show="infoShow&&infos.id">
        <CCard>
          <CCardHeader>
            <strong>
              {{infos.version?infos.version:infos.sha}}
              <i class="iconfont icon-release releaseCls" v-c-tooltip.hover.click="'release'" v-if="infos.preview!=1" />
            </strong>
            <div class="card-header-actions">
              <CButton size="sm" color="info" variant="outline" @click="editFun">
                {{editFlag?'保存':'编辑'}}
              </CButton>
              <CButton size="sm" color="warning" variant="outline" @click="rmFun">
                删除
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody v-if="!editFlag">
            <!-- <div class="vers" v-if="infos.version">{{infos.version}}</div> -->
            <div style="margin-bottom:10px">sha&id: {{infos.sha}}</div>
            <div style="margin-bottom:10px">创建时间: {{$dateFmt(infos.created)}}</div>
            <div>{{infos.desc}}</div>
          </CCardBody>
          <CCardBody v-else>
            <CInput label="版本TAG" v-model="formData.version" placeholder="eg: v1.0.0" />
            <CInput label="描述" v-model="formData.desc" placeholder="请输入描述" />
            <div>这是一个preview:&nbsp;&nbsp;&nbsp;&nbsp;
              <CSwitch color="info" variant="3d" :checked.sync="formData.ispre" />
            </div>
          </CCardBody>
        </CCard>
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
import { UtilCatch, ArtVerList, ArtVerInfos, ArtVerSave, ArtVerRm } from "@/assets/js/apis";
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

      editFlag: false,
      formData: {},
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
    }, showVer (id) {
      ArtVerInfos(id).then(res => {
        this.infoShow = true;
        this.infos = res.data.info;
        this.editFlag = false;
        this.formData.id = this.infos.id;
        this.formData.version = this.infos.version;
        this.formData.desc = this.infos.desc;
        this.formData.ispre = this.infos.preview == 1;
      }).catch((err) => UtilCatch(this, err));
    }, tokens () {
      return getToken();
    }, editFun () {
      if (!this.editFlag) {
        this.editFlag = true
        return;
      }
      ArtVerSave(this.formData).then(res => {
        this.getList(this.page);
        this.showVer(res.data);
      }).catch((err) => UtilCatch(this, err));
    }, rmFun () {
      this.$confirm('确定删除此制品包括文件吗(无法恢复)?', null, () => {
        ArtVerRm(this.infos.id).then(() => {
          this.$msgOk("操作成功");
          this.infoShow = false;
          this.infos = {};
          this.getList(this.page);
        }).catch((err) => UtilCatch(this, err));
      })
    }
  },
};
</script>
<style lang="sass" scoped>
.releaseCls
  color: #569a4e
  font-size: 14px
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