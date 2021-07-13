<template>
  <div>
    <ul class="items">
      <li
        v-for="item in items"
        :key="'version:' + item.id"
        @click="openRuns(item)"
      >
        <div style="display: flex">
          <div class="tit">
            <div class="tit_info">
              <div class="tit_types">
                <CIcon v-if="item.types == 'timer'" name="cil-alarm" />
                <CIcon
                  v-else-if="item.types == 'webHook'"
                  name="cil-vertical-align-bottom"
                />
                <CIcon v-else-if="item.types == 'web'" name="cil-cloud" />
              </div>
              <div class="tit_name">
                {{ item.name }}
              </div>
              <div class="tit_active">
                <i
                  class="iconfont icon-chacha color-error"
                  style="font-size: 15px; margin-left: 5px"
                  v-if="item.enabled == 0"
                />
                <i
                  class="iconfont icon-success color-success"
                  style="font-size: 15px; margin-left: 5px"
                  v-else-if="item.enabled == 1"
                />
              </div>
            </div>
            <div class="tit_desc">
              <div style="line-height: 35px; margin-right: 5px"></div>
              创建时间:{{ $dateFmt(item.created) }}
              <br />
              备注:{{ item.desc }}
            </div>
          </div>
          <div class="tit_params">
            <span v-html="getParams(item)"> </span>
          </div>
          <div class="tit_btus">
            <slot :item="item"></slot>
          </div>
        </div>
      </li>
    </ul>
    <div class="loadingCont" v-if="triggerLoading">
      <div style="flex: 1"></div>
      <div class="rotateDiv">
        <i class="iconfont icon-Loadingalt2" />
      </div>
      <div>加载中</div>
      <div style="flex: 1"></div>
    </div>
    <div class="emptyCont" v-else-if="!items || items.length <= 0">
      <i class="iconfont icon-jinzhide" />没有内容
    </div>
    <RunView
      :runShow.sync="this.runShow"
      @closeRun="closeRun"
      :triggerId="triggerId"
    >
    </RunView>
  </div>
</template>
<script>
import RunView from "@/components/modals/runView";
export default {
  components: { RunView },
  props: {
    perm: Object,
    items: Array,
    triggerLoading: Boolean,
  },
  data() {
    return {
      timers: ["不重复", "每天", "每周"],
      triggerId: "",
      runShow:false,
    };
  },
  mounted() {},
  methods: {
    getParams(item) {
      if (!item) {
        return "";
      }
      let param = JSON.parse(item.params);
      let h = "";
      switch (item.types) {
        case "webHook":
          h =
            '<span style=" border:1px solid #eee ;font-size: 15px;margin-right:3px">' +
            param.hookType +
            "</span>";
          if (param.branch) {
            h +=
              '<span style=" border:1px solid #eee ;font-size: 15px;margin-right:3px">' +
              param.branch +
              "</span>";
          }
          if (param.hookEvent) {
            h +=
              '<span style=" border:1px solid #eee ;font-size: 15px">' +
              param.hookEvent +
              "</span>";
          }
          break;
        case "timer":
          h =
            '<span style=" border:1px solid #eee ;font-size: 15px">频率: ' +
            this.timers[param.timerType] +
            "</span>";
          break;
        case "web":
          h =
            '<span style=" border:1px solid #eee ;font-size: 15px">Web</span>';
          break;
      }
      return h;
    },
    openRuns(item) {
      this.triggerId = item.id;
      this.runShow=true
    },
    closeRun() {
      this.runShow = false;
    },
  },
};
</script>
<style lang="sass" scoped>
.items
  li
    padding: 10px
    border-bottom: 1px solid #eee
    border-radius: 8px
    cursor: pointer

    .tit
      flex: 0.3
    &:hover
      background: #eee

    .tit_info
      display: flex

    .tit_name
      color: #24292e
      font-size: 20px
      font-weight: bold
      line-height: 45px

    .tit_types
      line-height: 45px
      margin-right: 5px

    .tit_active
      line-height: 45px
    .tit_desc
      font-size: 8px
      font-weight: bold
    .tits
    .tit_params
      flex: 0.5
      line-height: 45px
    .tit_btus
      flex: 0.2
      line-height: 45px
      .tit_btu
        margin: 3px
</style>
