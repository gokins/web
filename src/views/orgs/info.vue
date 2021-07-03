<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>组织: {{ info.name }}</strong>
        <div class="card-header-actions">
          <CButton size="sm" color="info" variant="outline" @click="selPip = true">
            添加流水线
          </CButton>
          &nbsp;
          <CButton size="sm" color="primary" variant="outline" @click="$router.push('/pipeline/new/' + info.aid)">
            新建流水线
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTabs variant="pills" :vertical="{ navs: 'col-md-2', content: 'col-md-10' }">
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator" />
              流水线
            </template>
            <CCard>
              <CCardBody>
                <PipelistView :items="pipeitems" :loading="loading" #default="{item}">
                  <CButton color="info" variant="outline" square size="sm" @click.stop="run(item.id)" class="pipeBtn">
                    运行
                  </CButton>
                  <CButton color="danger" size="sm" @click.stop="rmPipeFun(item.id)" class="pipeBtn">
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
              <CIcon name="cil-basket" />
              成员
            </template>
            <CCard>
              <CCardHeader>
                <strong>所有者</strong>
                <!-- <div class="card-header-actions"></div> -->
              </CCardHeader>
              <CCardBody>
                <div>
                  <div class="c-avatar">
                    <img src="img/avatars/def.png" class="c-avatar-img" />
                  </div>
                  {{ user.nick }}
                </div>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader>
                <strong>管理员</strong> <small style="color:#aaa">可管理组织和操作流水线</small>
                <div class="card-header-actions">
                  <CButton size="sm" color="info" variant="outline" @click="selAdm = true">
                    新增用户
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="org-users">
                  <div class="item" v-for="it in this.adms" :key="'adm:' + it.id">
                    <div class="tools">
                      <div class="c-avatar">
                        <img src="img/avatars/def.png" class="c-avatar-img" />
                      </div>
                    </div>
                    <div class="tools">{{ it.nick }}</div>
                    <div class="tools">
                      <CButton color="danger" size="sm" @click="rmUserFun(it.id)">
                        <CIcon :content="$options.coreics['cilXCircle']" />移除
                      </CButton>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader>
                <strong>普通用户</strong> <small style="color:#aaa">只能操作流水线</small>
                <div class="card-header-actions">
                  <CButton size="sm" color="info" variant="outline" @click="selUsr = true">
                    新增用户
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="org-users">
                  <div class="item" v-for="it in this.usrs" :key="'adm:' + it.id">
                    <div class="tools">
                      <div class="c-avatar">
                        <img src="img/avatars/def.png" class="c-avatar-img" />
                      </div>
                    </div>
                    <div class="tools">{{ it.nick }}</div>
                    <div class="tools">
                      <CBadge color="info">{{
                        it.permRw == 1 ? "可编辑" : "不可编辑"
                      }}</CBadge>
                      <CBadge color="info">{{
                        it.permExec == 1 ? "可执行" : "不可执行"
                      }}</CBadge>
                    </div>
                    <div class="tools">
                      <CButton color="warning" size="sm" @click="upPermFun(it)">
                        <CIcon :content="$options.coreics['cilPenAlt']" />
                      </CButton>
                      <CButton color="danger" size="sm" @click="rmUserFun(it.id)">
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
              <CIcon name="cil-chart-pie" /> 设置
            </template>
            <CCard style="width:80%">
              <CCardHeader>
                <strong>信息 </strong>
                <!-- <div class="card-header-actions"></div> -->
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12">
                    <CInput label="名称" v-model="formData.name" placeholder="请输入组织名称" Max="10" />
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
            <CCard>
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
    <SelectPipe :shown.sync="selPip" @addFun="addPipFun" />
    <SelectUser :shown.sync="selAdm" @addFun="addAdmFun" />
    <SelectUser :shown.sync="selUsr" @addFun="addUsrFun" />
    <OrgUserPerm :shown.sync="selPerm" :perm="curPerm" @subFun="upUsrPermFun" />
    <SelectBranches :shown.sync="selectShow" :id="pipelineId" />
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
  UtilCatch,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
import PipelistView from "@/components/list/pipelist";
import SelectBranches from "@/components/modals/selectBranches";
import SelectPipe from "@/components/modals/selectPipe";
import SelectUser from "@/components/modals/selectUser";
import OrgUserPerm from "@/components/modals/orgUserPerm";

export default {
  coreics: freeSet,
  components: { PipelistView, SelectPipe, SelectUser, OrgUserPerm, SelectBranches },
  data () {
    return {
      info: {},
      user: {},
      adms: [],
      usrs: [],
      loading: true,
      pipepage: 0,
      pipepages: 0,
      pipeitems: [],
      formData: {
        id: "",
        name: "",
        desc: "",
        public: false,
      },
      pipelineId: "",
      selPip: false,
      selAdm: false,
      selUsr: false,
      selPerm: false,
      selectShow: false,
      curPerm: { rw: false, exec: false },
    };
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
          this.formData.id = this.info.id;
          this.formData.name = this.info.name;
          this.formData.desc = this.info.desc;
          this.formData.public = this.info.public == 1;
          this.getUserList();
          this.getPipeList();
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
      this.$router.push("/pipeline/build/" + id);
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
    goEdit (id) {
      this.$router.push("/pipeline/info/" + id);
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
          fn(true);
          this.getPipeList();
          this.$msgOk("添加成功");
        })
        .catch((err) =>
          UtilCatch(this, err, (err) => {
            fn(false);
            const stat = err.response ? err.response.status : 0;
            if (stat == 405) {
              this.$msgErr("此操作只有创建者拥有权限");
            } else if (stat == 511) {
              fn(true);
              this.$msgErr("流水线已存在");
            } else {
              this.$msgErr(
                err.response ? err.response.data || "服务器错误" : "网络错误"
              );
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
          UtilCatch(this, err, (err) => {
            fn(false);
            const stat = err.response ? err.response.status : 0;
            if (stat == 405) {
              this.$msgErr("此操作只有创建者拥有权限");
            } else {
              this.$msgErr(
                err.response ? err.response.data || "服务器错误" : "网络错误"
              );
            }
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
          UtilCatch(this, err, (err) => {
            fn(false);
            const stat = err.response ? err.response.status : 0;
            if (stat == 405) {
              this.$msgErr("无权限");
            } else {
              this.$msgErr(
                err.response ? err.response.data || "服务器错误" : "网络错误"
              );
            }
          })
        );
    },
    rmUserFun (uid) {
      this.$confirm("确定从组织移除此成员吗?", null, () => {
        OrgUserRm(this.info.id, uid)
          .then(() => {
            this.getUserList();
          }).catch((err) =>
            UtilCatch(this, err, (err) => {
              const stat = err.response ? err.response.status : 0;
              if (stat == 405) {
                this.$msgErr("无权限");
              } else {
                this.$msgErr(
                  err.response ? err.response.data || "服务器错误" : "网络错误"
                );
              }
            })
          );
      })
    },
    upPermFun (it) {
      this.curPerm = {
        id: it.id,
        rw: it.permRw == 1,
        exec: it.permExec == 1,
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
    }
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