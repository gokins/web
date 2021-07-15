<template>
  <CModal title="触发记录" :show="runShow" @update:show="close" :centered="true" size="lg">
    <template #footer>
      <CButton color="warning" @click="close">关闭</CButton>
    </template>
    <div>
      <ul class="runlist">
        <li v-for="item in runList" :key="item.id" @click="item.pipeVersionId != '' && goVersion(item.pipeVersionId)">
          <div style="display: flex">
            <div style="flex: 1">
              <i class="iconfont icon-prohibit color-warning" v-if="item.error != ''" />
              <i class="iconfont icon-success color-success" style="font-size:15px" v-else-if="item.bStatus=='ok'" />
              <i class="iconfont icon-chacha color-error" style="font-size:15px" v-else-if="item.bStatus=='error'" />
              <i class="iconfont icon-jinzhide color-cancel" style="font-size:15px"
                v-else-if="item.bStatus=='cancel'" />
              <i v-else class="iconfont icon-jiazaizhong color-runing" style="font-size:15px;" />
              <span v-if="item.error != ''" style="margin-left: 5px;color:#e55353">{{item.error}}</span>
              <span v-else :style="{ 'margin-left' : item.bStatus == 'running' ? '20px' : '8px' }">#{{ item.number }}
                {{item.pipelineName}}</span>
            </div>
            <span>{{ $dateFmt(item.created) }}</span>
          </div>
        </li>
      </ul>
      <div class="loadingCont" v-if="runLoading">
        <div style="flex: 1"></div>
        <div class="rotateDiv">
          <i class="iconfont icon-Loadingalt2" />
        </div>
        <div>加载中</div>
        <div style="flex: 1"></div>
      </div>
      <div class="emptyCont" v-else-if="!runList || runList.length <= 0">
        <i class="iconfont icon-jinzhide" />没有内容
      </div>
    </div>
    <CPagination :activePage.sync="runPage" :pages="runPages" size="sm" style="float: right; margin-top: 20px"
      @update:activePage="geList" />
  </CModal>
</template>
<script>
import { TriggerRuns, UtilCatch } from "@/assets/js/apis";
export default {
  components: {},
  props: {
    triggerId: String,
    runShow: Boolean,
  },
  data() {
    return {
      runLoading: false,
      runList: [],
      runPage: 0,
      runPages: 0,
    };
  },
  watch: {
    runShow(nv) {
      if (nv == true) {
        if (this.triggerId != "") this.geList();
      }
    },
  },
  mounted() {
  },
  methods: {
    goVersion(pipeVersionId) {
      this.$router.push("/pipeline/build/" + pipeVersionId);
    },
    close() {
      this.runList = [];
      this.$emit("closeRun");
    },
    geList(pg) {
      if (this.triggerId == "") {
        return;
      }
      this.runLoading = true;
      TriggerRuns({ page: pg, id: this.triggerId })
        .then((res) => {
          this.runLoading = false;
          if (res.data != null) {
            this.runPage = res.data.page;
            this.runPages = res.data.pages;
            this.runList = res.data.data;
          }
        })
        .catch((err) => UtilCatch(this, err));
    },
  },
};
</script>

<style lang="sass" scoped>
.runlist
  li
    padding: 10px
    border-bottom: 1px solid #eee
    border-radius: 8px
    cursor: pointer

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
      display: flex
</style>