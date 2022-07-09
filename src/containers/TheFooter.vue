<template>
  <CFooter :fixed="false">
    <div>
      <a href="http://gokins.cn" target="_blank">Gokins</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} </span>
      <span class="ml-1">Version: {{version}}。</span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1">Powered by</span>
      <a href="https://coreui.io/vue" target="_blank">CoreUI for Vue</a>
    </div>
  </CFooter>
</template>

<script>
import { GetVersion } from "@/assets/js/apis";
export default {
  name: 'TheFooter',
  data(){
    return {
      version:'1.0.0'
    }
  },
  mounted(){
    this.getVersion();
  },methods:{
    getVersion(){
      GetVersion().then((res) => {
        this.version = res.data;
      }).catch((err) => console.log(err));
    }
  }
}
</script>
