<template>
  <CModal
      title="选择用户"
      size="lg"
      :show="shown"
      :pluginyml="pluginyml"
      :centered="true"
      @update:show="(val) => $emit('update:shown', val)"
  >
    <codemirror
        v-model="pluginyml"
        :options="cOptions"
        class="json-editor"
    ></codemirror>
  </CModal>
</template>
<script>
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/yaml/yaml";

export default {
  props: {
    shown: Boolean,
    pluginyml: String,
  },
  watch: {},
  data() {
    return {
      cOptions: {
        lineNumbers: true,
        mode: "text/x-yaml",
        gutters: ["CodeMirror-lint-markers"],
        theme: "eclipse",
        readOnly: 'nocursor'
      },
    };
  },
  methods: {},
};
</script>