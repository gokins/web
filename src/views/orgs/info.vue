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
              <CIcon name="cil-calculator" /> 流水线
            </template>
            <CDataTable :hover="true" :striped="true" :border="false" :small="true" :fixed="true" :fields="pipefields"
              :items="pipeitems">
              <template #edit="{ item }">
                <td class="py-2">
                  <CButton color="primary" variant="outline" square size="sm" @click="goEdit(item.id)">
                    查看
                  </CButton>
                  <CButton color="primary" variant="outline" square size="sm" @click="run(item.id)"
                    style="margin-left: 5px">
                    运行
                  </CButton>
                  <CButton color="danger" size="sm" @click="rmPipeFun(item.id)" style="margin-left: 5px">
                    <CIcon :content="$options.coreics['cilXCircle']" size="sm" />移除
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-basket" /> 成员
            </template>
            <CCard>
              <CCardHeader>
                <strong>所有者</strong>
                <!-- <div class="card-header-actions"></div> -->
              </CCardHeader>
              <CCardBody>
                <div>
                  <div class="c-avatar">
                    <img src="img/avatars/6.jpg" class="c-avatar-img" />
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
                        <img src="img/avatars/6.jpg" class="c-avatar-img" />
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
                        <img src="img/avatars/6.jpg" class="c-avatar-img" />
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
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
    <SelectPipe :shown.sync="selPip" @addFun="addPipFun" />
    <SelectUser :shown.sync="selAdm" @addFun="addAdmFun" />
    <SelectUser :shown.sync="selUsr" @addFun="addUsrFun" />
    <OrgUserPerm :shown.sync="selPerm" :perm="curPerm" @subFun="upUsrPermFun" />
  </div>
</template>
<script>
import {
  UtilCatch,
  OrgInfo,
  OrgUsers,
  OrgUserRm,
  OrgPipelineList,
  OrgSave,
  OrgUserEdit,
  OrgPipeAdd,
  OrgPipeRm,
  RunPipeline,
} from "@/assets/js/apis";
import { freeSet } from "@coreui/icons";
import SelectPipe from "@/components/modals/selectPipe";
import SelectUser from "@/components/modals/selectUser";
import OrgUserPerm from "@/components/modals/orgUserPerm";
export default {
  coreics: freeSet,
  components: { SelectPipe, SelectUser, OrgUserPerm },
  data () {
    return {
      info: {},
      user: {},
      adms: [],
      usrs: [],
      pipefields: [
        {
          key: "name",
          label: "名称",
        },
        {
          key: "displayName",
          label: "描述",
        },
        {
          key: "edit",
          label: "操作",
          sorter: false,
          filter: false,
        },
      ],
      pipeitems: [],
      formData: {
        id: "",
        name: "",
        desc: "",
        public: false,
      },

      selPip: false,
      selAdm: false,
      selUsr: false,
      selPerm: false,
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
          UtilCatch(this, err, _ => {
            this.$router.push("/500");
          })
        );
    },
    run (id) {
      RunPipeline({ pipelineId: id, orgId: this.orgId, repoId: "1" })
        .then((res) => {
          this.goVersion(res.data.id);
        })
        .catch((err) => UtilCatch(this, err));
    },
    getUserList () {
      OrgUsers(this.info.id)
        .then((res) => {
          this.adms = res.data.adms || [];
          this.usrs = res.data.usrs || [];
        })
        .catch((err) => UtilCatch(this, err));
    },
    goVersion(id) {
      this.$router.push("/pipeline/build/" + id);
    },
    getPipeList () {
      OrgPipelineList({ page: 0, orgId: this.info.id })
        .then((res) => {
          // this.page = res.data.page;
          // this.pages = res.data.pages;
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
        .then((res) => {
          this.$msgOk("保存成功");
          // this.$router.push('info/'+res.data.id)
        })
        .catch((err) => UtilCatch(this, err));
    },
    addPipFun (pipeid, fn) {
      OrgPipeAdd(this.info.id, pipeid)
        .then((res) => {
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
      OrgPipeRm(this.info.id, pipeid)
        .then((res) => {
          this.getPipeList();
          this.$msgOk("操作成功");
        })
        .catch((err) => UtilCatch(this, err));
    },
    addAdmFun (uid, fn) {
      console.log("addAdmFun", uid);
      OrgUserEdit({ add: true, id: this.info.id, uid: uid, adm: true })
        .then((res) => {
          fn(true);
          this.getUserList();
          this.$msgOk("添加成功");
        })
        .catch((err) =>
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
        .then((res) => {
          fn(true);
          this.getUserList();
          this.$msgOk("添加成功,请稍后给予权限");
        })
        .catch((err) =>
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
      OrgUserRm(this.info.id, uid)
        .then((res) => {
          this.getUserList();
        })
        .catch((err) =>
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
      })
        .then((res) => {
          this.selPerm = false;
          this.getUserList();
          this.$msgOk("修改成功");
        })
        .catch((err) => UtilCatch(this, err));
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
</style>