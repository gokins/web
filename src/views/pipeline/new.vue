<template>
  <div class="pmainbox">
    <div class="pipebox">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>流水线</strong>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CInput label="流水线名称: " placeholder="请输入流水线名称" v-model="formData.name"/>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CInput label="流水线描述: " placeholder="请输入流水线描述"
                          v-model="formData.displayName"/>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CInput label="仓库地址: " placeholder="仓库URL地址或者仓库目录(例如:https://xxx.com/test.git 或者 ~/dev/test)"
                          v-model="formData.url"/>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <label>yaml:</label>
                  <codemirror ref="myCm" v-model="formData.content" :options="cmOptions" class="json-editor">
                  </codemirror>
                </CCol>
              </CRow>
              <hr/>
              <CRow class="subRow" sm="16">
                <CCol sm="8">
                  <CButton color="info" @click="subFun()" :disabled="saveBtu">保存</CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
    <div class="tabbox">
      <CRow>
        <CCol>
          <CCard>
            <CCardBody class="tabh">
              <CTabs variant="tabs">
                <CTab active>
                  <template slot="title">
                    安全
                  </template>
                  <CRow style="margin-top: 10px">
                    <CCol>
                      <CInput label="账号: " placeholder="clone仓库的账号" v-model="formData.username"/>
                      <label class="tips">tips: 如果是公开或者仓库目录模式下,不用填写</label>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInput label="Access Token: " placeholder="clone仓库的用户Access Token"
                              v-model="formData.accessToken"/>
                      <label class="tips">tips: 如果是公开或者仓库目录模式下,不用填写</label>
                    </CCol>
                  </CRow>
                </CTab>
                <CTab>
                  <template slot="title">
                    插件
                  </template>
                  <CRow @click="showPlugin(itme)" v-for="(itme, index) in pluginInfos">
                    <CCol>
                      <CWidgetIcon :header="itme.name" :text="itme.content" color="gradient-warning">
                        <CIcon name="cil-moon" width="24"/>
                      </CWidgetIcon>
                    </CCol>
                  </CRow>
                </CTab>
                <CTab>
                  <template slot="title">
                    触发器
                  </template>
                </CTab>
              </CTabs>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
    <pluginView :shown.sync="pluginShow" :pluginyml.sync="pluginyml"/>
  </div>
</template>
<script>
import {codemirror} from 'vue-codemirror'
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/yaml-lint";
import "codemirror/addon/display/autorefresh"

import pluginView from "@/components/modals/pluginView";
import {NewPipeline, PipelineInfo, SavePipeline, UtilCatch} from "@/assets/js/apis";

window.jsyaml = require("js-yaml"); // 引入js-yaml为codemirror提高语法检查核心支持
export default {
  name: "PipeNew",
  components: {pluginView, codemirror},
  props: {
    editf: false,
    pipeId: String
  },
  data() {
    return {
      formData: {
        name: "",
        url: "",
        username: "",
        accessToken: "",
        content: "",
        displayName: "",
      },
      pluginInfos: [
        {
          name: "git", "content": "git 插件", ymlcontent: "" +
              "Clone1:\n" +
              "" +
              "    git: github\n" +
              "" +
              "    repo: https://github.com/koderover/sample\n" +
              "" +
              "    revision: master\n" +
              "" +
              "    title: git clone\n" +
              "" +
              "    type: git-clone\n" +
              "" +
              "    working_directory: ${{KR_VOLUME_PATH}}\n" +
              "" +
              ""
        },
        {
          name: "git2", "content": "git2 插件", ymlcontent: "" +
              "Clone2:\n" +
              "" +
              "    git: github\n" +
              "" +
              "    repo: https://github.com/koderover/sample\n" +
              "" +
              "    revision: master\n" +
              "" +
              "    title: git clone\n" +
              "" +
              "    type: git-clone\n" +
              "" +
              "    working_directory: ${{KR_VOLUME_PATH}}\n" +
              "" +
              ""
        }
      ],
      pluginShow: false,
      pluginyml: "",
      saveBtu: false,
      cmOptions: {
        lineNumbers: true,
        mode: "text/x-yaml",
        gutters: ["CodeMirror-lint-markers"],
        theme: "eclipse",
        autoRefresh: true
      },
    };
  },
  mounted() {
    if (this.pipeId && this.pipeId != "") {
      this.pipeInfo(this.pipeId)
    }
  },
  methods: {
    showPlugin(e) {
      this.pluginShow = true
      this.pluginyml = e.ymlcontent
    },
    subFun() {
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
    pipeInfo(id) {
      PipelineInfo({id: id}).then((res) => {
        this.formData.name = res.data.name
        this.formData.url = res.data.url
        this.formData.username = res.data.username
        this.formData.accessToken = res.data.accessToken
        this.formData.content = res.data.ymlContent
        this.formData.displayName = res.data.displayName
      }).catch((err) => UtilCatch(this, err));
    },
    newPie() {
      NewPipeline(this.formData)
          .then((res) => {
            this.saveBtu = false
            this.$msgOk("保存成功");
            setTimeout(() => {
              this.$router.push("/pipeline/info/" + res.data.id)
            }, 500);
          })
          .catch((err) => {
            this.saveBtu = false
            UtilCatch(this, err)
          });
    },
    savePie() {
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
    checkForm() {
      if (!this.formData.name || this.formData.name === "") {
        this.$msgErr("请输入流水线名称");
        return false
      }
      if (!this.formData.url || this.formData.url === "") {
        this.$msgErr("请输入仓库地址");
        return false
      }
      if (!this.formData.content || this.formData.content === "") {
        this.$msgErr("请输入yaml");
        return false
      }
      return true
    }
  },
};
</script>
<style lang="sass" scoped>
.pmainbox
  display: flex

  .pipebox
    flex: 1
    overflow-x: hidden

  .tabbox
    width: 300px
    margin-left: 10px
    overflow-x: hidden

.subRow
  margin-top: 10px

.tips
  font-size: 5px



.json-editor
  border: #768192 1px solid

.card
  margin-bottom: 0px
</style>
<style lang="sass">
.CodeMirror
  width: auto
  height: auto

.CodeMirror-scroll
  min-height: 300px
</style>