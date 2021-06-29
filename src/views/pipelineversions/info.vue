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
                  <div style="float:right">{{$dateCha(stepcmds[cmdid].started,stepcmds[cmdid].finished)}}</div>
                  {{stepcmds[cmdid].content}}
                </div>
                <ul v-if="steplogs[showStepid]&&steplogs[showStepid].logs">
                  <li v-for="(log,$i) in steplogs[showStepid].logs[cmdid]" :key="'log:'+log.id+'-'+$i">
                    <div class="num">{{$i+1}}</div>
                    <div class="cont">
                      <div style="float:right">{{$dateFmt(log.times)}}</div>
                      <div style="color:#ff0042" v-if="log.errs==true">{{log.content}}</div>
                      <div v-else>{{log.content}}</div>
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
  RuntimeBuild,
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
      steplogs: {},
      builded: false,
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
    this.getInfo(this.$route.params.id, true);
  }, methods: {
    getInfo (id, first) {
      PipelineVersion(id)
        .then((res) => {
          this.pv = res.data.pv;
          this.pipe = res.data.pipe;
          this.build = res.data.build;
          this.builded = this.$isEndStatus(this.build.status);
          if (!this.builded) this.upBuild();
          this.getStages(first);
        })
        .catch((err) =>
          UtilCatch(this, err, _ => {
            this.$router.push("/500");
          })
        );
    }, getStages (first) {
      RuntimeStages(this.pv.id).then(res => {
        for (let i in res.data.ids) {
          let id = res.data.ids[i];
          res.data.stages[id].collapse = true;
        }
        this.steps = res.data.steps;
        this.stages = res.data.stages;
        this.stageids = res.data.ids;
        if (first && this.stageids && this.stageids.length > 0) {
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
      this.getLogs(stepid);
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
      }).catch(err => UtilCatch(this, err));
    }, getLogs (stepid) {
      let off = this.steplogs[stepid]?.offset;
      RuntimeLogs(stepid, off).then(res => {
        let logs = this.steplogs[stepid]?.logs;
        if (!logs || (off && off <= 0)) {
          logs = {}
          this.steplogs[stepid] = {};
          this.steplogs[stepid].logs = logs
        }
        for (let i in res.data) {
          let log = res.data[i];
          let loge = logs[log.id];
          if (loge)
            loge.push(log)
          else {
            loge = [];
            loge.push(log)
            logs[log.id] = loge
          }
          this.steplogs[stepid].offset = log.offset;
        }
        this.$forceUpdate()
      }).catch(err => {

      });
    }, upBuild () {
      const reExecFn = () => {
        if (!this.builded) this.upBuild();
      }
      RuntimeBuild(this.build.id).then(res => {
        setTimeout(reExecFn, 1000);
        this.build.status = res.data.status;
        this.build.error = res.data.error;
        this.build.event = res.data.event;
        this.build.started = res.data.started;
        this.build.finished = res.data.finished;
        this.build.updated = res.data.updated;
        this.builded = this.$isEndStatus(this.build.status);
        if (res.data.stages)
          for (let i in res.data.stages) {
            let stg = res.data.stages[i];
            let stge = this.stages[stg.id];
            if (stge) {
              stge.status = stg.status;
              stge.event = stg.event;
              stge.error = stg.error;
              stge.started = stg.started;
              stge.finished = stg.finished;
              stge.updated = stg.updated;
              if (stg.steps)
                for (let j in stg.steps) {
                  let stp = stg.steps[j];
                  let stpe = this.steps[stp.id];
                  if (stpe) {
                    stpe.status = stp.status;
                    stpe.event = stp.event;
                    stpe.error = stp.error;
                    stpe.started = stp.started;
                    stpe.finished = stp.finished;
                    stpe.updated = stp.updated;
                    if (stp.cmds)
                      for (let k in stp.cmds) {
                        let cmd = stp.cmds[k];
                        let cmde = this.stepcmds[cmd.id];
                        if (cmde) {
                          cmde.status = cmd.status;
                          cmde.started = cmd.started;
                          cmde.finished = cmd.finished;
                        }
                      }
                  }
                }
            }
          }
        this.$forceUpdate()
      }).catch(err => {
        const stat = err.response ? err.response.status : 0;
        if (stat == 404) {
          this.getInfo(this.pv.id);
        }
        setTimeout(reExecFn, 1000);
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