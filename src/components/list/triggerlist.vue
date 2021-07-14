<template>
  <div>
    <ul class="items">
      <li
        v-for="item in items"
        :key="'version:' + item.id"
        @click="openRuns(item)"
      >
        <div>
          <div class="tit">
            <div class="tit_info">
              <div style="flex: 1">
                <CIcon v-if="item.types == 'timer'" name="cil-alarm" />
                <CIcon
                  v-else-if="item.types == 'webHook'"
                  name="cil-vertical-align-bottom"
                />
                <CIcon v-else-if="item.types == 'web'" name="cil-cloud" />
                {{ item.name }}
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
                <span v-if="item.types == 'webHook'">
                  <span class="tit_params" v-if="item.params.hookType">{{
                    item.params.hookType
                  }}</span>
                  <span class="tit_params" v-if="item.params.branch">{{
                    item.params.branch
                  }}</span>
                  <span class="tit_params" v-if="item.params.hookEvent">{{
                    item.params.hookEvent
                  }}</span>
                </span>
                <span class="tit_params" v-if="item.types == 'timer'">{{
                  timers[item.params.timerType]
                }}</span>
                <span class="tit_params" v-if="item.types == 'web'">Web</span>
              </div>
              <slot :item="item"></slot>
            </div>

            <div class="tit_desc">
              <div style="flex: 1">
                {{ $dateFmt(item.created) }}
                <span class="tit_span" v-if="item.types == 'webHook'"
                  >hook地址: {{ host }}/hook/{{ item.id }}
                  <i
                    style="font-size: 12px"
                    class="iconfont icon-bianhao cpicn"
                    @click.stop="copyHook(item.id)"
                    v-c-tooltip.hover.click="'复制hook地址'"
                  />
                </span>
              </div>
              <myavatar :src="item.avat" :nick="item.nick" imgw="15px" />
            </div>
          </div>
          <div style="display: flex">
            {{ item.desc }}
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
import { copyText } from "@/assets/js/utils";
import RunView from "@/components/modals/runView";
import myavatar from "@/components/avatar";

export default {
  components: { RunView, myavatar },
  props: {
    host: String,
    items: Array,
    triggerLoading: Boolean,
  },
  data() {
    return {
      timers: ["不重复", "每天", "每周"],
      triggerId: "",
      runShow: false,
    };
  },
  mounted() {},
  methods: {
    openRuns(item) {
      this.triggerId = item.id;
      this.runShow = true;
    },
    closeRun() {
      this.runShow = false;
    },
    copyHook(id) {
      let txt = this.host + "/hook/" + id;
      if (copyText(txt)) this.$msgOk("已成功复制Hook地址");
      else this.$msgErr("复制Hook地址失败");
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
      color: #24292e
      font-size: 20px
      font-weight: bold
      line-height: 35px
    .tit_params
      color: #aaa
      font-size: 15px
      padding: 0 5px
      margin: 10px 0 0 10px
      height: 20px
      border: 1px solid #ddd
      text-align: center

    .tit_desc
      display: flex
      .tit_span
        color: #aaa
        font-size: 12px
        padding: 0 5px
        margin: 10px 0 0 10px
        height: 20px
        border: 1px solid #ddd
        text-align: center
</style>
