<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>登录</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput placeholder="Username" autocomplete="username email" v-model="param.name">
                    <template #prepend-content>
                      <CIcon name="cil-user" />
                    </template>
                  </CInput>
                  <CInput placeholder="Password" type="password" autocomplete="curent-password" v-model="param.password"
                    @keyup.enter="login">
                    <template #prepend-content>
                      <CIcon name="cil-lock-locked" />
                    </template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="info" class="px-4" @click="login" :disabled="subing">登录</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <!-- <CButton color="link" class="px-0">Forgot password?</CButton> -->
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard text-color="info" class="moreinfo text-center py-5 d-md-down-none" body-wrapper>
              <CCardBody>
                <img class="login-dog" src="/img/dog.png" />
                <h4>Gokins: More Power</h4>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from "@/assets/js/token";
import { Login } from "@/assets/js/apis";
export default {
  name: "Login",
  data () {
    return {
      subing: false,
      param: {},
    };
  },
  methods: {
    login () {
      this.subing = true;
      Login(this.param.name, this.param.password).then((res) => {
        // this.subing = false;
        setToken(res.data.token);
        this.$refreshUInfo();
        // this.$msgOk("登录成功");
        this.$router.push("/dashboard");
      }).catch((err) => {
        this.subing = false;
        switch (err.response ? err.response.status : 0) {
          case 404:
            this.$msgErr("登录失败:未找到用户");
            break;
          case 511:
            this.$msgErr("登录失败:密码错误");
            break;
          case 512:
            this.$msgErr("登录失败:安装错误");
            break;
          case 513:
            this.$msgErr("登录失败:用户未激活");
            break;
          case 500:
            this.$msgErr(
              err.response ? err.response.data || "服务器错误" : "网络错误"
            );
            break;
          default:
            console.log("Login err:", err);
            this.$msgErr("登录失败");
            break;
        }
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.login-dog
  display: inline-block
  height: auto
  max-width: 100%
  margin-left: 15px
.moreinfo
  background: #fff
</style>