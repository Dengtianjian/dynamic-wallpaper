<template>
  <ul
    class="fixed-menu"
    :style="{ zIndex, top, right, bottom, left }"
    @click="clickMenu"
  >
    <li
      :class="menuItem.icon"
      v-for="menuItem in menu"
      :key="menuItem.key"
      :data-key="menuItem.key"
    ></li>
  </ul>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

type TMenuItem = {
  key: string;
  icon: string;
  name: string;
};

defineProps({
  zIndex: {
    type: Number,
    default: 1,
  },
  top: {
    type: [String, Number],
    default: "unset",
  },
  bottom: {
    type: [String, Number],
    default: "70px",
  },
  right: {
    type: [String, Number],
    default: "50px",
  },
  left: {
    type: [String, Number],
    default: "unset",
  },
  menu: {
    type: Array as PropType<TMenuItem[]>,
    default: [],
  },
});
const Emits = defineEmits(["click"]);
function clickMenu(event: MouseEvent) {
  Emits("click", (event.target as HTMLElement).dataset.key);
}
</script>

<style scoped>
.fixed-menu {
  position: fixed;
}
.fixed-menu li {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 22px;
  cursor: pointer;
  opacity: 0.8;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}
.fixed-menu li:hover {
  opacity: 1;
  background-color: white;
}
.fixed-menu li:not(:last-child) {
  margin-bottom: 10px;
}
</style>
