<template>
  <n-form class="setting-form" label-placement="left">
    <n-form-item label="开机自启动">
      <n-checkbox v-model:checked="globalStore.settings.autoStart" @update-checked="autoStartProgram" :checked-value="true"
      :unchecked-value="false"></n-checkbox>
    </n-form-item>
    <n-form-item label="固定在任务栏">
      <n-checkbox @update:checked="fixedOnTray" v-model:checked="globalStore.settings.fixedTray" :checked-value="true"
        :unchecked-value="false"></n-checkbox>
    </n-form-item>
    <n-form-item label="自动切换桌面壁纸">
      <n-checkbox v-model:checked="globalStore.settings.autoSwitch" @update:checked="autoSwitchWallpaper" :checked-value="true"
      :unchecked-value="false"></n-checkbox>
    </n-form-item>
    <n-form-item label="自动切换壁纸间隔时长单位">
      <n-select v-model:value="globalStore.settings.autoSwtichUnit" :options="durationUnitOptions"
        @update:value="updateAutoSwitchUnit" />
    </n-form-item>
    <n-form-item label="自动切换壁纸间隔时长">
      <n-input-number placeholder="请输入间隔时长" min="1" v-if="globalStore.settings.autoSwtichUnit !== 'random'"
        v-model:value="globalStore.settings.autoSwtichInterval" @update:value="updateAutoSwitchInterval">
      </n-input-number><span style="margin-left: 10px; font-size: 14px">{{
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
import systemApi from "../api/SettingsApi";
import wallpaperService from "../service/wallpaperService";
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
  updateSetting("autoStart", checked).then((res) => {
    if(window.system){
      window.system.autoStart(checked);
    }
  });
}
function autoSwitchWallpaper(checked: boolean) {
  updateSetting("autoSwitch", checked).then((res) => {
    if (checked) {
      wallpaperService.autoSwitchWallpaper(true);
    } else {
      wallpaperService.cancelAutoSwitchWallpaper();
    }
  });
}
function fixedOnTray(checked: boolean) {
  updateSetting("fixedTray", checked)
    .then((res) => {
      if (window.tray) {
        window.tray.fixedTray(checked);
      }
    })
    .catch(() => {
      globalStore.settings.fixedTray = !globalStore.settings.fixedTray;
    });
}
function updateAutoSwitchUnit(unit: string) {
  let oldV: string = globalStore.settings.autoSwtichUnit;
  updateSetting("autoSwtichUnit", unit)
    .then((res) => {
      globalStore.settings.autoSwtichUnit = unit;
    })
    .catch(() => {
      globalStore.settings.autoSwtichUnit = oldV;
    });
}
function updateAutoSwitchInterval(interval: any) {
  let oldV: number = globalStore.settings.autoSwtichInterval;
  updateSetting("autoSwtichInterval", interval)
    .then((res) => {
      globalStore.settings.autoSwtichInterval = interval;
    })
    .catch(() => {
      globalStore.settings.autoSwtichInterval = oldV;
    });
}
</script>

<style scoped>
.setting-form {
  margin: 40px auto;
  width: 500px;
}
</style>
