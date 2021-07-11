<template>
  <div v-if="items&&items.length>0">
    <div class="zipItem" v-for="(it,$k) in items" :key="'zipit:'+$k">
      <div class="tits" @click="toggleBody(it,$k)">
        <!-- <CIcon :name="hideBody[$k]!=true?'cil-caret-bottom':'cil-caret-right'" class="exIcon" width="10px"
          v-if="it.dir" /> -->
        <CIcon :name="hideBody[$k]!=true?'cil-folder-open':'cil-folder'" class="exIcon" style="color: #b9730a;"
          width="16px" v-if="it.dir" />
        <!-- <img src="http://static.jazpan.com/img/flbox.png" v-if="it.dir" /> -->
        <!-- <img :src="$ApiUrl+'/icon?name='+encodeURIComponent(it.name)" v-else /> -->
        <CIcon name="cil-file" class="exIcon" width="12px" v-else />
        <div>{{it.name}}</div>

        <CButton color="link" class="downBtn" @click.stop="goDown(it)">下载</CButton>
      </div>
      <transition name="el-fade-in">
        <DirsItem :verid="verid" :items="it.child" :pths="getPath(it)" v-show="hideBody[$k]!=true" />
      </transition>
    </div>
  </div>
</template>
<script>
import { UtilCatch, ArtVerUrl } from "@/assets/js/apis";
export default {
  name: 'DirsItem',
  props: {
    verid: String,
    items: Array,
    pths: String,
  },
  data () {
    return {
      hideBody: {}
    }
  }, methods: {
    getPath (it) {
      if (this.pths)
        return this.pths + '/' + it.name;
      else
        return it.name
    },
    toggleBody (it, k) {
      if (it.dir != true) return;
      console.log('toggleBody', k, this.hideBody[k])
      if (this.hideBody[k] == null)
        this.hideBody[k] = true
      else
        this.hideBody[k] = !this.hideBody[k];
      this.$forceUpdate();
    }, goDown (it) {
      ArtVerUrl(this.verid, this.getPath(it)).then(res => {
        console.log('goDown url:', res.data.url);
        window.open(res.data.url)
      }).catch(err => UtilCatch(this, err))
    }
  }
}
</script>
<style lang="sass" scoped>
.zipItem
  line-height: 20px
  font-size: 14px
  margin-left: 12px
  padding-left: 8px
  border-left: 1px dashed #0c0c0c
  .tits
    padding-top: 2px
    padding-bottom: 2px
    display: flex
    &:hover
      background: #efefef
  .exIcon
    font-weight: bold
    margin-right: 5px
  .downBtn
    margin: 0
    padding: 0
    font-size: 12px
    margin-left: 10px
</style>