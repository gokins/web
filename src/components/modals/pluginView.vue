<template>
  <CModal
      title="步骤"
      size="lg"
      :show="shown"
      :pluginyml="pluginyml"
      :centered="true"
      @update:show="(val) => $emit('update:shown', val)"
  >
    <codemirror
        v-model="pluginyml"
        :options="cOptions"
    ></codemirror>
  </CModal>
</template>
<script>
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