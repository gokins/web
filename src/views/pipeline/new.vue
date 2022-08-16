<template>
  <div class="pmainbox">
    <div class="pipebox">
      <CCard>
        <CCardHeader>
          <strong>流水线</strong>
        </CCardHeader>
        <CCardBody style="display:flex">
          <div style="flex:1">
            <CRow>
              <CCol>
                <CInput label="流水线名称: " placeholder="请输入流水线名称" v-model="formData.name" />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CInput label="流水线描述: " placeholder="请输入流水线描述" v-model="formData.displayName" />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CInput label="仓库地址: " placeholder="Git仓库地址" v-model="formData.url" /><!-- 或者仓库目录 -->
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <template slot="title">
                  yaml
                </template>
                <div class="ymldiv">
                  流水线配置:
                  <!-- <CButton @click="defaultTmp" color="dark" size="sm" variant="outline">
                          还原
                        </CButton> -->
                  <CButton v-for="(tmpsItme, index) in tmps" :key="'tmps:' + index" @click="chooseTmp(tmpsItme.ymlContent)"
                    color="dark" size="sm" variant="outline">
                    {{ tmpsItme.name }}
                  </CButton>
                </div>
                <codemirror ref="myCm" v-model="formData.content" :options="cmOptions" class="json-editor">
                </codemirror>
              </CCol>
            </CRow>
            <CRow class="subRow" sm="16">
              <CCol sm="8">
                <CButton color="info" @click="subFun()" :disabled="saveBtu">保存</CButton>
              </CCol>
            </CRow>
          </div>
          <CTabs variant="tabs" class="tabbox">
            <CTab active>
              <template slot="title">
                安全
              </template>
              <CRow style="margin-top: 10px">
                <CCol>
                  <CInput label="账号: " placeholder="clone仓库的账号" v-model="formData.username" />
                  <label class="tips">tips: 如果是公开或者仓库目录模式下,不用填写</label>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CInput label="Access Token: " placeholder="clone仓库的用户Access Token" v-model="formData.accessToken" />
                  <label class="tips">tips: 如果是公开或者仓库目录模式下,不用填写</label>
                </CCol>
              </CRow>
            </CTab>
            <CTab>
              <template slot="title">
                插件
              </template>
              <div style="margin-top:10px">
                <CRow @click="showPlugin(itme)" v-for="(itme, i) in pluginInfos" :key="i">
                  <CCol>
                    <CWidgetIcon :header="itme.name + '插件'" :text="itme.name" color="gradient-warning">
                      <CIcon name="cil-moon" width="24" />
                    </CWidgetIcon>
                  </CCol>
                </CRow>
              </div>
            </CTab>
            <!-- <CTab>
                      <template slot="title">
                        触发器
                      </template>
                    </CTab> -->
          </CTabs>
        </CCardBody>
      </CCard>
    </div>
    <pluginView :shown.sync="pluginShow" :pluginyml.sync="pluginyml" />
  </div>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/yaml-lint";
import "codemirror/addon/display/autorefresh";
import jsyaml from 'js-yaml'
import pluginView from "@/components/modals/pluginView";
import {
  NewPipeline,
  PipelineInfo,
  SavePipeline,
  UtilCatch,
  YmlPlugins,
  YmlTemplates,
} from "@/assets/js/apis";

window.jsyaml = jsyaml; // 引入js-yaml为codemirror提高语法检查核心支持
export default {
  name: "PipeNew",
  components: { pluginView, codemirror },
  props: {
    editf: Boolean,
    pipeId: String,
  },
  data () {
    return {
      formData: {
        name: "",
        url: "",
        username: "",
        accessToken: "",
        content: "",
        displayName: "",
      },
      orgId: "",
      pluginInfos: [],
      tmps: [],
      pluginShow: false,
      pluginyml: "",
      varsShow: false,
      saveBtu: false,
      cmOptions: {
        lineNumbers: true,
        mode: "text/x-yaml",
        gutters: ["CodeMirror-lint-markers"],
        theme: "eclipse",
        autoRefresh: true,
        lint: true
      },
      rOptions: {
        lineNumbers: true,
        mode: "text/x-yaml",
        gutters: ["CodeMirror-lint-markers"],
        theme: "eclipse",
        autoRefresh: true,
        lint: true,
        readOnly: true,
      },
    };
  },
  mounted () {
    if (this.pipeId && this.pipeId != "") {
      this.pipeInfo()
    }
    if (
      this.$route.params != null &&
      this.$route.params.orgId != null &&
      this.$route.params.orgId != ""
    ) {
      this.orgId = this.$route.params.orgId
    }
    this.getYmlTemplates()
    this.getYmlPlugins()
  },
  methods: {
    showPlugin (e) {
      this.pluginShow = true
      this.pluginyml = e.ymlContent
    },
    subFun () {
      this.saveBtu = true
      if (!this.checkForm()) {
        this.saveBtu = false
        return;
      }
      if (this.editf) {
        this.savePie()
        return
      }
      this.newPie()
    },
    pipeInfo () {
      PipelineInfo({ id: this.pipeId }).then((res) => {
        this.formData.name = res.data.pipe.name
        this.formData.url = res.data.pipe.url
        this.formData.username = res.data.pipe.username
        this.formData.accessToken = res.data.pipe.accessToken
        this.formData.content = res.data.pipe.ymlContent
        this.formData.displayName = res.data.pipe.displayName
      }).catch((err) => UtilCatch(this, err));
    },
    newPie () {
      let formData = this.formData;
      formData.orgId = this.orgId
      NewPipeline(formData)
        .then((res) => {
          this.saveBtu = false
          this.$msgOk("保存成功");
          setTimeout(() => {
            this.$router.push(`/pipeline/info/${res.data.id}?org=${this.orgId}`);
          }, 500);
        })
        .catch((err) => {
          this.saveBtu = false
          UtilCatch(this, err)
        });
    },
    savePie () {
      console.log(this.varItems)
      let formData = this.formData;
      formData.pipelineId = this.pipeId
      SavePipeline(formData)
        .then((res) => {
          this.saveBtu = false
          this.$msgOk("保存成功");
          this.pipeInfo(this.pipeId)
        })
        .catch((err) => {
          this.saveBtu = false
          UtilCatch(this, err)
        });
    },
    checkForm () {
      if (!this.formData.name || this.formData.name === "") {
        this.$msgErr("请输入流水线名称");
        return false
      }
      /* if (!this.formData.url || this.formData.url === "") {
        this.$msgErr("请输入仓库地址");
        return false
      } */
      if (this.formData.url && this.formData.url !== "") {
        const reg1 = new RegExp("^(https?:)\\/\\/([\\w\\.]+)(:\\d+)?");
        const reg2 = new RegExp("^(/|(\\w\\:))");
        if (!reg1.test(this.formData.url) && !reg2.test(this.formData.url)) {
          this.$msgErr("仓库地址格式错误");
          return false
        }
      }
      if (!this.formData.content || this.formData.content === "") {
        this.$msgErr("请输入yaml");
        return false
      }
      return true
    },
    getYmlTemplates () {
      YmlTemplates()
        .then((res) => {
          this.tmps = res.data
        })
        .catch((err) => {
          UtilCatch(this, err)
        });
    },
    getYmlPlugins () {
      YmlPlugins()
        .then((res) => {
          this.pluginInfos = res.data
        })
        .catch((err) => {
          UtilCatch(this, err)
        });
    },
    chooseTmp (ymlContent) {
      this.formData.content = ymlContent
    },
    defaultTmp () {
      if (this.pipeId && this.pipeId != "") {
        this.pipeInfo()
        return
      }
      this.formData.content = ""
    }
  },
};
</script>
<style lang="sass" scoped>
.tmpBut
  width: 50px
  font-size: 5px

.pmainbox
  display: flex

  .pipebox
    flex: 1
    overflow-x: hidden

  .tabbox
    width: 310px
    margin-left: 20px
    padding-left: 20px
    overflow-x: hidden
    border-left: 1px solid #ccc

.subRow
  margin-top: 10px

.tips
  font-size: 5px

.json-editor
  border: #768192 1px solid

.ymldiv
  margin-bottom: 10px

  button
    height: 20px
    line-height: 0
    margin: -5px 0 0 10px
</style>
<style lang="sass">
.CodeMirror
  width: auto
  height: auto

.CodeMirror-scroll
  min-height: 300px
</style>