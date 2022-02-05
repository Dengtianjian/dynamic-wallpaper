<template>
  <ul class="upload-list">
    <li class="upload-item" v-for="index in 10" :key="index">
      <n-form>
        <n-form-item label="" :show-label="false">
          <img
            src="https://t7.baidu.com/it/u=4080826490,615918710&fm=193&f=GIF"
            alt=""
            class="upload-image_cover"
          />
          <!-- <n-upload accept="image/*"> 上传</n-upload> -->
        </n-form-item>
        <n-form-item label="描述">
          <n-input placeholder="请输入描述"></n-input>
        </n-form-item>
        <n-form-item label="标签">
          <n-input placeholder="请输入标签，中文逗号（，）分割"></n-input>
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            :options="categorites"
            placeholder="请选择所属分类"
          ></n-select>
        </n-form-item>
      </n-form>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import {
  NUpload,
  NUploadDragger,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  SelectOption,
} from "naive-ui";

const categorites: SelectOption[] = [];
</script>

<style scoped>
.upload-list {
  display: grid;
  grid-template-columns: repeat(4, calc(25% - 10px));
  column-gap: 10px;
  margin: 10px;
}
.upload-image_cover {
  width: 100%;
}
</style>
