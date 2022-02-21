<template>
  <img
    :src="wallpaperForm.fileUrl"
    class="page-background"
    v-show="wallpaperForm.fileUrl"
  />
  <n-form class="publish-form">
    <n-form-item label="" :show-label="false">
      <n-upload
        accept="image/*"
        :default-upload="false"
        :multiple="false"
        :show-cancel-button="false"
        :show-file-list="false"
        :loading="fileUploading"
        @change="uploadFile"
      >
        <section class="upload-image_cover">
          <img :src="wallpaperForm.fileUrl" v-show="wallpaperForm.fileid" />
        </section>
        <section class="upload-image_button" v-show="!wallpaperForm.fileid">
          {{ fileUploading ? "上传中" : "上传文件" }}
        </section>
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
        disabled
      ></n-select>
    </n-form-item>
    <n-form-item label="原作者">
      <n-input
        placeholder="如果是转载内容，请先获取到原作者同意转载后再发布，并且必须填写原作者"
        v-model:value="wallpaperForm.author"
      ></n-input>
    </n-form-item>
    <n-form-item label="来源">
      <n-input
        placeholder="请输入来源"
        v-model:value="wallpaperForm.source"
      ></n-input>
    </n-form-item>
    <n-form-item label="可见性">
      <n-select
        placeholder="请输入选择可见性"
        v-model:value="wallpaperForm.privacy"
      ></n-select>
    </n-form-item>
    <n-form-item :show-label="false">
      <n-button block type="primary" @click="publishWallpaper" :loading="saving"
        >发布</n-button
      >
    </n-form-item>
  </n-form>
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
  useMessage,
} from "naive-ui";
import { reactive, ref } from "vue";
import wallpaperApi from "../api/wallpaperApi";
import attachment from "../foundation/attachment";
const NMessage = useMessage();

const categorites: SelectOption[] = [];

const wallpaperForm = reactive<{
  description: string;
  fileid: string;
  fileUrl: string;
  tags: string;
  source: string;
  author: string;
  privacy: string;
}>({
  description: "",
  fileid: "",
  fileUrl: "",
  tags: "",
  source: "",
  author: "",
  privacy: "",
});

const fileUploading = ref<boolean>(false);
function uploadFile(file: any) {
  if (fileUploading.value) return;
  fileUploading.value = true;
  file = file.file.file;

  wallpaperApi
    .uploadWallpaper(file)
    .then(({ fileId }) => {
      wallpaperForm.fileid = fileId;
      wallpaperForm.fileUrl = attachment.genDownloadUrl(fileId);
      NMessage.success("上传完成");
    })
    .catch(() => {
      NMessage.success("上传失败");
    })
    .finally(() => {
      fileUploading.value = false;
    });
}

const saving = ref<boolean>(false);
function publishWallpaper() {
  if (!wallpaperForm.fileid) {
    return NMessage.warning("请上传图片文件");
  }
  if (!wallpaperForm.fileid) {
    return NMessage.warning("请输入描述");
  }
  if (saving.value) return;
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
      NMessage.success("发布成功");
      wallpaperForm.description = "";
      wallpaperForm.tags = "";
      // wallpaperForm.fileUrl = "";
      wallpaperForm.fileid = "";
    })
    .catch((err) => {
      NMessage.error("发布失败");
    })
    .finally(() => {
      saving.value = false;
    });
}
</script>

<style scoped>
.page-background {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
.publish-form {
  position: relative;
  z-index: 1;
  padding: 10px;
  margin: 20px auto;
  width: 50vw;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-angle);
}
.upload-image_button {
  width: 50vw;
  height: 100px;
  line-height: 100px;
  text-align: center;
  cursor: pointer;
  border: 2px solid #eee;
  border-radius: var(--radius-angle);
}
.upload-image_button:hover {
  background: #eee;
}
.upload-image_cover {
  max-height: 30vh;
  cursor: pointer;
  object-fit: cover;
  overflow: hidden;
  border-radius: 8px;
  transition: opacity 0.15s linear;
}
.upload-image_cover:hover {
  opacity: 0.9;
}
.upload-image_cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
