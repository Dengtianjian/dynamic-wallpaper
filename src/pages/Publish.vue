<template>
  <img :src="wallpaperForm.previewURL" class="page-background" v-show="wallpaperForm.previewURL" />
  <n-form class="publish-form">
    <n-form-item label="" :show-label="false">
      <n-upload accept="image/*" :multiple="false" :show-cancel-button="false" :show-file-list="false"
        :loading="fileUploading" :custom-request="uploadFile">
        <section class="upload-image_cover">
          <img :src="wallpaperForm.previewURL" v-show="wallpaperForm.fileKey" />
        </section>
        <section class="upload-image_button" v-show="!wallpaperForm.fileKey">
          {{ fileUploading ? "上传中" : "上传文件" }}
        </section>
      </n-upload>
    </n-form-item>
    <n-form-item label="描述" required>
      <n-input placeholder="请输入描述" v-model:value="wallpaperForm.description"></n-input>
    </n-form-item>
    <n-form-item label="标签">
      <n-input placeholder="请输入标签，中文逗号（，）分割" v-model:value="wallpaperForm.tags"></n-input>
    </n-form-item>
    <n-form-item label="分类">
      <n-select :options="categorites" placeholder="请选择所属分类" disabled></n-select>
    </n-form-item>
    <n-form-item label="原作者">
      <n-input placeholder="如果是转载内容，请先获取到原作者同意转载后再发布，并且必须填写原作者" v-model:value="wallpaperForm.author"></n-input>
    </n-form-item>
    <n-form-item label="来源">
      <n-input placeholder="请输入来源" v-model:value="wallpaperForm.source"></n-input>
    </n-form-item>
    <n-form-item label="可见性">
      <n-select placeholder="请输入选择可见性" v-model:value="wallpaperForm.privacy" :options="privacyOptions"></n-select>
    </n-form-item>
    <n-button block type="primary" @click="publishWallpaper" :loading="saving || fileUploading">
      {{ fileUploading ? '上传中' : '发布' }}
    </n-button>
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
  UploadCustomRequestOptions,
} from "naive-ui";
import { reactive, ref } from "vue";
import WallpapersApi from "../api/WallpapersApi";
import RNaiveUpload from "../ruyijs/Vue/components/Naive/RNaiveUpload.vue";
import FilesApi from "../api/FilesApi";

const NMessage = useMessage();

const categorites: SelectOption[] = [];
const privacyOptions: SelectOption[] = [
  {
    value: "public",
    label: "互联网可见",
  },
  {
    value: "private",
    label: "仅自己可见",
  },
];

const wallpaperForm = reactive<{
  description: string;
  fileKey: string;
  previewURL: string;
  tags: string;
  source: string;
  author: string;
  privacy: string;
}>({
  description: "",
  fileKey: "",
  previewURL: "",
  tags: "",
  source: "",
  author: "",
  privacy: "public",
});

const fileUploading = ref<boolean>(false);
function uploadFile({
  file,
  onFinish,
  onError
}: UploadCustomRequestOptions) {
  if (file.file) {
    if (fileUploading.value) return;
    fileUploading.value = true;

    FilesApi.getAuth("post", {
      sourceFileName: file.name,
      filePath: "wallpapers",
      fileSize: file.file.size
    }).then(UploadAuth => {
      for (const key in UploadAuth.auth.local) {
        // @ts-ignore
        FilesApi.query(key, UploadAuth.auth.local[key]);
      }
      return FilesApi.uploadFile(UploadAuth.key, file.file).then(res => {
        wallpaperForm.fileKey = res.key;
        wallpaperForm.previewURL = res.transferPreviewURL;
      }).catch(err => {
        NMessage.error(err.message ?? "上传文件失败，请稍后重试");
        onError();
      });
    }).catch(err => {
      NMessage.error(err.message ?? "获取文件上传授权失败，请稍后重试");
      onError();
    }).finally(() => {
      fileUploading.value = false;
      onFinish();
    });
  } else {
    NMessage.error("请上传文件");
    onError();
  }
}

const saving = ref<boolean>(false);
function publishWallpaper() {
  if (!wallpaperForm.fileKey) {
    return NMessage.warning("请上传图片文件");
  }
  if (!wallpaperForm.fileKey) {
    return NMessage.warning("请输入描述");
  }
  if (saving.value) return;
  saving.value = true;
  WallpapersApi
    .saveWallpaper(
      wallpaperForm.description,
      wallpaperForm.fileKey,
      wallpaperForm.tags,
      "current",
      "admin",
      wallpaperForm.privacy
    )
    .then((res) => {
      NMessage.success("发布成功");
      wallpaperForm.description = "";
      wallpaperForm.tags = "";
      // wallpaperForm.previewURL = "";
      wallpaperForm.fileKey = "";
      wallpaperForm.source = "";
      wallpaperForm.author = "";
      wallpaperForm.privacy = "public";
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
  min-width: 350px;
  max-width: 800px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: var(--radius-angle);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.publish-form>>>.n-upload-trigger {
  width: 100%;
}

.upload-image_button {
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
