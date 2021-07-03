<template>
  <div>
    <ul class="tlist">
      <li v-for="item in items" :key="'org:'+item.id" @click="$router.push(`/org/info/${item.aid}`)">
        <div class="tit">
          <div class="tits">{{ item.name }}</div>
          <div class="tips" v-show="item.public=='1'" v-c-tooltip.hover.click="'所有人可查看相关流水线'">
            公开
          </div>
          <div style="flex:1"></div>
          <div class="tipln" v-if="item.pipeln!=null">
            <i class="iconfont icon-liushuixian" v-c-tooltip.hover.click="'流水线数量'" />&nbsp;{{item.pipeln}}
          </div>
          <div class="tipln" v-if="item.userln!=null">
            <i class="iconfont icon-chengyuan" v-c-tooltip.hover.click="'成员数量'" />&nbsp;{{item.userln}}
          </div>
        </div>
        <div class="infos">
          <div class="fg" v-if="item.desc&&item.desc!=''">{{item.desc}}</div>
          <div class="fg">{{$dateFmt(item.created)}}</div>
          <div style="flex:1"></div>
          <myavatar :src="item.avat" :nick="item.nick" imgw="18px" class="avat" />
        </div>
      </li>
    </ul>
    <div class="loadingCont" v-if="loading">
      <div style="flex:1"></div>
      <div class="rotateDiv"><i class="iconfont icon-Loadingalt2" /></div>
      <div>加载中</div>
      <div style="flex:1"></div>
    </div>
    <div class="emptyCont" v-else-if="!items||items.length<=0"><i class="iconfont icon-jinzhide" />没有内容</div>
  </div>
</template>
<script>
import myavatar from "@/components/avatar";
export default {
  components: { myavatar },
  props: {
    items: Array,
    loading: Boolean,
  },
  /* watch: {
    param (nv) {

    }
  }, */
  data () {
    return {}
  },
}
</script>
<style lang="sass" scoped>
.tlist
  li
    padding: 10px
    border-bottom: 1px solid #eee
    cursor: pointer
    border-radius: 8px
    // background: #fefefe
    // margin-bottom: 8px
    &:hover
      background: #eee
    .tit
      display: flex
      .tits
        color: #24292e
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
        margin: 5px 0 0 10px
        line-height: 20px

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