<template>
  <n-form class="setting-form" label-placement="left">
    <n-form-item label="开机自启动">
      <n-checkbox
        v-model:checked="globalStore.settings.autoStart"
        @update-checked="autoStartProgram"
      ></n-checkbox>
    </n-form-item>
    <n-form-item label="固定在任务栏">
      <n-checkbox
        @update:checked="fixedOnTray"
        v-model:check="globalStore.settings.fixedTray"
      ></n-checkbox>
    </n-form-item>
    <n-form-item label="自动切换桌面壁纸">
      <n-checkbox
        v-model:checked="globalStore.settings.autoSwitch"
      ></n-checkbox>
    </n-form-item>
    <n-form-item label="自动切换壁纸间隔时长单位">
      <n-select
        v-model:value="globalStore.settings.autoSwtichUnit"
        :options="durationUnitOptions"
      />
    </n-form-item>
    <n-form-item label="自动切换壁纸间隔时长">
      <n-input-number
        placeholder="请输入间隔时长"
        min="1"
        v-if="globalStore.settings.autoSwtichUnit !== 'random'"
        v-model:value="globalStore.settings.autoSwtichInterval"
      >
      </n-input-number
      ><span style="margin-left: 10px; font-size: 14px">{{
        selectedDurationUnitTxt
      }}</span>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  useMessage,
  NCheckbox,
  NInputNumber,
  NSelect,
  SelectOption,
} from "naive-ui";
import { computed } from "vue";
import globalStore from "../store/globalStore";
import systemApi from "../api/settingApi";
const NMessage = useMessage();

const durationUnits: Record<string, string> = {
  day: "天",
  hour: "小时",
  minute: "分钟",
  random: "随机",
};

const selectedDurationUnitTxt = computed<string>(
  () => durationUnits[globalStore.settings.autoSwtichUnit]
);
const durationUnitOptions: SelectOption[] = [
  {
    label: "天",
    value: "day",
  },
  {
    label: "小时",
    value: "hour",
  },
  {
    label: "分钟",
    value: "minute",
  },
  {
    label: "随机",
    value: "random",
  },
];

function fixedOnTray(checked: boolean) {
  window.system.ipcRenderer.send("fixedTray", checked);
}

function updateSetting(key: string, value: any) {
  const loading = NMessage.loading("");
  return systemApi
    .updateSetting(key, value)
    .then((res) => {
      NMessage.success("设置成功");

      return res;
    })
    .catch((err) => {
      NMessage.error("设置失败");

      return err;
    })
    .finally(loading.destroy);
}
function autoStartProgram(checked: boolean) {
  updateSetting("autoStart", checked).then(res=>{

  });
}
</script>

<style scoped>
.setting-form {
  margin: 40px auto;
  width: 500px;
}
</style>
