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
          <div>
            <CLink :to="'../info/'+pipe.id">{{ pipe.name }}</CLink>
            &nbsp;:&nbsp; <strong>#{{pv.number}}</strong>
          </div>
          <div class="sha">
            <i class="iconfont icon-branches" style="font-size:14px" />
            {{pv.sha||'默认分支'}}
          </div>
          <div style="flex:1"></div>
          <div>
            &nbsp;
            <CButton size="sm" color="warning" variant="outline" @click="cancelFun"
              v-if="perm.exec==true&&!this.builded">
              停止构建
            </CButton>
            &nbsp;
            <CButton size="sm" color="info" variant="outline" @click="rebuildFun" v-if="perm.exec==true">
              重新构建
            </CButton>
            &nbsp;
            <CButton size="sm" color="dark" variant="outline" @click="pluginShow=true">
              查看配置
            </CButton>
          </div>
        </div>
        <div class="hd-infos">
          <div style="flex:1">{{ pipe.displayName }}
            <small>仓库地址: {{ pipe.url }}</small>
            <small style="color:#333">开始时间: {{ $dateFmt(pv.created) }}</small>
            <small style="color:#333">运行: {{ $dateCha(build.started,build.finished) }}</small>
            <small style="color:red" v-if="build.status=='error'&&build.error&&build.error!=''">错误:
              {{ build.error }}</small>
          </div>
          <div></div>
        </div>
      </CCardHeader>
      <!-- <CCardHeader>
        123
      </CCardHeader> -->
      <CCardBody class="contbody">
        <div class="buildcont">
          <div class="stages">
            <div class="tit">流水线阶段</div>
            <div class="stage">
              <div class="kktit">
                <div class="iconstage" style="margin:2px 5px 0 8px">
                  <i class="iconfont icon-git" style="font-size:25px;" />
                </div>
                <div class="titcont">
                  工作目录文件准备
                </div>
                <div class="pgss">
                  <CProgress :value="workpgss" color="info" :striped="true" show-percentage :animated="workpgss<100" />
                </div>
              </div>
            </div>
            <div class="stage" v-for="stageid in this.stageids" :key="'stage:'+stageid">
              <div class="tits clickitem" @click="toggleStage(stageid)">
                <div class="kktit">
                  <div class="iconstage">
                    <CIcon
                      :content="$options.coreics[stages[stageid].collapse==true?'cilCaretBottom':'cilCaretLeft']" />
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
                  <div class="titcont">
                    {{stages[stageid].name}}
                  </div>
                  <div class="times">{{$dateCha(stages[stageid].started,stages[stageid].finished)}}</div>
                </div>
                <div class="infos" style="margin-left:60px">
                  <!-- <div style="flex:1"></div> -->
                  <div>{{stages[stageid].displayName}}</div>
                </div>
                <!-- <div class="errs" style="margin-left:60px">
                  {{stages[stageid].error}}
                </div> -->
              </div>
              <CCollapse :show="stages[stageid].collapse" :duration="400">
                <ul>
                  <li class="clickitem" :class="[stepid==showStepid?'clickitems':'']"
                    v-for="stepid in stages[stageid].stepids" :key="'step:'+stepid" @click="showStep(stepid)">
                    <div class="kktit">
                      <div class="icons rotateDiv">
                        <i class="iconfont icon-success color-success" style="font-size:20px"
                          v-if="steps[stepid].status=='ok'" />
                        <i class="iconfont icon-chacha color-error" style="font-size:20px"
                          v-else-if="steps[stepid].status=='error'" />
                        <i class="iconfont icon-jinzhide color-cancel" style="font-size:20px"
                          v-else-if="steps[stepid].status=='cancel'" />
                        <i class="iconfont icon-jiazaizhong color-runing" style="font-size:20px" v-else />
                      </div>
                      <div class="titcont">
                        {{steps[stepid].name}}
                      </div>
                      <div class="times">{{$dateCha(steps[stepid].started,steps[stepid].finished)}}</div>
                    </div>
                    <div class="infos">
                      <div>{{steps[stepid].displayName}}</div>
                      <div style="flex:1"></div>
                      <div v-if="steps[stepid].waits&&steps[stepid].waits.length>0"
                        v-c-tooltip.hover.click="{content:'等待的步骤',placement:'bottom'}">
                        <i class="iconfont icon-shijian" style="font-size:15px;color:#ad34ea" />
                        {{steps[stepid].waits.join(",")}}
                      </div>
                    </div>
                    <!-- <div class="errs">
                      {{steps[stepid].error}}
                    </div> -->
                  </li>
                </ul>
              </CCollapse>
            </div>
          </div>
          <div class="logdiv">
            <div v-if="showStepid!=''&&stepcmdids[showStepid]">
              <div class="logs">
                <div class="cmdcont" v-for="cmdid in stepcmdids[showStepid]" :key="'cmd:'+cmdid">
                  <div class="cmdline">
                    <div class="rotateDiv">
                      <i class="iconfont icon-success color-success" style="font-size:10px"
                        v-if="stepcmds[cmdid].status=='ok'" />
                      <i class="iconfont icon-chacha color-error" style="font-size:10px"
                        v-else-if="stepcmds[cmdid].status=='error'" />
                      <i class="iconfont icon-jinzhide color-cancel" style="font-size:10px"
                        v-else-if="stepcmds[cmdid].status=='cancel'" />
                      <i class="iconfont icon-jiazaizhong color-runing" style="font-size:8px" v-else />
                    </div>
                    <div style="flex:1">{{stepcmds[cmdid].content}}</div>
                    <div>{{$dateCha(stepcmds[cmdid].started,stepcmds[cmdid].finished)}}</div>
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
              <div class="status">
                <div class="icons rotateDiv">
                  <i class="iconfont icon-success color-success" style="font-size:30px"
                    v-if="steps[showStepid].status=='ok'" />
                  <i class="iconfont icon-chacha color-error" style="font-size:30px"
                    v-else-if="steps[showStepid].status=='error'" />
                  <i class="iconfont icon-jinzhide color-cancel" style="font-size:30px"
                    v-else-if="steps[showStepid].status=='cancel'" />
                  <i class="iconfont icon-jiazaizhong color-runing" style="font-size:30px" v-else />
                </div>
                <div class="suc" v-if="steps[showStepid].status=='ok'">Success</div>
                <div class="err" v-if="steps[showStepid].status=='error'">{{steps[showStepid].error}}</div>
                <div class="cncl" v-if="steps[showStepid].status=='cancel'">Cancel</div>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>
    <pluginView title="流水线YAML" :shown.sync="pluginShow" :pluginyml="pv.content" />
  </div>
</template>
<script>
import {
  UtilCatch,
  PipelineVersion,
  RuntimeStages,
  RuntimeCmds,
  RuntimeBuild,
  RuntimeCancel,
  RuntimeLogs,
  RebuildVersion,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
import pluginView from "@/components/modals/pluginView";
export default {
  coreics: freeSet,
  components: { pluginView },
  data () {
    return {
      pv: {},
      pipe: {},
      perm: {},
      build: {},
      stageids: {},
      stages: {},
      steps: {},
      showStepid: '',
      stepcmdids: {},
      stepcmds: {},
      steplogs: {},
      builded: true,
      isrun: false,

      workpgss: 0,
      pluginShow: false,
    }
  },
  computed: {
    uinfo () {
      return this.$store.state.uinfo || {}
    },
  },
  destroyed () {
    this.isrun = false;
  }, mounted () {
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.isrun = true;
    this.getInfo(this.$route.params.id, true);
  }, methods: {
    getInfo (id, first) {
      PipelineVersion(id).then((res) => {
        this.pv = res.data.pv;
        this.pipe = res.data.pipe;
        this.perm = res.data.perm;
        this.build = res.data.build;
        this.builded = this.$isEndStatus(this.build.status);
        if (this.builded) this.workpgss = 100;
        this.getStages(first);
      }).catch((err) => UtilCatch(this, err));
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
        if (!this.builded) this.upBuild();
      }).catch(err => UtilCatch(this, err))
    }, toggleStage (id) {
      this.stages[id].collapse = !this.stages[id].collapse;
      this.$forceUpdate()
    }, showStep (stepid) {
      this.showStepid = stepid;
      if (!this.stepcmdids[stepid])
        this.getCmds();
      if (this.builded)
        this.getLogs().catch(err => console.log('getLogs err', err));
    }, getCmds (ck) {
      if (!this.showStepid || this.showStepid == '') return;
      if (ck == true && this.stepcmdids[this.showStepid] && this.stepcmdids[this.showStepid].length > 0) return
      RuntimeCmds(this.showStepid).then(res => {
        if (!res.data.stepId || res.data.stepId == '') return;
        let ids = [];
        for (let i in res.data.cmds) {
          let cmd = res.data.cmds[i];
          cmd.logs = [];
          ids.push(cmd.id);
          this.stepcmds[cmd.id] = cmd;
        }
        this.stepcmdids[res.data.stepId] = ids;
        this.$forceUpdate()
      }).catch(err => UtilCatch(this, err));
    }, getLogs () {
      return new Promise((resolve, reject) => {
        if (!this.showStepid || this.showStepid == '') {
          reject('no');
          return;
        }
        let off = this.steplogs[this.showStepid]?.offset;
        RuntimeLogs(this.build.id, this.showStepid, off).then(res => {
          if (!res.data.stepId || res.data.stepId == '') {
            reject('no');
            return;
          }
          let logs = this.steplogs[res.data.stepId]?.logs;
          if (!logs) { //TODO:不处理重置log || (res.data.lastoff <= 0)) {
            logs = {}
            this.steplogs[res.data.stepId] = {};
            this.steplogs[res.data.stepId].logs = logs
          }
          if (res.data.lastoff > 0)
            this.steplogs[res.data.stepId].offset = res.data.lastoff;
          for (let i in res.data.logs) {
            let log = res.data.logs[i];
            let loge = logs[log.id];
            if (loge) {
              loge.push(log)
            } else {
              loge = [];
              loge.push(log)
              logs[log.id] = loge
            }
          }
          this.$forceUpdate()
          resolve(res.data);
        }).catch(err => {
          reject(err);
        });
      })
    }, upBuild () {
      let okLogs = false;
      this.getCmds(true);
      let startm = new Date().getTime();
      this.getLogs().then(() => {
        okLogs = true;
      }).catch(() => {
        okLogs = true;
      });
      const reExecFn = () => {
        let endtm = new Date().getTime();
        while (!okLogs && endtm - startm < 3);
        console.log('getLogs contine?')
        if (this.isrun && !this.builded)
          this.upBuild();
      }
      RuntimeBuild(this.build.id).then(res => {
        let show = res.data.show;
        this.workpgss = res.data.workpgss;
        this.build.status = show.status;
        this.build.error = show.error;
        this.build.event = show.event;
        this.build.started = show.started;
        this.build.finished = show.finished;
        this.build.updated = show.updated;
        // this.builded = this.$isEndStatus(this.build.status);
        if (show.stages)
          for (let i in show.stages) {
            let stg = show.stages[i];
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
        /* if (this.builded) {
          setTimeout(() => {
            this.getInfo(this.pv.id);
            this.getCmds();
            this.getLogs().catch(err => console.log('getLogs err', err));
          }, 500);
          return;
        } */
        setTimeout(reExecFn, 1000);
      }).catch(err => {
        const stat = err.response ? err.response.status : 0;
        if (stat == 404) {
          let endtm = new Date().getTime();
          while (!okLogs && endtm - startm < 3);
          this.getInfo(this.pv.id);
          this.getCmds();
          // this.getLogs().catch(err => console.log('getLogs err', err));
          return;
        }
        setTimeout(reExecFn, 1000);
      });
    }, cancelFun () {
      this.$confirm("确定停止构建?", null, () => {
        RuntimeCancel(this.build.id).then(() => {
          this.$msgOk('操作成功');
        }).catch((err) => UtilCatch(this, err));
      })
    }, rebuildFun () {
      this.$confirm("确定重新构建?", null, () => {
        RebuildVersion(this.pv.id).then((res) => {
          this.$router.push("/pipeline/build/" + res.data.id)
        }).catch((err) => UtilCatch(this, err));
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.hd-tit
  line-height: 30px
  display: flex
  .sha
    color: #aaa
    font-size: 10px
    padding: 0 5px
    margin: 5px 0 0 10px
    height: 20px
    line-height: 20px
    border: 1px solid #ddd
    text-align: center
.hd-infos
  color: #acacac
  font-size: 14px
  display: flex
  line-height: 30px
  margin-left: 35px
  small
    margin-left: 10px
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
    .pgss
      width: 80px
      margin: 12px 0 0 0
    .clickitem
      cursor: pointer
      border-radius: 10px
      &:hover
        background: #eee
    .clickitems
      background: #e7f3ff
    .tit
      border-top: 2px solid #ccc
      border-bottom: 2px solid #ccc
      font-size: 18px
      font-weight: bold
      line-height: 50px
      text-align: center
    .kktit
      display: flex
      line-height: 40px
    .infos
      color: #acacac
      font-size: 14px
      display: flex
      line-height: 30px
      margin-left: 35px
    .errs
      color: red
      margin-left: 35px
    .titcont
      flex: 1
      font-size: 16px
    .times
      color: #aaa
      margin-left: 10px
    .stage
      padding: 10px 10px 10px 0
      border-bottom: 1px dashed #acacac
      .iconstage
        margin-right: 5px
        line-height: 35px
      .tits
        padding: 0 10px
      ul
        margin: 0
        padding: 0
        list-style: none
        li
          padding-left: 30px
          padding-right: 10px
  .logdiv
    flex: 1
    position: relative
    min-height: 400px
    background: #272b34
    color: #c4c4c4
    padding: 10px
    overflow: hidden
    .cmdcont
      .cmdline
        color: #40bcff
        padding: 0 5px 5px 20px
        display: flex
        &:hover
          background: #002b34
        .rotateDiv
          width: 20px
      ul
        list-style: none
        margin: 0
        padding: 0
        margin-left: 10px
        border-left: 1px dashed #aaa
        li
          display: flex
          padding: 3px 5px 3px 12px
          &:hover
            background: #002b34
          .num
            width: 40px
            height: 100%
          .cont
            flex: 1
            white-space: break-word
            overflow: hidden
    .logs
      margin-bottom: 70px
    .status
      display: flex
      line-height: 45px
      padding: 5px 10px
      background: #4c505a
      border-radius: 15px 15px 0 0
      font-size: 16px
      position: absolute
      left: 0
      right: 0
      bottom: 0
      .icons
        margin: 3px 10px 0 15px
</style>