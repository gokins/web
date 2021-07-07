<template>
  <CTabs variant="tabs">
    <CTab active>
      <template slot="title">
        <CIcon name="cil-calculator" />
        基本信息
      </template>
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
                        <CButton v-for="(tmpsItme,index) in tmps" :key="'tmps:'+index"
                          @click="chooseTmp(tmpsItme.ymlContent)" color="dark" size="sm" variant="outline">
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
                          <CInput label="账号: " placeholder="clone仓库的账号" v-model="formData.username" />
                          <label class="tips">tips: 如果是公开或者仓库目录模式下,不用填写</label>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CInput label="Access Token: " placeholder="clone仓库的用户Access Token"
                            v-model="formData.accessToken" />
                          <label class="tips">tips: 如果是公开或者仓库目录模式下,不用填写</label>
                        </CCol>
                      </CRow>
                    </CTab>
                    <CTab>
                      <template slot="title">
                        插件
                      </template>
                      <CRow @click="showPlugin(itme)" v-for="(itme,i) in pluginInfos" :key="i">
                        <CCol>
                          <CWidgetIcon :header="itme.name +'插件'" :text="itme.name" color="gradient-warning">
                            <CIcon name="cil-moon" width="24" />
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
        <pluginView :shown.sync="pluginShow" :pluginyml.sync="pluginyml" />
      </div>
    </CTab>
    <CTab>
      <template slot="title">
        <CIcon name="cil-calculator" />
        变量设置
      </template>
      <div class="pmainbox">
        <div class="pipebox">
          <CRow>
            <CCol>
              <CCard>
                <CCardHeader>
                  变量
                  <div class="card-header-actions">
                    <CButton size="sm" color="info" variant="outline" @click="openVars()">
                      添加变量
                    </CButton>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CDataTable :items="varItems" :fields="varFields" pagination>
                    <template #public="{item}">
                      <td>
                        <CIcon v-if="item.public" style="color:#52c41a" name="cil-check-circle" />
                        <CIcon v-else style="color:#ff0042" name="cil-x-circle" />
                      </td>
                    </template>
                    <template #del="{item}">
                      <td>
                        <CButton color="info" variant="outline" square size="sm" class="pipeBtn" @click="editVar(item)">
                          编辑
                        </CButton>
                        <CButton color="warning" variant="outline" square size="sm" class="pipeBtn"
                          style="margin-left: 5px" @click="delVar(item)">
                          移除
                        </CButton>
                      </td>
                    </template>
                  </CDataTable>
                  <CPagination :activePage.sync="varPage" :pages="varPages" size="sm" align="center"
                    @update:activePage="pipelineVars" />
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
      </div>
    </CTab>
    <CModal title="添加变量" :show="varsShow" @update:show="closeVars" :centered="true">
      <template #footer>
        <CButton color="warning" @click="closeVars">关闭</CButton>
        <CButton color="info" @click="addVars">确定</CButton>
      </template>
      <div>
        <CRow>
          <CCol>
            <CInput label="变量名称: " placeholder="请输入变量名称" v-model="vars.name" />
          </CCol>
          <CCol>
            <CInput label="值: " placeholder="请输入变量的值" v-model="vars.value" />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CInput label="备注: " placeholder="请输入备注" v-model="vars.remarks" />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <div style="display: flex">
              私密
              <CSwitch class="mx-1" color="primary"  shape="pill" :checked.sync="vars.public" />
            </div>
          </CCol>
        </CRow>
      </div>
    </CModal>
  </CTabs>
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
  DeletedPipelineVars,
  NewPipeline,
  PipelineInfo,
  PipelineVars,
  SavePipeline,
  SavePipelineVars,
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
      vars: {
        public: true,
        remarks: "",
        value: "",
        name: "",
      },
      backVar: {},
      varItems: [],
      varPage: 0,
      varPages: 0,
      varFields: [
        {
          key: "name",
          label: "名称",
        },
        {
          key: "value",
          label: "值",
        },
        {
          key: "remarks",
          label: "备注",
        },
        {
          key: "public",
          label: "私密",
        },
        {
          key: "del",
          label: "操作",
          sorter: false,
          filter: false,
        },
      ],
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
      this.pipelineVars()
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
      console.log(this.varItems)
      let formData = this.formData;
      formData.vars = this.varItems
      formData.orgId = this.orgId
      NewPipeline(formData)
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
      if (!this.formData.url || this.formData.url === "") {
        this.$msgErr("请输入仓库地址");
        return false
      }
      const reg1 = new RegExp("^(https?:)\\/\\/([\\w\\.]+)(:\\d+)?");
      const reg2 = new RegExp("^(/|(\\w\\:))");
      if (!reg1.test(this.formData.url) && !reg2.test(this.formData.url)) {
        this.$msgErr("仓库地址格式错误");
        return false
      }
      if (!this.formData.content || this.formData.content === "") {
        this.$msgErr("请输入yaml");
        return false
      }
      return true
    },
    closeVars () {
      this.vars = {
        public: true,
        remarks: "",
        value: "",
        name: "",
      }
      this.varsShow = false
    },
    openVars () {
      this.vars = {
        public: true,
        remarks: "",
        value: "",
        name: "",
      }
      this.varsShow = true
    },
    addVars () {
      if (!this.vars.name || this.vars.name == "") {
        this.$msgErr("请输入变量名")
        return;
      }
      if (!this.vars.value || this.vars.value == "") {
        this.$msgErr("请输入值")
        return;
      }
      if (this.editf) {
        this.savePipelineVars()
        this.pipelineVars()
        return
      }
      this.addLocalVar()
    },
    editVar (item) {
      if (item != undefined && item != null) {
        this.vars = {
          aid: item.aid,
          public: item.public,
          remarks: item.remarks,
          value: item.value,
          name: item.name,
        }
        this.backVar = item
      }
      this.varsShow = true
    },
    addLocalVar () {
      let ls = [];
      for (const v in this.varItems) {
        if (this.varItems[v].name === this.backVar.name) {
          continue
        }
        if (this.varItems[v].name === this.vars.name) {
          this.$msgErr("变量名已存在")
          return
        }
        ls.push(this.varItems[v])
      }
      let v = this.vars
      ls.push(v)
      this.varItems = ls
      this.closeVars()
    },
    delVar (item) {
      if (this.editf) {
        this.deletedPipelineVars(item.aid)
        return
      }
      this.delLocalVar(item.name)
    },
    delLocalVar (name) {
      let ls = [];
      for (const v in this.varItems) {
        if (this.varItems[v].name === name) {
          continue
        }
        ls.push(this.varItems[v])
      }
      this.varItems = ls
    },
    pipelineVars () {
      PipelineVars({ pipelineId: this.pipeId, page: this.varPage })
        .then((res) => {
          this.varItems = []
          let ls = []
          for (const resKey in res.data.data) {
            let v = res.data.data[resKey]
            v.public = v.public == 1
            ls.push(v)
          }
          this.varPage = res.data.page
          this.varPages = res.data.pages
          this.varItems = res.data.data
        })
        .catch((err) => {
          UtilCatch(this, err)
        });
    },
    savePipelineVars () {
      let v = this.vars
      v.pipelineId = this.pipeId
      SavePipelineVars(v)
        .then((res) => {
          this.closeVars()
          this.pipelineVars()
        })
        .catch((err) => {
          this.pipelineVars()
          UtilCatch(this, err)
        });
    },
    deletedPipelineVars (aid) {
      this.$confirm("确定删除变量?", null, () => {
        DeletedPipelineVars({ aid: aid })
          .then((res) => {
            this.$msgOk("删除成功")
            this.closeVars()
            this.pipelineVars()
          })
          .catch((err) => {
            this.pipelineVars()
            UtilCatch(this, err)
          });
      })
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
.card
  border: 0px

.tmpBut
  width: 50px
  font-size: 5px

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