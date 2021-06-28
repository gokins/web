<template>
  <div class="mainbox">
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
                    <CInput
                      label="流水线名称: "
                      placeholder="请输入流水线名称"
                      v-model="formData.name"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CInput
                      label="仓库地址: "
                      placeholder="仓库URL地址或者仓库目录(例如:https://xxx.com/test.git 或者 ~/dev/test)"
                      v-model="formData.url"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <div>
                      <label>yaml:</label>
                      <codemirror
                        ref="code"
                        v-model="formData.content"
                        :options="cmOptions"
                        class="json-editor"
                      ></codemirror>
                    </div>
                  </CCol>
                </CRow>
                <hr />
                <CRow class="subRow" sm="16">
                  <CCol sm="8">
                    <CButton color="info" @click="subFun()">保存</CButton>
                    <CButton
                      color="danger"
                      @click="subFun()"
                      style="margin-left: 5px"
                      >取消</CButton
                    >
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
      <div class="tabbox" style="margin-top: 10">
        <CRow>
          <CCol>
            <CCard>
              <CCardBody class="tabh">
                <CTabs
                  variant="pills"
                  :vertical="{ navs: 'col-md-2', content: 'col-md-10' }"
                >
                  <CTab active>
                    <template slot="title">
                      <CIcon name="cil-calculator" />
                    </template>
                    <CRow style="margin-top: 10px">
                      <CCol>
                        <CInput
                          label="账号: "
                          placeholder="clone仓库的账号"
                          v-model="formData.username"
                        />
                        <label class="tips"
                          >tips: 如果是公开或者仓库目录模式下,不用填写</label
                        >
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CInput
                          label="Access Token: "
                          placeholder="clone仓库的用户Access Token"
                          v-model="formData.accessToken"
                        />
                        <label class="tips"
                          >tips: 如果是公开或者仓库目录模式下,不用填写</label
                        >
                      </CCol>
                    </CRow>
                  </CTab>
                  <CTab>
                    <template slot="title">
                      <CIcon name="cil-basket" />
                    </template>
                    123
                  </CTab>
                  <CTab>
                    <template slot="title">
                      <CIcon name="cil-chart-pie" />
                    </template>
                    123
                  </CTab>
                </CTabs>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  </div>
</template>
<script>
import { UtilCatch, NewPipeline } from "@/assets/js/apis";
import CodeMirror from "codemirror";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/yaml-lint";
window.jsyaml = require("js-yaml"); // 引入js-yaml为codemirror提高语法检查核心支持
export default {
  name: "YamlEditor",
  data() {
    return {
      formData: {
        name: "",
        content: "",
        url: "",
        username: "",
        accessToken: "",
      },
      cmOptions: {
        lineNumbers: true,
        mode: "text/x-yaml",
        gutters: ["CodeMirror-lint-markers"],
        theme: "rubyblue",
        lint: true,
      },
    };
  },
  mounted() {
    if (this.$refs?.code?.cminstance) {
      this.$refs?.code?.cminstance.setSize("auto", "400px");
    }
  },
  methods: {},
};
</script>
</script>
<style lang="sass" scoped>
.pmainbox
  display: flex

.mainbox
.pipebox
  width: 100%
  height: 1000px
.tabbox
  width: 600px
  margin-left: 10px
  height: 1000px
.subRow
  margin-top: 10px
.row
  margin-top: 10px
.tips
  font-size: 5px
hr
  margin-top: 50px
.json-editor
  height: 400px
.tabh
 height: 807px

</style>