<template>
  <div>
    <CCard>
      <CCardHeader>
        <div class="crdhead">
          <myavatar :src="user.avatar" :nick="user.nick" imgw="18px" />
          <div class="tag" v-if="user.active==1">已激活</div>
          <div class="tag" v-else>未激活</div>
          <!-- <div style="flex:1"></div>
          <div>
            &nbsp;
            <CButton size="sm" color="warning" variant="outline">
              删除用户
            </CButton>
          </div> -->
        </div>
      </CCardHeader>
      <CCardBody>
        <CTabs variant="pills" :vertical="{ navs: 'col-md-2', content: 'col-md-10' }">
          <CTab active>
            <template slot="title">
              <CIcon name="cil-calculator" />
              基础信息
            </template>
            <CCard accent-color="primary" style="padding:20px">
              <CRow>
                <CCol>用户名: {{user.name}}</CCol>
                <CCol>注册时间: {{$dateFmt(user.created)}}</CCol>
                <CCol>序号: {{user.aid}}</CCol>
              </CRow>
              <CRow>
                <CCol>是否激活: {{user.active==1?'已激活':'未激活'}}</CCol>
                <CCol>登录时间: {{$dateFmt(user.loginTime)}}</CCol>
                <CCol>编号: {{user.id}}</CCol>
              </CRow>
            </CCard>
            <CCard accent-color="primary" style="padding:20px">
              <CRow>
                <CCol>电话: {{uinfo.phone}}</CCol>
                <CCol>电子邮箱: {{uinfo.email}}</CCol>
              </CRow>
              <CRow>
                <CCol>备注: {{uinfo.remark}}</CCol>
              </CRow>
            </CCard>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-calculator" />
              设置
            </template>
            <CCard accent-color="primary">
              <CCardHeader>
                <strong>信息 </strong>
                <!-- <div class="card-header-actions"></div> -->
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12">
                    <CInput label="名称" v-model="formData.nick" placeholder="请输入昵称" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="12">
                    <CInput label="电话" v-model="formData.phone" placeholder="请输入电话" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="12">
                    <CInput label="email" v-model="formData.email" placeholder="请输入email" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="12">
                    <CTextarea label="备注" v-model="formData.remark" placeholder="请输入备注" rows="10" />
                  </CCol>
                </CRow>
                <CRow class="subRow">
                  <CCol sm="6">
                    <CButton color="info" @click="subUpinfo()" :disabled="subinfo">保存</CButton>
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
                  <h5>激活/禁止 用户</h5>
                  <p>只能管理员操作,请谨慎操作</p>
                </div>
                <div>
                  <CButton color="danger" variant="outline" square @click="actFun(user.active==1?'0':'1')"
                    :disabled="subact">
                    {{user.active==1?'禁止':'激活'}}用户
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-calculator" />
              修改密码
            </template>
            <CCard accent-color="primary">
              <CCardBody>
                <CRow>
                  <CCol sm="12">
                    <CInput label="旧密码" v-model="passData.olds" placeholder="请输入旧密码" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="12">
                    <CInput label="新密码" v-model="passData.pass" placeholder="请输入新密码" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="12">
                    <CInput label="重复密码" v-model="passData.repass" placeholder="请重复密码" />
                  </CCol>
                </CRow>
                <CRow class="subRow">
                  <CCol sm="6">
                    <CButton color="info" @click="subUpass()">提交</CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import myavatar from "@/components/avatar";
import { UserInfo, UserUpinfo, UserUpss, UserActive, UtilCatch } from "@/assets/js/apis";
export default {
  components: { myavatar },
  data () {
    return {
      user: {},
      uinfo: {},
      subinfo: false,
      subact: false,
      formData: {},
      passData: {},
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
    this.getInfo(this.$route.params.id)
  },
  methods: {
    getInfo (id) {
      UserInfo(id).then(res => {
        this.subinfo = false;
        this.subact = false;
        this.user = res.data.user;
        this.uinfo = res.data.info;
        this.formData = {
          id: this.user.id,
          nick: this.user.nick,
          phone: this.uinfo.phone,
          email: this.uinfo.email,
          remark: this.uinfo.remark,
        }
        this.passData = {
          id: this.user.id,
          olds: '',
          pass: '',
          repass: ''
        }
      }).catch(err => UtilCatch(this, err));
    }, subUpinfo () {
      if (!this.formData.nick) {
        this.$msgErr('昵称必填');
        return;
      }
      this.subinfo = true;
      UserUpinfo(this.formData).then(() => {
        this.getInfo(this.user.id);
        this.$msgOk('保存成功');
      }).catch(err => UtilCatch(this, err, () => {
        this.subinfo = false;
      }))
    }, subUpass () {
      if (!this.passData.pass) {
        this.$msgErr('新密码必填');
        return;
      }
      if (this.passData.pass != this.passData.repass) {
        this.$msgErr('两次密码不一致');
        return;
      }
      UserUpss(this.passData).then(() => {
        this.$msgOk('修改成功');
      }).catch(err => UtilCatch(this, err, err => {
        const stat = err.response ? err.response.status : 0;
        if (stat == 511) {
          this.$msgErr('旧密码错误');
          return true;
        }
      }))
    }, actFun (act) {
      this.$confirm("确定禁止/激活用户吗?", null, () => {
        this.subact = true;
        UserActive(this.user.id, act).then(() => {
          this.getInfo(this.user.id);
        }).catch(err => UtilCatch(this, err))
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.crdhead
  display: flex
  .tag
    color: #aaa
    font-size: 10px
    padding: 0 5px
    margin: 0 0 0 10px
    height: 20px
    line-height: 20px
    border: 1px solid #ddd
    text-align: center
</style>