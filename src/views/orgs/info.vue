<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-devices" />&nbsp;
        <strong>{{ info.name }}</strong>
        <div class="card-header-actions">
          <CButton size="sm" color="primary" variant="outline" @click="selPip = true" v-if="perm.adm==true">
            添加流水线
          </CButton>
          &nbsp;
          <CButton size="sm" color="info" variant="outline" @click="$router.push(`/pipeline/new/${info.aid}`)"
            v-if="uinfo.permPipe==1&&perm.adm==true">
            新建流水线
          </CButton>
          &nbsp;
          <CButton size="sm" color="info" variant="outline" @click="arteditr=null;selArt = true"
            v-if="perm.write==true">
            新建制品库
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTabs :activeTab="actTab" variant="pills" :vertical="{ navs: 'col-md-2', content: 'col-md-10' }">
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator" />
              流水线
            </template>
            <CCard>
              <CCardBody>
                <PipelistView :orgId="info.aid+''" :items="pipeitems" :loading="loading" #default="{item}">
                  <CButton color="info" variant="outline" square size="sm" @click.stop="run(item.id)" class="pipeBtn"
                    v-if="perm.exec==true">
                    运行
                  </CButton>
                  <CButton color="danger" size="sm" @click.stop="rmPipeFun(item.id)" class="pipeBtn"
                    v-if="perm.adm==true">
                    移除
                  </CButton>
                </PipelistView>
                <CPagination :activePage="pipepage" :pages="pipepages" @update:activePage="getPipeList"
                  style="float: right;margin-top:20px" />
              </CCardBody>
            </CCard>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-calculator" />
              制品库
            </template>
            <CCard>
              <CCardBody>
                <ArtlistView :items="artitems" :loading="loadings" #default="{item}">
                  <CButton color="info" variant="outline" square size="sm" @click.stop="arteditr=item;selArt = true"
                    class="pipeBtn" v-if="perm.write==true">
                    修改
                  </CButton>
                  <CButton color="danger" size="sm" @click.stop="rmArtFun(item.id)" class="pipeBtn"
                    v-if="perm.write==true">
                    删除
                  </CButton>
                </ArtlistView>
                <CPagination :activePage="pipepage" :pages="pipepages" @update:activePage="getPipeList"
                  style="float: right;margin-top:20px" />
              </CCardBody>
            </CCard>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-calculator" />
              成员
            </template>
            <CCard accent-color="primary">
              <CCardHeader>
                <strong>所有者</strong>
                <!-- <div class="card-header-actions"></div> -->
              </CCardHeader>
              <CCardBody>
                <div>
                  <div class="c-avatar">
                    <img src="gokinsui/imgs/avatars/def.png" class="c-avatar-img" />
                  </div>
                  {{ user.nick }}
                </div>
              </CCardBody>
            </CCard>
            <CCard accent-color="primary">
              <CCardHeader>
                <strong>管理员</strong> <small style="color:#aaa">可管理 组织,流水线,制品库</small>
                <div class="card-header-actions">
                  <CButton size="sm" color="info" variant="outline" @click="selAdm = true" v-if="perm.own==true">
                    新增用户
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="org-users">
                  <div class="item" v-for="it in this.adms" :key="'adm:' + it.id">
                    <div class="tools">
                      <div class="c-avatar">
                        <img src="gokinsui/imgs/avatars/def.png" class="c-avatar-img" />
                      </div>
                    </div>
                    <div class="tools">{{ it.nick }}</div>
                    <div class="tools">
                      <CButton color="danger" size="sm" @click="rmUserFun(it.id)" v-if="perm.own==true">
                        <CIcon :content="$options.coreics['cilXCircle']" />移除
                      </CButton>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
            <CCard accent-color="primary">
              <CCardHeader>
                <strong>普通用户</strong> <small style="color:#aaa">只能操作 流水线,制品库</small>
                <div class="card-header-actions">
                  <CButton size="sm" color="info" variant="outline" @click="selUsr = true" v-if="perm.adm==true">
                    新增用户
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="org-users">
                  <div class="item" v-for="it in this.usrs" :key="'adm:' + it.id">
                    <div class="tools">
                      <div class="c-avatar">
                        <img src="gokinsui/imgs/avatars/def.png" class="c-avatar-img" />
                      </div>
                    </div>
                    <div class="tools">{{ it.nick }}</div>
                    <div class="tools">
                      <div>
                        <CBadge color="info">{{
                        it.permRw == 1 ? "可编辑" : "不可编辑"
                      }}</CBadge>
                      </div>
                      <div>
                        <CBadge color="info">{{
                        it.permExec == 1 ? "可执行" : "不可执行"
                      }}</CBadge>
                      </div>
                      <div>
                        <CBadge color="info">{{
                        it.permDown == 1 ? "可下载" : "不可下载"
                      }}</CBadge>
                      </div>
                    </div>
                    <div class="tools">
                      <CButton color="warning" size="sm" @click="upPermFun(it)" v-if="perm.adm==true">
                        <CIcon :content="$options.coreics['cilPenAlt']" />
                      </CButton>
                      <CButton color="danger" size="sm" @click="rmUserFun(it.id)" v-if="perm.adm==true">
                        <CIcon :content="$options.coreics['cilXCircle']" />
                      </CButton>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-calculator" />
              变量
            </template>
            <CCard v-if="perm.write == true">
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
                  <template #public="{ item }">
                    <td>
                      <CIcon v-if="item.public" style="color: #52c41a" name="cil-check-circle" />
                      <CIcon v-else style="color: #ff0042" name="cil-x-circle" />
                    </td>
                  </template>
                  <template #del="{ item }">
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
                  @update:activePage="getVars" />
              </CCardBody>
            </CCard>
            <CCard v-else>
              <CCardHeader>变量</CCardHeader>
              <CCardBody>
                <CDataTable :items="varItems" :fields="infoVarFields" pagination>
                  <template #public="{ item }">
                    <td>
                      <CIcon v-if="item.public" style="color: #52c41a" name="cil-check-circle" />
                      <CIcon v-else style="color: #ff0042" name="cil-x-circle" />
                    </td>
                  </template>
                </CDataTable>
                <CPagination :activePage.sync="varPage" :pages="varPages" size="sm" align="center"
                  @update:activePage="getVars" />
              </CCardBody>
            </CCard>
          </CTab>
          <CTab v-if="perm.adm==true">
            <template slot="title">
              <CIcon name="cil-calculator" /> 设置
            </template>
            <CCard accent-color="primary">
              <CCardHeader>
                <strong>信息 </strong>
                <!-- <div class="card-header-actions"></div> -->
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12">
                    <CInput label="名称" v-model="formData.name" placeholder="请输入组织名称" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="12">
                    <CTextarea label="描述" v-model="formData.desc" placeholder="请输入组织描述" rows="10" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="6">
                    <CInputCheckbox label="公开" :checked.sync="formData.public" />
                  </CCol>
                </CRow>
                <CRow class="subRow">
                  <CCol sm="6">
                    <CButton color="info" @click="subFun()">保存</CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <CCard accent-color="danger">
              <CCardHeader style="background-color: #ffe8e6">
                <strong>危险操作区</strong>
              </CCardHeader>
              <CCardBody style="display: flex">
                <div style="flex: 1">
                  <h5>删除组织</h5>
                  <p>组织删除之后无法恢复.请谨慎操作</p>
                </div>
                <div>
                  <CButton color="danger" variant="outline" square @click="rmOrgFun">
                    删除组织
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
    <EditArt :shown.sync="selArt" :orgId="info.id" :info="arteditr" @subOk="editArtOkFun" v-if="perm.write==true" />
    <SelectPipe :shown.sync="selPip" @addFun="addPipFun" v-if="perm.adm==true" />
    <SelectUser :shown.sync="selAdm" @addFun="addAdmFun" v-if="perm.own==true" />
    <SelectUser :shown.sync="selUsr" @addFun="addUsrFun" v-if="perm.adm==true" />
    <OrgUserPerm :shown.sync="selPerm" :perm="curPerm" @subFun="upUsrPermFun" />
    <SelectBranches :shown.sync="selectShow" :id="pipelineId" :orgId="info.aid+''" />

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
              <CSwitch class="mx-1" color="primary" shape="pill" :checked.sync="vars.public" />
            </div>
          </CCol>
        </CRow>
      </div>
    </CModal>
  </div>
</template>
<script>
import {
  OrgInfo,
  OrgPipeAdd,
  OrgPipelineList,
  OrgPipeRm,
  OrgRm,
  OrgSave,
  OrgUserEdit,
  OrgUserRm,
  OrgUsers,
  OrgVars,
  SaveOrgVars,
  DeleteOrgVars,
  ArtOrgList,
  ArtRm,
  UtilCatch,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
import PipelistView from "@/components/list/pipelist";
import ArtlistView from "@/components/list/artlist";
import SelectBranches from "@/components/modals/selectBranches";
import EditArt from "@/components/modals/editArt";
import SelectPipe from "@/components/modals/selectPipe";
import SelectUser from "@/components/modals/selectUser";
import OrgUserPerm from "@/components/modals/orgUserPerm";

export default {
  coreics: freeSet,
  components: { ArtlistView, PipelistView, EditArt, SelectPipe, SelectUser, OrgUserPerm, SelectBranches },
  data () {
    return {
      actTab: 0,
      info: {},
      user: {},
      adms: [],
      usrs: [],
      loading: true,
      pipepage: 0,
      pipepages: 0,
      pipeitems: [],
      loadings: true,
      artpage: 0,
      artpages: 0,
      artitems: [],
      arteditr: null,
      perm: {},
      formData: {
        id: "",
        name: "",
        desc: "",
        public: false,
      },
      pipelineId: "",
      selArt: false,
      selPip: false,
      selAdm: false,
      selUsr: false,
      selPerm: false,
      selectShow: false,
      curPerm: { rw: false, exec: false, down: false },

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
      varsShow: false,
      vars: {
        public: true,
        remarks: "",
        value: "",
        name: "",
      },
    };
  },
  computed: {
    uinfo () {
      return this.$store.state.uinfo || {}
    },
  },
  mounted () {
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.getInfo(this.$route.params.id);
  },
  methods: {
    getInfo (id) {
      this.loading = true;
      OrgInfo(id)
        .then((res) => {
          this.info = res.data.org;
          this.user = res.data.user;
          this.perm = res.data.perm;
          this.formData.id = this.info.id;
          this.formData.name = this.info.name;
          this.formData.desc = this.info.desc;
          this.formData.public = this.info.public == 1;
          this.getUserList();
          this.getPipeList();
          this.getArtList();
          this.getVars();
        })
        .catch((err) =>
          UtilCatch(this, err)
        );
    },
    run (id) {
      this.pipelineId = id
      this.selectShow = true
    },
    getUserList () {
      OrgUsers(this.info.id)
        .then((res) => {
          this.adms = res.data.adms || [];
          this.usrs = res.data.usrs || [];
        })
        .catch((err) => UtilCatch(this, err));
    },
    goVersion (id) {
      this.$router.push(`/pipeline/build/${id}`);
    },
    getPipeList (pg) {
      this.loading = true;
      OrgPipelineList({ page: pg, orgId: this.info.id })
        .then((res) => {
          this.loading = false;
          this.pipepage = res.data.page;
          this.pipepages = res.data.pages;
          this.pipeitems = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    getArtList (pg) {
      this.loadings = true;
      ArtOrgList({ page: pg, orgId: this.info.id })
        .then((res) => {
          this.loadings = false;
          this.artpage = res.data.page;
          this.artpages = res.data.pages;
          this.artitems = res.data.data;
        })
        .catch((err) => UtilCatch(this, err));
    },
    goEdit (id) {
      this.$router.push(`/pipeline/info/${id}`);
    },
    subFun () {
      if (this.formData.name == "") {
        console.log("name");
        this.$msgErr("请输入名称");
        return;
      }
      OrgSave(this.formData)
        .then(() => {
          this.$msgOk("保存成功");
          // this.$router.push('info/'+res.data.id)
        })
        .catch((err) => UtilCatch(this, err));
    },
    addPipFun (pipeid, fn) {
      OrgPipeAdd(this.info.id, pipeid)
        .then(() => {
          this.actTab = 0;
          fn(true);
          this.getPipeList();
          this.$msgOk("添加成功");
        })
        .catch((err) =>
          UtilCatch(this, err, (err) => {
            fn(false);
            const stat = err.response ? err.response.status : 0;
            if (stat == 511) {
              fn(true);
              this.$msgErr("流水线已存在");
            }
          })
        );
    },
    rmPipeFun (pipeid) {
      this.$confirm('确定从组织移除此流水线吗?<p style="color:#aaa">流水线不会被删除</p>', null, () => {
        OrgPipeRm(this.info.id, pipeid).then(() => {
          this.getPipeList();
          this.$msgOk("操作成功");
        }).catch((err) => UtilCatch(this, err));
      })
    },
    addAdmFun (uid, fn) {
      console.log("addAdmFun", uid);
      OrgUserEdit({ add: true, id: this.info.id, uid: uid, adm: true })
        .then(() => {
          fn(true);
          this.getUserList();
          this.$msgOk("添加成功");
        }).catch((err) =>
          UtilCatch(this, err, () => {
            fn(false);
          })
        );
    },
    addUsrFun (uid, fn) {
      console.log("addUserFun", uid);
      OrgUserEdit({ add: true, id: this.info.id, uid: uid, adm: false })
        .then(() => {
          fn(true);
          this.getUserList();
          this.$msgOk("添加成功,请稍后给予权限");
        }).catch((err) =>
          UtilCatch(this, err, () => {
            fn(false);
          })
        );
    },
    rmUserFun (uid) {
      this.$confirm("确定从组织移除此成员吗?", null, () => {
        OrgUserRm(this.info.id, uid)
          .then(() => {
            this.getUserList();
          }).catch((err) =>
            UtilCatch(this, err)
          );
      })
    },
    upPermFun (it) {
      this.curPerm = {
        id: it.id,
        rw: it.permRw == 1,
        exec: it.permExec == 1,
        down: it.permDown == 1,
      };
      this.selPerm = true;
    },
    upUsrPermFun (data) {
      console.log("upUsrPermFun", data);
      OrgUserEdit({
        id: this.info.id,
        uid: data.id,
        adm: false,
        rw: data.rw,
        ex: data.exec,
        dw: data.down,
      }).then((res) => {
        this.selPerm = false;
        this.getUserList();
        this.$msgOk("修改成功");
      })
        .catch((err) => UtilCatch(this, err));
    }, rmOrgFun () {
      this.$confirm("确定删除组织吗?", null, () => {
        OrgRm(this.info.id).then(() => {
          this.$router.push('/org/');
        }).catch((err) => UtilCatch(this, err));
      })
    }, editArtOkFun () {
      this.actTab = 1;
      this.getArtList(this.artpage);
    }, rmArtFun (id) {
      this.$confirm("确定删除制品库吗?可能将无法找回其下所有制品!", null, () => {
        ArtRm(id).then(() => {
          this.getArtList(this.artpage);
        }).catch((err) => UtilCatch(this, err));
      })
    },

    
    getVars () {
      OrgVars({ orgId: this.info.id, page: this.varPage })
        .then((res) => {
          this.varItems = [];
          for (const resKey in res.data.data) {
            let v = res.data.data[resKey];
            v.public = v.public == 1;
          }
          this.varPage = res.data.page;
          this.varPages = res.data.pages;
          this.varItems = res.data.data;
        })
        .catch((err) => {
          UtilCatch(this, err);
        });
    },
    openVars () {
      this.vars = {
        public: true,
        remarks: "",
        value: "",
        name: "",
      };
      this.varsShow = true;
    },
    closeVars () {
      this.vars = {
        public: true,
        remarks: "",
        value: "",
        name: "",
      };
      this.varsShow = false;
    },
    addVars () {
      if (!this.vars.name || this.vars.name == "") {
        this.$msgErr("请输入变量名");
        return;
      }
      if (!this.vars.value || this.vars.value == "") {
        this.$msgErr("请输入值");
        return;
      }
      this.saveVars();
      this.getVars();
    },
    delVar (item) {
      this.deletedPipelineVars(item.aid);
    },
    editVar (item) {
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
    saveVars () {
      let v = this.vars;
      v.orgId = this.info.id;
      SaveOrgVars(v)
        .then((res) => {
          this.closeVars();
          this.getVars();
        })
        .catch((err) => {
          UtilCatch(this, err);
        });
    },
    deletedVars (aid) {
      this.$confirm("确定删除变量?", null, () => {
        DeleteOrgVars({ aid: aid })
          .then((res) => {
            this.$msgOk("删除成功");
            this.closeVars();
            this.getVars();
          })
          .catch((err) => {
            UtilCatch(this, err);
          });
      });
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
.pipeBtn
  margin: 5px 0 0 5px
  line-height: 20px
  height: 20px
  padding-top: 0
</style>