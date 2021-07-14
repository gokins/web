<template>
  <div>
    <CModal
      title="添加触发器"
      :show="triggerShow"
      @update:show="(val) => $emit('update:triggerShow', val)"
      :centered="true"
    >
      <template #footer>
        <CButton color="warning" @click="$emit('update:triggerShow', false)"
          >关闭</CButton
        >
        <CButton color="info" @click="saveTrigger">确定</CButton>
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
            :value.sync="triggerVar.types"
            @change="change"
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
            :value.sync="formTriggerHook.hookType"
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
            :value.sync="formTriggerHook.hookEvent"
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
            :value.sync="formTriggerData.timerType"
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
            :value.sync="formTriggerPipeline.pipeIds"
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
              :checked.sync="triggerVar.enabled"
            />
          </div>
        </CCol>
      </CRow>
    </CModal>
  </div>
</template>
<script>
import { SaveTrigger, UtilCatch } from "@/assets/js/apis";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
  components: { DatePicker },
  props: {
    item: Object,
    triggerShow: Boolean,
    closeTrigger: Function,
    pipelineId: String,
  },
  watch: {
    triggerShow(nv) {
      if (nv == true) {
        if (this.item && this.item.id != undefined && this.item.id != "") {
          switch (this.item.types) {
            case "webHook":
              this.formTriggerHook = JSON.parse(this.item.params);
              break;
            case "timer":
              let p = JSON.parse(this.item.params);
              p.dates = new Date(p.dates);
              this.formTriggerData = p;
              break;
            case "web":
              this.formTriggerWeb = JSON.parse(this.item.params);
              break;
          }
          this.triggerVar.id = this.item.id;
          this.triggerVar.name = this.item.name;
          this.triggerVar.types = this.item.types;
          this.triggerVar.desc = this.item.desc;
          this.triggerVar.enabled = this.item.enabled == 1;
        } else {
          this.triggerVar = {
            enabled: true,
          };
          this.formTriggerData = { dates: new Date() };
          this.formTriggerHook = {};
          // this.formTriggerPipeline = {}
          this.formTriggerWeb = {};
          this.triggerShow = true;
        }
      }
    },
  },
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
      formTriggerData: {},
      formTriggerHook: {},
      formTriggerPipeline: {},
      formTriggerWeb: {},
      triggerVar: {},
    };
  },
  mounted() {
    console.log(this.triggerVar);
  },
  methods: {
    chooseToday() {
      this.formTriggerData.dates = new Date();
    },
    saveTrigger() {
      if (!this.checkForm()) {
        return;
      }
      this.triggerVar.pipelineId = this.pipelineId;
      let param = "";
      switch (this.triggerVar.types) {
        case "webHook":
          param = JSON.stringify(this.formTriggerHook);
          break;
        case "timer":
          param = JSON.stringify(this.formTriggerData);
          break;
        case "web":
          param = JSON.stringify(this.formTriggerWeb);
          break;
      }
      this.triggerVar.params = param;
      SaveTrigger(this.triggerVar)
        .then((res) => {
          this.$msgOk("保存成功");
          this.$emit("update:triggerShow", false);
          this.$emit("getTriggerList");
        })
        .catch((err) => UtilCatch(this, err));
    },
    checkForm() {
      if (!this.triggerVar.name || this.triggerVar.name === "") {
        this.$msgErr("请输入触发器名称");
        return;
      }
      if (!this.triggerVar.types || this.triggerVar.types === "") {
        this.$msgErr("必须选择一种触发器类型");
        return;
      }

      if (this.triggerVar.types === "webHook") {
        if (
          !this.formTriggerHook.hookType ||
          this.formTriggerHook.hookType === ""
        ) {
          this.$msgErr("必须选择一种WebHook类型");
          return;
        }
        if (
          !this.formTriggerHook.secret ||
          this.formTriggerHook.secret === ""
        ) {
          this.$msgErr("请输入密钥");
          return;
        }
      }

      if (this.triggerVar.types === "timer") {
        if (this.formTriggerData.timerType === undefined) {
          this.$msgErr("必须选择一种定时器类型");
          return;
        }
        if (!this.formTriggerData.dates) {
          this.$msgErr("请选择时间段");
          return;
        }
      }
      if (this.triggerVar.types === "web") {
        if (!this.formTriggerWeb.secret || this.formTriggerWeb.secret === "") {
          this.$msgErr("请输入密钥");
          return;
        }
      }
      // if (this.triggerVar.types === "pipeline") {
      //   if (!this.formTriggerPipeline.pipeIds || this.formTriggerPipeline.pipeIds === "") {
      //     this.$msgErr("至少选择一条流水线")
      //     return
      //   }
      // }
      return true;
    },
    change(e) {
      console.log(123);
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="sass" scoped>
</style>
