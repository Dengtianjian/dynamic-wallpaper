<template>
  <ul class="upload-list">
    <li class="upload-item">
      <n-form>
        <n-form-item label="" :show-label="false">
          <n-upload
            accept="image/*"
            :default-upload="false"
            :multiple="false"
            :show-cancel-button="false"
            :show-file-list="false"
            @change="uploadFile"
          >
            <img
              :src="wallpaperForm.fileUrl"
              class="upload-image_cover"
              v-show="wallpaperForm.fileid"
            />
            <n-button block v-show="!wallpaperForm.fileid">上传文件</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item label="描述">
          <n-input
            placeholder="请输入描述"
            v-model:value="wallpaperForm.description"
          ></n-input>
        </n-form-item>
        <n-form-item label="标签">
          <n-input
            placeholder="请输入标签，中文逗号（，）分割"
            v-model:value="wallpaperForm.tags"
          ></n-input>
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            :options="categorites"
            placeholder="请选择所属分类"
          ></n-select>
        </n-form-item>
        <n-form-item :show-label="false">
          <n-button block type="primary" @click="publishWallpaper"
            >发布</n-button
          >
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
  UploadFileInfo,
} from "naive-ui";
import { reactive, ref } from "vue";
import wallpaperApi from "../api/wallpaperApi";
import attachment from "../foundation/attachment";

const categorites: SelectOption[] = [];

const wallpaperForm = reactive<{
  description: string;
  fileid: string;
  fileUrl: string;
  tags: string;
}>({
  description: "",
  fileid: "",
  fileUrl: "",
  tags: "",
});

const fileUploading = ref<boolean>(false);
function uploadFile(file: any) {
  file = file.file.file;

  wallpaperApi
    .uploadWallpaper(file)
    .then(({ fileId }) => {
      wallpaperForm.fileid = fileId;
      wallpaperForm.fileUrl = attachment.genDownloadUrl(fileId);
    })
    .finally(() => {
      fileUploading.value = false;
    });
}

const saving = ref<boolean>(false);
function publishWallpaper() {
  saving.value = true;
  wallpaperApi
    .saveWallpaper(
      wallpaperForm.description,
      wallpaperForm.fileid,
      wallpaperForm.tags,
      "current",
      "admin"
    )
    .then((res) => {
      console.log(res);
    })
    .finally(() => {
      saving.value = false;
    });
}
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
  cursor: pointer;
}
</style>
