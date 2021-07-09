<template>
  <div>
    <CCard>
      <CCardHeader>
        <i class="iconfont icon-zhipinku" />&nbsp;
        <strong>{{ arty.name }} </strong>
        <div class="card-header-actions">
          <!-- <CButton color="dark" variant="outline" square size="sm" @click="copy()" style="margin-left: 5px"
            v-if="uinfo.permPipe == 1">
            复制
          </CButton>
          <CButton color="info" variant="outline" square size="sm" @click="run()" style="margin-left: 5px"
            v-if="perm.exec == true">
            运行
          </CButton> -->
        </div>
      </CCardHeader>
      <CCardBody>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import {
  ArtInfo,
  UtilCatch,
} from "@/assets/js/apis";
export default {
  data () {
    return {
      arty: {}
    }
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
  }, methods: {
    getInfo (id) {
      ArtInfo(id).then(res => {
        this.arty = res.data.arty;
      }).catch(err => UtilCatch(this, err))
    }
  }
}
</script>