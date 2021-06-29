<template>
  <div>
    <CCard>
      <CCardHeader>
        <div class="hd-tit">
          <div class="icons rotateDiv">
            <i class="iconfont icon-success color-success" style="font-size:30px" />
            <i class="iconfont icon-chacha color-error" style="font-size:30px" />
            <i class="iconfont icon-jiazaizhong color-runing" style="font-size:25px" />
          </div>
          <CLink :to="'../info/'+pipe.id">{{ pipe.name }}</CLink> &nbsp;:&nbsp; <strong>#{{pv.number}}</strong>
          <!-- <div class="card-header-actions"></div> -->
        </div>
      </CCardHeader>
      <CCardBody class="contbody">
        <div class="container">
          <div class="stages">
            <div class="tit">构建阶段</div>
            <div class="stage">
              <div class="tits" @click="collapse=!collapse">
                <div class="iconstage">
                  <CIcon :content="$options.coreics[collapse==true?'cilCaretBottom':'cilCaretLeft']" />
                </div>
                <div class="icons rotateDiv">
                  <i class="iconfont icon-success color-success" style="font-size:30px" />
                </div>
                <div class="titcont">Stage1<small>第一个任务的防撒旦发射撒旦法</small></div>
              </div>
              <CCollapse :show="collapse" :duration="400">
                <ul>
                  <li>
                    <div class="icons rotateDiv"><i class="iconfont icon-success color-success"
                        style="font-size:30px" />
                    </div>
                    <div class="titcont">Job1<small>第一个任务</small></div>
                  </li>
                  <li>
                    <div class="icons rotateDiv"><i class="iconfont icon-jiazaizhong color-runing"
                        style="font-size:30px" />
                    </div>
                    <div class="titcont">Job2<small>第一个任务</small></div>
                  </li>
                  <li>
                    <div class="icons rotateDiv"><i class="iconfont icon-jiazaizhong color-runing"
                        style="font-size:30px" />
                    </div>
                    <div class="titcont">Job3<small>第一个任务</small></div>
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
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
export default {
  coreics: freeSet,
  data () {
    return {
      pv: {},
      pipe: {},
      collapse: false,
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
        })
        .catch((err) =>
          UtilCatch(this, err, _ => {
            this.$router.push("/500");
          })
        );
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
  margin-right: 10px

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