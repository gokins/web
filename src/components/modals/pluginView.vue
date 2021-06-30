<template>
  <CModal :title="title||'Step示例'" size="lg" :show="shown" :pluginyml="pluginyml" :centered="true"
    @update:show="(val) => $emit('update:shown', val)">
    <template #footer>
      <CButton color="warning" @click="$emit('update:shown', false )">关闭</CButton>
    </template>
    <codemirror v-model="pluginyml" :options="cOptions"></codemirror>
  </CModal>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/display/autorefresh"
export default {
  components: { codemirror },
  props: {
    title: String,
    shown: Boolean,
    pluginyml: String,
  },
  watch: {},
  data () {
    return {
      cOptions: {
        lineNumbers: true,
        mode: "text/x-yaml",
        gutters: ["CodeMirror-lint-markers"],
        theme: "eclipse",
        readOnly: 'nocursor',
        autoRefresh: true
      },
    };
  },
  methods: {},
};
</script>
<style lang="sass">
.CodeMirror
  width: auto
  height: auto

.CodeMirror-scroll
  min-height: 300px
</style>