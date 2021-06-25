<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput placeholder="Username" autocomplete="username email">
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="info" class="px-4" @click="login">Login</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0"
                        >Forgot password?</CButton
                      >
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard
              text-color="info"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <img class="login-dog" src="/img/login/dog.png" />
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
import { Login } from "@/assets/js/apis";
export default {
  name: "Login",
  methods: {
    login() {
      Login("admin", "123456")
        .then((res) => {
          console.log("Login ok:", res);
          this.$router.push('/dashboard')
        })
        .catch((err) => {
          console.log(
            "Login err:",
            err.response ? err.response.data || "服务器错误" : "网络错误",
            err
          );

        });
    },
  },
};
</script>
<style lang="sass" scoped>
.login-dog
  width: 250px
  margin-left: 35px
</style>