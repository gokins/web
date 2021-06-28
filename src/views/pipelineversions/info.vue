<template>
  <div>
    <CCard>
      <CCardHeader>
        <div class="hd-tit">
          <div class="icon rotateDiv">
            <span class="iconfont icon-success color-success" style="font-size:30px" />
            <span class="iconfont icon-chacha color-error" style="font-size:30px" />
            <span class="iconfont icon-jiazaizhong color-runing" style="font-size:25px" />
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
              <ul>
                <li class="rotateDiv">
                  <div><span class="iconfont icon-success color-success" style="font-size:30px" /></div>
                  Job1
                </li>
              </ul>
            </div>
          </div>
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
export default {
  data () {
    return {
      pv: {},
      pipe: {}
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
  .icon
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
    width: 320px
    border-right: 1px solid #ccc
    .tit
      border-top: 2px solid #ccc
      border-bottom: 2px solid #ccc
      font-size: 18px
      font-weight: bold
      line-height: 50px
      text-align: center
    .stage
      padding: 10px
      ul
        margin: 0
        padding: 0
        list-style: none
</style>