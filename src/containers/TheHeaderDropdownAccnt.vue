<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            src="img/avatars/6.jpg"
            class="c-avatar-img "
          />
        </div>
        {{uname}}
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-bell"/> Updates
      <CBadge color="info" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-envelope-open" /> Messages
      <CBadge color="success" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tasks
      <CBadge color="danger" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-comment-square" /> Comments
      <CBadge color="warning" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-dollar" /> Payments
      <CBadge color="secondary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem>
      <CIcon name="cil-shield-alt" /> Lock Account
    </CDropdownItem>
    <CDropdownItem @click="logoutFun">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { removeToken } from "@/assets/js/token";
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      uname:'1',
      itemsCount: 42,
    }
  }, destroyed () {
    this.$offUInfo(this.uinfo);
  },mounted(){
    this.$mntdUInfo(this.uinfo);
  },methods:{
    uinfo(info){
      console.log('header drop uinfo:',info.nick);
      this.uname=info.nick;
      if(this.uname=='')
        this.uname=info.name;
    },logoutFun(){
      removeToken();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>