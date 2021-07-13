<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-sitemap" />&nbsp;
        <strong>{{ pipe.name }} </strong>
        <div class="card-header-actions">
          <CButton
            color="dark"
            variant="outline"
            square
            size="sm"
            @click="copy()"
            style="margin-left: 5px"
            v-if="uinfo.permPipe == 1"
          >
            复制
          </CButton>
          <CButton
            color="info"
            variant="outline"
            square
            size="sm"
            @click="run()"
            style="margin-left: 5px"
            v-if="perm.exec == true"
          >
            运行
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTabs
          variant="pills"
          :vertical="{ navs: 'col-md-2', content: 'col-md-10' }"
        >
          <CTab>
            <template slot="title">
              <CIcon name="cil-calculator" />
              构建历史
            </template>
            <VersionlistView
              :items="versionItems"
              :loading="loading"
              :hidepipe="true"
            />
            <CPagination
              :activePage="versionPage"
              :pages="versionPages"
              @update:activePage="getVersionList"
              style="float: right; margin-top: 20px"
            />
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-calculator" />
              流水线详情
            </template>
            <CCard>
              <CCardHeader> 基本信息</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol>
                    <CInput
                      disabled
                      label="流水线名称: "
                      v-model="pInfo.name"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CInput
                      disabled
                      label="流水线描述: "
                      v-model="pInfo.displayName"
                    />
                  </CCol>
                </CRow>
                <CRow style="margin-top: 10px">
                  <CCol>
                    <CInput disabled label="仓库地址: " v-model="pInfo.url" />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader>变量</CCardHeader>
              <CCardBody>
                <CDataTable
                  :items="infoVarItems"
                  :fields="infoVarFields"
                  pagination
                >
                  <template #public="{ item }">
                    <td>
                      <CIcon
                        v-if="item.public"
                        style="color: #52c41a"
                        name="cil-check-circle"
                      />
                      <CIcon
                        v-else
                        style="color: #ff0042"
                        name="cil-x-circle"
                      />
                    </td>
                  </template>
                </CDataTable>
                <CPagination
                  :activePage.sync="infoVarPage"
                  :pages="infoVarPages"
                  size="sm"
                  align="center"
                  @update:activePage="getInfoPipelineVars"
                />
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader> Yaml</CCardHeader>
              <CCardBody>
                <codemirror
                  v-model="pInfo.ymlContent"
                  :options="cOptions"
                ></codemirror>
              </CCardBody>
            </CCard>
          </CTab>
          <CTab v-if="perm.write == true">
            <template slot="title">
              <CIcon name="cil-calculator" />
              变量
            </template>
            <CCard>
              <CCardHeader>
                变量
                <div class="card-header-actions">
                  <CButton
                    size="sm"
                    color="info"
                    variant="outline"
                    @click="openVars()"
                  >
                    添加变量
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <CDataTable :items="varItems" :fields="varFields" pagination>
                  <template #public="{ item }">
                    <td>
                      <CIcon
                        v-if="item.public"
                        style="color: #52c41a"
                        name="cil-check-circle"
                      />
                      <CIcon
                        v-else
                        style="color: #ff0042"
                        name="cil-x-circle"
                      />
                    </td>
                  </template>
                  <template #del="{ item }">
                    <td>
                      <CButton
                        color="info"
                        variant="outline"
                        square
                        size="sm"
                        class="pipeBtn"
                        @click="editVar(item)"
                      >
                        编辑
                      </CButton>
                      <CButton
                        color="warning"
                        variant="outline"
                        square
                        size="sm"
                        class="pipeBtn"
                        style="margin-left: 5px"
                        @click="delVar(item)"
                      >
                        移除
                      </CButton>
                    </td>
                  </template>
                </CDataTable>
                <CPagination
                  :activePage.sync="varPage"
                  :pages="varPages"
                  size="sm"
                  align="center"
                  @update:activePage="getPipelineVars"
                />
              </CCardBody>
            </CCard>
          </CTab>
          <CTab v-if="perm.write == true">
            <template slot="title">
              <CIcon name="cil-calculator" />
              设置
            </template>
            <CCard accent-color="primary">
              <PipeNew :pipeId.sync="this.$route.params.id" :editf="true" />
            </CCard>
            <CCard accent-color="danger">
              <CCardHeader style="background-color: #ffe8e6">
                <strong>危险操作区</strong>
              </CCardHeader>
              <CCardBody style="display: flex">
                <div style="flex: 1">
                  <h5>删除流水线</h5>
                  <p>流水线删除之后无法恢复.请谨慎操作</p>
                </div>
                <div>
                  <CButton
                    color="danger"
                    variant="outline"
                    square
                    @click="deletedPipe"
                  >
                    删除流水线
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CTab>
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator" />
              触发器
            </template>
            <CCard>
              <CCardHeader>
                触发器
                <div class="card-header-actions">
                  <CButton
                    v-if="perm.write == true"
                    size="sm"
                    color="info"
                    variant="outline"
                    @click="openTrigger()"
                  >
                    添加触发器
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <TriggerListView
                  :items="triggerList"
                  :loading="triggerLoading"
                  :host="this.host"
                  #default="{ item }"
                >
                  <CButton
                    v-if="perm.write == true"
                    size="sm"
                    color="info"
                    variant="outline"
                    @click.stop="editrigger(item)"
                    class="tit_btu"
                  >
                    编辑
                  </CButton>
                  <CButton
                    v-if="perm.write == true"
                    size="sm"
                    color="danger"
                    variant="outline"
                    @click.stop="deleteTrigger(item.id)"
                    class="tit_btu"
                  >
                    删除
                  </CButton>
                  <div style="display: flex">
                    创建者:
                    <myavatar :src="item.avat" :nick="item.nick" imgw="15px" />
                  </div>
                </TriggerListView>
                <CPagination
                  :activePage="triggerPage"
                  :pages="triggerPages"
                  @update:activePage="getTriggerList"
                  style="float: right; margin-top: 20px"
                />
              </CCardBody>
            </CCard>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
    <SelectBranches :shown.sync="selectShow" :id="this.$route.params.id" />
    <CModal
      title="添加变量"
      :show="varsShow"
      @update:show="closeVars"
      :centered="true"
    >
      <template #footer>
        <CButton color="warning" @click="closeVars">关闭</CButton>
        <CButton color="info" @click="addVars">确定</CButton>
      </template>
      <div>
        <CRow>
          <CCol>
            <CInput
              label="变量名称: "
              placeholder="请输入变量名称"
              v-model="vars.name"
            />
          </CCol>
          <CCol>
            <CInput
              label="值: "
              placeholder="请输入变量的值"
              v-model="vars.value"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CInput
              label="备注: "
              placeholder="请输入备注"
              v-model="vars.remarks"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <div style="display: flex">
              私密
              <CSwitch
                class="mx-1"
                color="primary"
                shape="pill"
                :checked.sync="vars.public"
              />
            </div>
          </CCol>
        </CRow>
      </div>
    </CModal>
    <EditTrigger
      :shown.sync="this.triggerShow"
      :triggerVar.sync="this.triggerVar"
      :formTriggerData.sync="this.formTriggerData"
      :formTriggerHook.sync="this.formTriggerHook"
      :formTriggerWeb.sync="this.formTriggerWeb"
      @closeTrigger="closeTrigger"
      @saveTrigger="saveTrigger"
    />
  </div>
</template>
<script>
import {
  CopyPipeline,
  DeletePipeline,
  DeletePipelineVars,
  PipelineInfo,
  PipelineVars,
  PipelineVersions,
  SavePipelineVars,
  TriggerList,
  SaveTrigger,
  DeleteTrigger,
  UtilCatch,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
import PipeNew from "./new";
import SelectBranches from "@/components/modals/selectBranches";
import EditTrigger from "@/components/modals/editTrigger";
import VersionlistView from "@/components/list/versionlist";
import TriggerListView from "@/components/list/triggerlist";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/display/autorefresh";
import myavatar from "@/components/avatar";

export default {
  coreics: freeSet,
  components: {
    PipeNew,
    VersionlistView,
    SelectBranches,
    codemirror,
    TriggerListView,
    EditTrigger,
    myavatar,
  },
  data() {
    return {
      loading: true,
      versionPage: 0,
      versionPages: 0,
      versionItems: [],
      pipe: "",
      perm: {},
      formData: {
        name: "",
        content: "",
        pipelineId: "",
      },
      cOptions: {
        lineNumbers: true,
        mode: "text/x-yaml",
        gutters: ["CodeMirror-lint-markers"],
        theme: "eclipse",
        readOnly: true,
        autoRefresh: true,
      },
      pipelineId: "",
      selectShow: false,
      pInfo: {},
      infoVarItems: [],
      infoVarPage: 0,
      infoVarPages: 0,
      infoVarFields: [
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
      ],
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
      varsShow: false,
      vars: {
        public: true,
        remarks: "",
        value: "",
        name: "",
      },
      host: "",
      triggerVar: {},
      triggerList: [],
      triggerLoading: false,
      triggerPage: 0,
      triggerPages: 0,
      triggerShow: false,
      formTriggerData: {},
      formTriggerHook: {},
      formTriggerPipeline: {},
      formTriggerWeb: {},
    };
  },
  computed: {
    uinfo() {
      return this.$store.state.uinfo || {};
    },
  },
  mounted() {
    console.log("$options.coreics", this.$options.coreics["cliXcircle"]);
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.pipelineId = this.$route.params.id;
    this.getVersionList();
    this.pipeInfo();
    this.getPipelineVars();
    this.getInfoPipelineVars();
    this.getTriggerList();
  },
  methods: {
    getVersionList(pg) {
      this.loading = true;
      PipelineVersions({
        page: pg,
        pipelineId: this.pipelineId,
      })
        .then((res) => {
          this.loading = false;
          this.versionPage = res.data.page;
          this.versionPages = res.data.pages;
          this.versionItems = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    pipeInfo() {
      PipelineInfo({ id: this.pipelineId })
        .then((res) => {
          this.pipe = res.data.pipe;
          this.pInfo = res.data.pipe;
          this.perm = res.data.perm;
        })
        .catch((err) => UtilCatch(this, err));
    },
    run() {
      this.selectShow = true;
    },
    goVersion(id) {
      this.$router.push("/pipeline/build/" + id);
    },
    goEdit(id) {
      this.$router.push("/pipeline/info/" + id);
    },
    copy() {
      this.$confirm("确定复制流水线?", null, () => {
        CopyPipeline(this.pipelineId)
          .then((res) => {
            this.$router.push("/pipeline/info/" + res.data.id);
          })
          .catch((err) => UtilCatch(this, err));
      });
    },
    deletedPipe() {
      this.$confirm("确定删除流水线?", null, () => {
        DeletePipeline(this.pipelineId)
          .then((res) => {
            this.$router.back(-1);
          })
          .catch((err) => UtilCatch(this, err));
      });
    },
    getPipelineVars() {
      PipelineVars({ pipelineId: this.pipelineId, page: this.varPage })
        .then((res) => {
          this.varItems = [];
          let ls = [];
          for (const resKey in res.data.data) {
            let v = res.data.data[resKey];
            v.public = v.public == 1;
            ls.push(v);
          }
          this.varPage = res.data.page;
          this.varPages = res.data.pages;
          this.varItems = res.data.data;
        })
        .catch((err) => {
          UtilCatch(this, err);
        });
    },
    getInfoPipelineVars() {
      PipelineVars({ pipelineId: this.pipelineId, page: this.varPage })
        .then((res) => {
          this.infoVarItems = [];
          let ls = [];
          for (const resKey in res.data.data) {
            let v = res.data.data[resKey];
            v.public = v.public == 1;
            ls.push(v);
          }
          this.infoVarPage = res.data.page;
          this.infoVarPages = res.data.pages;
          this.infoVarItems = res.data.data;
        })
        .catch((err) => {
          UtilCatch(this, err);
        });
    },
    openVars() {
      this.vars = {
        public: true,
        remarks: "",
        value: "",
        name: "",
      };
      this.varsShow = true;
    },
    closeVars() {
      this.vars = {
        public: true,
        remarks: "",
        value: "",
        name: "",
      };
      this.varsShow = false;
    },
    addVars() {
      if (!this.vars.name || this.vars.name == "") {
        this.$msgErr("请输入变量名");
        return;
      }
      if (!this.vars.value || this.vars.value == "") {
        this.$msgErr("请输入值");
        return;
      }
      this.savePipelineVars();
      this.getPipelineVars();
      this.getInfoPipelineVars();
    },
    delVar(item) {
      this.deletedPipelineVars(item.aid);
    },
    editVar(item) {
      if (item != undefined && item != null) {
        this.vars = {
          aid: item.aid,
          public: item.public,
          remarks: item.remarks,
          value: item.value,
          name: item.name,
        };
        this.backVar = item;
      }
      this.varsShow = true;
    },
    savePipelineVars() {
      let v = this.vars;
      v.pipelineId = this.pipelineId;
      SavePipelineVars(v)
        .then((res) => {
          this.closeVars();
          this.getPipelineVars();
          this.getInfoPipelineVars();
        })
        .catch((err) => {
          UtilCatch(this, err);
        });
    },
    deletedPipelineVars(aid) {
      this.$confirm("确定删除变量?", null, () => {
        DeletePipelineVars({ aid: aid })
          .then((res) => {
            this.$msgOk("删除成功");
            this.closeVars();
            this.getPipelineVars();
            this.getInfoPipelineVars();
          })
          .catch((err) => {
            UtilCatch(this, err);
          });
      });
    },
    getTriggerList() {
      TriggerList({
        page: this.triggerPage,
        pipelineId: this.pipelineId,
      })
        .then((res) => {
          this.triggerLoading = false;
          if (res.data != null) {
            let r = res.data.page;
            this.host = res.data.host;
            this.triggerPage = r.page;
            this.triggerPages = r.pages;
            this.triggerList = r.data;
          }
        })
        .catch((err) => UtilCatch(this, err));
    },
    openTrigger() {
      this.triggerVar = {};
      this.formTriggerData = {
        dates: new Date(),
      };
      this.formTriggerHook = {};
      // this.formTriggerPipeline = {}
      this.formTriggerWeb = {};
      this.triggerShow = true;
    },
    closeTrigger() {
      this.triggerVar = {};
      this.triggerShow = false;
    },
    editrigger(item) {
      switch (item.types) {
        case "webHook":
          this.formTriggerHook = JSON.parse(item.params);
          break;
        case "timer":
          let p = JSON.parse(item.params);
          p.dates = new Date(p.dates);
          this.formTriggerData = p;
          break;
        case "web":
          this.formTriggerWeb = JSON.parse(item.params);
          break;
      }
      item.enabled = item.enabled == 1;
      this.triggerVar = item;
      this.triggerShow = true;
    },
    chooseToday() {
      this.formTriggerData.dates = new Date();
    },
    deleteTrigger(id) {
      this.$confirm("确定删除触发器?", null, () => {
        DeleteTrigger(id)
          .then((res) => {
            this.$msgOk("删除成功");
            this.getTriggerList();
          })
          .catch((err) => UtilCatch(this, err));
      });
    },
    saveTrigger() {
      if (!this.checkForm()) {
        return;
      }
      this.triggerVar.pipelineId = this.pipelineId;
      let param = "";
      switch (this.triggerVar.types) {
        case "webHook":
          param = JSON.stringify(this.formTriggerHook);
          break;
        case "timer":
          param = JSON.stringify(this.formTriggerData);
          break;
        case "web":
          param = JSON.stringify(this.formTriggerWeb);
          break;
      }
      this.triggerVar.params = param;
      SaveTrigger(this.triggerVar)
        .then((res) => {
          this.$msgOk("保存成功");
          this.getTriggerList();
          this.closeTrigger();
        })
        .catch((err) => UtilCatch(this, err));
      this.triggerVar.params = param;
    },
    checkForm() {
      if (!this.triggerVar.name || this.triggerVar.name === "") {
        this.$msgErr("请输入触发器名称");
        return;
      }
      if (!this.triggerVar.types || this.triggerVar.types === "") {
        this.$msgErr("必须选择一种触发器类型");
        return;
      }

      if (this.triggerVar.types === "webHook") {
        if (
          !this.formTriggerHook.hookType ||
          this.formTriggerHook.hookType === ""
        ) {
          this.$msgErr("必须选择一种WebHook类型");
          return;
        }
        if (
          !this.formTriggerHook.secret ||
          this.formTriggerHook.secret === ""
        ) {
          this.$msgErr("请输入密钥");
          return;
        }
      }

      if (this.triggerVar.types === "timer") {
        if (this.formTriggerData.timerType === undefined) {
          this.$msgErr("必须选择一种定时器类型");
          return;
        }
        if (!this.formTriggerData.dates) {
          this.$msgErr("请选择时间段");
          return;
        }
      }
      if (this.triggerVar.types === "web") {
        if (!this.formTriggerWeb.secret || this.formTriggerWeb.secret === "") {
          this.$msgErr("请输入密钥");
          return;
        }
      }
      // if (this.triggerVar.types === "pipeline") {
      //   if (!this.formTriggerPipeline.pipeIds || this.formTriggerPipeline.pipeIds === "") {
      //     this.$msgErr("至少选择一条流水线")
      //     return
      //   }
      // }
      return true;
    },
  },
};
</script>
<style lang="sass" scoped>
.subRow
  margin-top: 10px

.org-users
  display: flex

.item
  width: 100px

.tools
  text-align: center

.triggerlist
  li
    padding: 10px
    border-bottom: 1px solid #eee
    border-radius: 8px
    cursor: pointer

    .tit

    &:hover
      background: #eee

    .tit_info
      display: flex

    .tit_name
      color: #24292e
      font-size: 20px
      font-weight: bold
      line-height: 35px

    .tit_types
      line-height: 35px
      margin-right: 5px

    .tit_active
      line-height: 35px

    .tits

.pipeBtn
  margin: 5px 0 0 5px
  line-height: 20px
  height: 20px
  padding-top: 0
</style>

<style lang="sass">
.form-control:disabled
  background-color: #ffffff
</style>