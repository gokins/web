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
          <div style="flex:1">
            <CLink :to="'../info/'+pipe.id">{{ pipe.name }}</CLink> &nbsp;:&nbsp; <strong>#{{pv.number}}</strong>
          </div>
          <div>
            <CButton size="sm" color="info" variant="outline" @click="selPip = true">
              重新构建
            </CButton>
            &nbsp;
            <CButton size="sm" color="warning" variant="outline" @click="$router.push('/pipeline/new/' + info.aid)">
              删除构建
            </CButton>
          </div>
        </div>
      </CCardHeader>
      <CCardBody class="contbody">
        <div class="buildcont">
          <div class="stages">
            <div class="tit">构建阶段</div>
            <div class="stage" v-for="stageid in this.stageids" :key="'stage:'+stageid">
              <div class="tits clickitem" @click="toggleStage(stageid)">
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
                  <li class="clickitem" v-for="stepid in stages[stageid].stepids" :key="'step:'+stepid"
                    @click="showStep(stepid)">
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
          <div class="logdiv">
            <div v-if="showStepid!=''&&stepcmdids[showStepid]">
              <div class="cmdcont" v-for="cmdid in stepcmdids[showStepid]" :key="'cmd:'+cmdid">
                <div class="cmdline">
                  {{stepcmds[cmdid].content}}
                </div>
                <ul>
                  <li v-for="(log,$i) in stepcmds[cmdid].logs" :key="'log:'+log.id+'-'+$i">
                    <div class="num">{{$i+1}}</div>
                    <div class="cont">
                      <div style="float:right">{{$dateFmt(log.times)}}</div>
                      {{log.content}}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import {
  UtilCatch,
  PipelineVersion,
  RuntimeStages,
  RuntimeCmds,
  RuntimeLogs,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
export default {
  coreics: freeSet,
  data () {
    return {
      pv: {},
      pipe: {},
      build: {},
      stageids: {},
      stages: {},
      steps: {},
      showStepid: '',
      stepcmdids: {},
      stepcmds: {},
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
        if (this.stageids && this.stageids.length > 0) {
          let stage = this.stages[this.stageids[0]];
          if (stage && stage.stepids && stage.stepids.length > 0)
            this.showStep(this.steps[stage.stepids[0]].id)
        }
      }).catch(err => UtilCatch(this, err))
    }, toggleStage (id) {
      this.stages[id].collapse = !this.stages[id].collapse;
      this.$forceUpdate()
    }, showStep (stepid) {
      this.showStepid = stepid;
      if (!this.stepcmdids[stepid])
        this.getCmds(stepid);
    }, getCmds (stepid) {
      RuntimeCmds(stepid).then(res => {
        let ids = [];
        for (let i in res.data) {
          let cmd = res.data[i];
          cmd.logs = [];
          ids.push(cmd.id);
          this.stepcmds[cmd.id] = cmd;
        }
        this.stepcmdids[stepid] = ids;
        this.$forceUpdate()
        this.getLogs(stepid);
      }).catch(err => UtilCatch(this, err));
    }, getLogs (stepid) {
      RuntimeLogs(stepid).then(res => {
        for (let i in res.data) {
          let log = res.data[i];
          if (this.stepcmds[log.id])
            this.stepcmds[log.id].logs.push(log);
        }
        this.$forceUpdate()
      }).catch(err => {

      });
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
  margin-left: 8px
  padding-right: 0
  margin-right: 8px
.buildcont
  display: flex
  padding: 0
  margin: 0
  .stages
    font-size: 16px
    width: 350px
    // border-right: 1px solid #ccc
    // border-left: 1px solid #ccc
    .clickitem
      cursor: pointer
      border-radius: 10px
      &:hover
        background: #eee
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
      padding: 10px 10px 0 0
      .iconstage
        margin-right: 5px
        line-height: 35px
      .tits
        display: flex
        line-height: 40px
        padding: 0 10px
      ul
        margin: 0
        padding: 0
        list-style: none
        li
          padding-left: 30px
          display: flex
          line-height: 40px
  .logdiv
    flex: 1
    min-height: 400px
    background: #272b34
    color: #c4c4c4
    padding: 10px
    overflow: hidden
    .cmdcont
      .cmdline
        color: #40bcff
        padding: 3px 5px
        &:hover
          background: #002b34
      ul
        list-style: none
        margin: 0
        padding: 0
        margin-left: 10px
        border-left: 1px dashed #aaa
        li
          display: flex
          padding: 3px 5px 3px 10px
          &:hover
            background: #002b34
          .num
            width: 50px
            height: 100%
          .cont
            flex: 1
            white-space: break-word
            overflow: hidden
</style>