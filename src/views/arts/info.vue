<template>
  <div>
    <CCard>
      <CCardHeader>
        <i class="iconfont icon-zhipinku" />&nbsp;
        <strong>{{ arty.name }} </strong>
        <small>ID: {{arty.identifier}}</small>
        <i class="iconfont icon-bianhao cpicn" @click.stop="copyIds(arty.identifier)"
          v-c-tooltip.hover.click="'复制制品库ID'" />
        <div class="card-header-actions">
          <CButton size="sm" color="primary" variant="outline" @click="selArt = true" v-if="perm.write==true">
            修改制品库
          </CButton>
          <!-- <CButton color="dark" variant="outline" square size="sm" @click="copy()" style="margin-left: 5px"
            v-if="uinfo.permPipe == 1">
            复制
          </CButton>
          <CButton color="info" variant="outline" square size="sm" @click="run()" style="margin-left: 5px"
            v-if="perm.exec == true">
            运行
          </CButton> -->
        </div>
      </CCardHeader>
      <CCardBody>
        <PacklistView :items="packitems" :loading="loading" #default="{item}">
          <!-- <CButton color="info" variant="outline" square size="sm" @click.stop="arteditr=item;selArt = true"
            class="pipeBtn" v-if="perm.write==true">
            修改
          </CButton>
          <CButton color="danger" size="sm" @click.stop="rmArtFun(item.id)" class="pipeBtn" v-if="perm.write==true">
            删除
          </CButton> -->
        </PacklistView>
      </CCardBody>
    </CCard>
    <EditArt :shown.sync="selArt" :orgId="arty.orgId" :info="arty" @subOk="getInfo(arty.id)" v-if="perm.write==true" />
  </div>
</template>
<script>
import {
  ArtInfo,
  ArtPackList,
  UtilCatch,
} from "@/assets/js/apis";
import { copyText } from "@/assets/js/utils";
import EditArt from "@/components/modals/editArt";
import PacklistView from "@/components/list/packlist";
export default {
  components: { EditArt, PacklistView },
  data () {
    return {
      arty: {},
      user: {},
      perm: {},
      selArt: false,

      loading: true,
      packitems: [],
    }
  },
  mounted () {
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.getInfo(this.$route.params.id);
  }, methods: {
    getInfo (id) {
      ArtInfo(id).then(res => {
        this.arty = res.data.arty;
        this.user = res.data.user;
        this.perm = res.data.perm;
        this.getPackList();
      }).catch(err => UtilCatch(this, err))
    }, getPackList (pg) {
      this.loading = true;
      ArtPackList({ repoId: this.arty.id, page: pg }).then(res => {
        this.loading = false;
        this.packitems = res.data.data;
      }).catch(err => UtilCatch(this, err))
    },
    copyIds (txt) {
      if (copyText(txt))
        this.$msgOk('已成功复制制品库ID');
      else
        this.$msgErr('复制制品库ID失败');
    }
  }
}
</script>
<style lang="sass" scoped>
.cpicn
  margin-left: 10px
  color: #0072ff
  font-size: 16px
  margin-left: 5px
  padding: 7px 5px 5px 5px
  cursor: pointer
  &:hover
    background: #bed6f5
</style>