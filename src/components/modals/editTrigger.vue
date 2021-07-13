<template>
  <div>
    <CModal
      title="添加触发器"
      :show="shown"
      @update:show="close"
      :centered="true"
    >
      <template #footer>
        <CButton color="warning" @click="close">关闭</CButton>
        <CButton color="info" @click="save">确定</CButton>
      </template>
      <CRow>
        <CCol>
          <CInput
            label="触发器名称: "
            placeholder="触发器名称"
            v-model="triggerVar.name"
          />
        </CCol>
        <CCol>
          <CSelect
            label="触发器类型"
            :options="triggerOptions"
            placeholder="请选择触发器类型"
            :value="triggerVar.types"
            custom
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CInput
            label="备注: "
            placeholder="请输入备注"
            v-model="triggerVar.desc"
          />
        </CCol>
      </CRow>
      <CRow v-if="triggerVar.types === 'webHook'">
        <CCol>
          <CSelect
            label="WebHook类型"
            :options="webHookOptions"
            placeholder="请选择WebHook类型"
            :value="formTriggerHook.hookType"
            custom
          />
        </CCol>
      </CRow>
      <CRow v-if="triggerVar.types === 'webHook'">
        <CCol>
          <CInput
            label="密钥: "
            placeholder="请输入密钥"
            v-model="formTriggerHook.secret"
          />
        </CCol>
      </CRow>
      <CRow v-if="triggerVar.types === 'webHook'">
        <CCol>
          <CInput
            label="分支: "
            placeholder="请输入分支"
            v-model="formTriggerHook.branch"
          />
        </CCol>
      </CRow>
      <CRow v-if="triggerVar.types === 'webHook'">
        <CCol>
          <CSelect
            label="触发事件"
            :options="hookEventOptions"
            placeholder="请选择Hook事件"
            :value="formTriggerHook.hookEvent"
            custom
          />
        </CCol>
      </CRow>
      <CRow v-else-if="triggerVar.types === 'timer'">
        <CCol>
          <CSelect
            label="重复:"
            :options="timerOptions"
            placeholder="请选择"
            :value="formTriggerData.timerType"
            custom
          />
        </CCol>
        <CCol>
          <label>时间:</label>
          <date-picker
            v-model="formTriggerData.dates"
            type="datetime"
            :show-hour="true"
            :show-minute="true"
            confirm-text="确定"
            :confirm="true"
          >
            <template v-slot:footer>
              <button class="mx-btn mx-btn-text" @click="chooseToday">
                此刻
              </button>
            </template>
          </date-picker>
        </CCol>
      </CRow>
      <CRow v-else-if="triggerVar.types === 'pipeline'">
        <CCol>
          <CSelect
            label="流水线名称:"
            :options="timerOptions"
            placeholder="请选择"
            :value="formTriggerPipeline.pipeIds"
            custom
          />
        </CCol>
      </CRow>
      <CRow v-if="triggerVar.types === 'web'">
        <CCol>
          <CInput
            label="密钥: "
            placeholder="请输入密钥"
            v-model="formTriggerWeb.secret"
          />
        </CCol>
      </CRow>
      <CRow v-if="triggerVar.types === 'web'">
        <CCol>
          <CInput
            label="分支: "
            placeholder="请输入分支"
            v-model="formTriggerWeb.branch"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <div style="display: flex">
            激活
            <CSwitch
              class="mx-1"
              color="primary"
              shape="pill"
              :checked="triggerVar.enabled"
            />
          </div>
        </CCol>
      </CRow>
    </CModal>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
  components: { DatePicker },
  props: {
    triggerVar: Object,
    shown: Boolean,
    closeTrigger: Function,
    saveTrigger: Function,
    formTriggerData: Object,
    formTriggerHook: Object,
    formTriggerPipeline: Object,
    formTriggerWeb: Object,
  },
  watch: {},
  data() {
    return {
      triggerOptions: [
        { label: "webHook", value: "webHook" },
        { label: "定时器", value: "timer" },
        { label: "Web", value: "web" },
        // {label: "流水线结束后触发", value: "pipeline"}
      ],
      webHookOptions: ["Github", "Gitee", "Gitea", "Gitlab", "Codeup"],
      hookEventOptions: [{ label: "所有事件", value: "" }, "push"],
      timerOptions: [
        { label: "不重复", value: 0 },
        { label: "每天", value: 1 },
        { label: "每周", value: 2 },
      ],
      timers: ["不重复", "每天", "每周"],
    };
  },
  mounted() {},
  methods: {
    chooseToday() {
      this.formTriggerData.dates = new Date();
    },
    save() {
      this.$emit("saveTrigger");
    },
    close() {
      this.$emit("closeTrigger");
    },
  },
};
</script>
<style lang="sass" scoped>
</style>
