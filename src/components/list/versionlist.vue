<template>
  <div>
    <ul class="tlist">
      <li v-for="item in items" :key="'version:'+item.id" @click="$router.push('/pipeline/build/' + item.id)">
        <div class="tit">
          <div class="icons rotateDiv" v-if="item.build&&item.build.id!=''">
            <i class="iconfont icon-success color-success" style="font-size:20px" v-if="item.build.status=='ok'" />
            <i class="iconfont icon-chacha color-error" style="font-size:20px" v-else-if="item.build.status=='error'" />
            <i class="iconfont icon-jinzhide color-cancel" style="font-size:20px"
              v-else-if="item.build.status=='cancel'" />
            <i class="iconfont icon-jiazaizhong color-runing" style="font-size:18px" v-else />
          </div>
          <div class="tits">
            #{{ item.number }}
            <span v-if="!hidepipe&&item.pipelineName&&item.pipelineName!=''">{{item.pipelineName}}</span>
          </div>
          <div class="tips" v-if="item.build&&item.build.id!=''">
            <i class="iconfont icon-zonghaoshishichang" style="font-size:14px" />
            {{$dateCha(item.build.started,item.build.finished)}}
          </div>
          <div class="tips">
            <i class="iconfont icon-branches" style="font-size:14px" />
            {{item.sha||'默认分支'}}
          </div>
          <div style="flex:1"></div>
          <div class="fg">{{$dateFmt(item.created)}}</div>
          <slot :item="item"></slot>
        </div>
        <!-- <div class="tools">

        </div> -->
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
export default {
  props: {
    items: Array,
    loading: Boolean,
    hidepipe: Boolean,
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
      .icons
        width: 25px
        margin-top: 5px
        margin-right: 5px
        line-height: 30px
      .tits
        color: #24292e
        font-size: 20px
        font-weight: bold
        line-height: 35px
        span
          font-size: 14px
          color: #888
          margin-left: 10px
      .tips
        color: #aaa
        font-size: 10px
        padding: 0 5px
        margin: 10px 0 0 10px
        height: 20px
        border: 1px solid #ddd
        text-align: center
      .tipln
        color: #537898
        font-size: 10px
        margin: 5px 0 0 10px
        line-height: 20px
      .fg
        margin-right: 10px
        color: #aaa

    .tools
      display: flex
</style>