<template>
  <CModal title="请输入仓库分支或者commitSha" :show="shown" @update:show="(val) => $emit('update:shown', val)" :centered="true">
    <template #footer>
      <CButton color="warning" variant="outline" @click="$emit('update:shown', false)">取消</CButton>
      <CButton color="info" @click="run">确定</CButton>
    </template>
    <div>

      <Multiselect v-model="value" :options="options" placeholder="不填就是默认分支" label="name" track-by="name"
        :clearOnSelect="false" :preserveSearch="true" @search-change="change" :showNoResults="false"></Multiselect>
    </div>
  </CModal>
</template>
<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { RunPipeline, SearchSha, UtilCatch, } from "@/assets/js/apis";

export default {
  components: { Multiselect },
  props: {
    id: String,
    shown: Boolean,
  },
  watch: {
    id(nv) {
      if (nv != "") {
        this.searchSha()
      }
    },
    shown(nv) {
      this.value = {};
    }
  },
  mounted() {
    this.searchSha();
  },
  data() {
    return {
      value: {},
      options: []
    }
  },
  methods: {
    searchSha(q) {
      if (this.id === "") {
        return
      }
      SearchSha({
        q: q,
        id: this.id,
      }).then((res) => {
        this.options = res.data;
      }).catch((err) => UtilCatch(this, err));
    },
    change(value, id) {
      this.value = { name: value }
      this.searchSha(value)
    },
    run() {
      console.log('run value:',this.value);
      let par = { pipelineId: this.id, }
      if (this.value) {
        par.sha = this.value.name
      }
      RunPipeline(par)
        .then((res) => {
          this.value = {}
          this.$router.push("/pipeline/build/" + res.data.id);
        })
        .catch((err) => UtilCatch(this, err));
    }
  },
};
</script>
<style lang="sass">
</style>