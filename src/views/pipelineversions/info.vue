<template>
  <div>
    <CCard>
      <CCardHeader>
        <div class="hd-tit">
          <div class="icons rotateDiv">
            <i class="iconfont icon-success color-success" style="font-size:30px" v-if="build.status=='ok'" />
            <i class="iconfont icon-chacha color-error" style="font-size:30px" v-else-if="build.status=='error'" />
            <i class="iconfont icon-jinzhide color-cancel" style="font-size:30px" v-else-if="build.status=='cancel'" />
            <i class="iconfont icon-jiazaizhong color-runing" style="font-size:25px" v-else />
          </div>
          <CLink :to="'../info/'+pipe.id">{{ pipe.name }}</CLink> &nbsp;:&nbsp; <strong>#{{pv.number}}</strong>
          <!-- <div class="card-header-actions"></div> -->
        </div>
      </CCardHeader>
      <CCardBody class="contbody">
        <div class="container">
          <div class="stages">
            <div class="tit">构建阶段</div>
            <div class="stage" v-for="stageid in this.stageids" :key="'stage:'+stageid">
              <div class="tits" @click="toggleStage(stageid)">
                <div class="iconstage">
                  <CIcon :content="$options.coreics[stages[stageid].collapse==true?'cilCaretBottom':'cilCaretLeft']" />
                </div>
                <div class="icons rotateDiv">
                  <i class="iconfont icon-success color-success" style="font-size:20px"
                    v-if="stages[stageid].status=='ok'" />
                  <i class="iconfont icon-chacha color-error" style="font-size:20px"
                    v-else-if="stages[stageid].status=='error'" />
                  <i class="iconfont icon-jinzhide color-cancel" style="font-size:20px"
                    v-else-if="stages[stageid].status=='cancel'" />
                  <i class="iconfont icon-jiazaizhong color-runing" style="font-size:20px" v-else />
                </div>
                <div class="titcont">{{stages[stageid].name}}<small>{{stages[stageid].displayName}}</small></div>
              </div>
              <CCollapse :show="stages[stageid].collapse" :duration="400">
                <ul>
                  <li v-for="stepid in stages[stageid].stepids" :key="'step:'+stepid">
                    <div class="icons rotateDiv">
                      <i class="iconfont icon-success color-success" style="font-size:20px"
                        v-if="steps[stepid].status=='ok'" />
                      <i class="iconfont icon-chacha color-error" style="font-size:20px"
                        v-else-if="steps[stepid].status=='error'" />
                      <i class="iconfont icon-jinzhide color-cancel" style="font-size:20px"
                        v-else-if="steps[stepid].status=='cancel'" />
                      <i class="iconfont icon-jiazaizhong color-runing" style="font-size:20px" v-else />
                    </div>
                    <div class="titcont">{{steps[stepid].name}}<small>{{steps[stepid].displayName}}</small></div>
                  </li>
                </ul>
              </CCollapse>
            </div>
          </div>
          <div class="logdiv">1</div>
        </div>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <strong>构建详情: {{ pipe.name }}</strong>
        <!-- <div class="card-header-actions"></div> -->
      </CCardHeader>
      <CCardBody>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import {
  UtilCatch,
  PipelineVersion,
  RuntimeStages,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
export default {
  coreics: freeSet,
  data () {
    return {
      pv: {},
      pipe: {},
      build: {},
      collapse: false,
      stageids: {},
      stages: {},
      steps: {}
    }
  }, mounted () {
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
      PipelineVersion(id)
        .then((res) => {
          this.pv = res.data.pv;
          this.pipe = res.data.pipe;
          this.build = res.data.build;
          this.getStages();
        })
        .catch((err) =>
          UtilCatch(this, err, _ => {
            this.$router.push("/500");
          })
        );
    }, getStages () {
      RuntimeStages(this.pv.id).then(res => {
        for (let i in res.data.ids) {
          let id = res.data.ids[i];
          res.data.stages[id].collapse = true;
        }
        this.steps = res.data.steps;
        this.stages = res.data.stages;
        this.stageids = res.data.ids;
      }).catch(err => UtilCatch(this, err))
    }, toggleStage (id) {
      this.stages[id].collapse = !this.stages[id].collapse;
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="sass" scoped>
.hd-tit
  line-height: 30px
  display: flex
.icons
  width: 30px
  margin-right: 5px

.contbody
  padding-left: 0
  margin-left: 5px
.container
  display: flex
  padding-left: 0
  margin-left: 0
  .stages
    font-size: 16px
    width: 350px
    // border-right: 1px solid #ccc
    // border-left: 1px solid #ccc
    .tit
      border-top: 2px solid #ccc
      border-bottom: 2px solid #ccc
      font-size: 18px
      font-weight: bold
      line-height: 50px
      text-align: center
    .titcont
      font-size: 16px
      small
        color: #aaa
        margin-left: 10px
    .stage
      padding: 10px
      .iconstage
        margin-right: 5px
        line-height: 35px
      .tits
        display: flex
        line-height: 40px
        cursor: pointer
      ul
        margin: 0
        padding: 0 5px 0 20px
        list-style: none
        li
          display: flex
          line-height: 40px
  .logdiv
    flex: 1
    height: 400px
    background: #272b34
</style>