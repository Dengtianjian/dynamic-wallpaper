import { reactive } from "vue";

export default reactive<{
  settings: {
    autoStart: boolean,
    autoSwitch: boolean,
    autoSwtichInterval: number,
    autoSwtichUnit: string,
    fixedTray: boolean,
  },
  windowParams: {
    width: number,
    height: number
  }
}>({
  settings: {
    autoStart: true,
    autoSwitch: false,
    autoSwtichInterval: 0,
    autoSwtichUnit: "random",
    fixedTray: true
  },
  windowParams: {
    width: window.innerWidth,
    height: window.innerHeight,
  }
})