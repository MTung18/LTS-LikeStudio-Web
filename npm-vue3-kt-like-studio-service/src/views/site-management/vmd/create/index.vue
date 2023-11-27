<template>
  <TemplateEdit title="매장 VMD 관리">
    <template #body>
      <div class="flex gap-x-[8rem]">
        <TemplateEditTextFields
          label="카테고리"
          required
          class-bind="relative before:absolute before:right-[-4rem] before:w-[1px] before:h-[4.6rem] before:bg-gray-gray-ddd before:content-['']"
        >
          <DropdownSelect :selectList="categories" :dselectefault="optionList.defaultSelect" @select="handleSelect"  />
        </TemplateEditTextFields>
        <TemplateEditTextFields
          label="노출"
          required
          class-bind="items-center leading-none !border-b-0"
        >
          <Switch @someEvent="changeShow" />
        </TemplateEditTextFields>
      </div>
      <TemplateEditTextFields
        :fields-id="inputId"
        label="제목"
        required
        v-model="inputRef"
      >
        <TextFields
          v-bind="$attrs"
          :input-id="inputId"
          v-model="vmdDetail.title"
          size="medium"
          placeholder="제목 입력"
          class-bind="w-full"
        />
      </TemplateEditTextFields>
      <TemplateEditTextFields
        label="첨부파일"
        class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd"
      >
        <TemplateEditFileFields
          @file-upload="handleFileUpload"
          @file-remove="handleFileRemove"
          :files="listFile"
          file-caption-title="첨부파일은 최대 50개, 1개 파일당 100MB 이하의 아래 확장자만 업로드 가능합니다."
          fileMaxLength="50"
          :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg, jpeg , png , gif',
            '디자인 파일 : ai, psd',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
            '음성 파일 : mp3, wma',
          ]"
        />
      </TemplateEditTextFields>
    </template>

    <template #foot>
      <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
        <UIButton
          component="button"
          color-type="outlined"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="handleCreateCancel"
          >취소</UIButton
        >
        <UIButton
          component="button"
          color-type="primary"
          size="large"
          class-bind="!min-w-[14rem]"
          @click="handleCreateSubmit"
          >등록</UIButton
        >
      </div>
    </template>
  </TemplateEdit>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import customToast from '@/untils/custom_toast';

const inputId = uuid();
const inputRef = ref('');
import { categoryStore } from '../../../../stores/categoryStore';
import { vmdStore } from '../../../../stores/vmdStore';
import { vmdFileStore } from '@/stores/vmdFileStore';
import { storeToRefs } from 'pinia';
import utils from '@/untils/utils';

const store = vmdStore();
const cateStore = categoryStore();
const vmdFileStores = vmdFileStore();
const { responseAddVmd } = storeToRefs(store);
const { listCategory } = storeToRefs(cateStore);
const { responseUploadFile } = storeToRefs(vmdFileStores);
const router = useRouter();

const categories = ref([]);
const categoryId = ref();
const vmdDetail = ref({});
const showValue = ref(0);
const functionType = 3;
const listFile = ref([]);
const listFileSave = ref([]);
const vmdData = ref({});

const ARCHIVE_FILES = ['zip', '7z', 'alz', 'egg', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'wmv', 'asf', 'flv', 'mov', 'mpeg'];
const maxSizeFile = 100;

const optionList = {
  defaultSelect: '전체',
};

const handleSelect = async (selectedOption) => {
  categoryId.value = selectedOption.id
};

function changeShow(status) {
  showValue.value = status ? 1 : 0
}

const getListCategory = async () => {
  await cateStore.getListCategory(functionType)
  categories.value = listCategory.value;
}

const dummyfiles = [
  {
    id: 0,
    filename: 'screenshot_5907111102.png',
  },
  {
    id: 0,
    filename: 'screenshot_02352786929249.png',
  },
];

const handleFileUpload = async (file) => {
  const sizeInMB = file.size / (1024 * 1024);
  const typeFile = utils.getFileType(file.name);

  if (sizeInMB > maxSizeFile) {
    customToast.error('File size should not exceed 100MB');
    return;
  }
  if (!ARCHIVE_FILES.includes(typeFile)) {
    customToast.error('This file type is not allowed for upload');
    return;
  }
  if (listFile.value.size == 50) {
    customToast.error('Maximum of 10 files');
    return;
  }
  listFile.value.push({
    oriFileName: file.name,
    uniqFileName: null,
  });
  listFileSave.value.push(file);
};

const handleFileRemove = async (index) => {
  listFile.value.splice(index, 1);
};

const handleCreateCancel = () => {
  console.log('취소');
  router.push(`/site-management/vmd`)
};

const handleCreateSubmit = async () => {
  try {
    if (listFileSave.value.length) {
      const formData = new FormData();
      for (let i = 0; i < listFileSave.value.length; i++) {
        formData.append('files', listFileSave.value[i])
      }
      await vmdFileStores.uploadFile(formData)
      if (responseUploadFile.value.statusCode !== 1) {
        customToast.error('Error upload file.')
        return
      }
      const filePaths = responseUploadFile.value.data.map(item => item.uniqFileName);
      listFile.value.forEach(item => {
        if (item.uniqFileName !== null) {
          filePaths.push(item.uniqFileName)
        }
      });

      listFile.value = listFile.value.map((file, index) => ({
        oriFileName: file.oriFileName,
        createUser: 2,
        uniqFileName: filePaths[index],
      }));

      vmdData.value = {
        vmd: {
          category: categoryId.value,
          title: vmdDetail.value.title,
          createUser: 1,
          show: showValue.value,
          views: 0
        },
        vmdFileList: listFile.value,
      }
    } else {
      vmdData.value = {
        vmd: {
          category: categoryId.value,
          title: vmdDetail.value.title,
          createUser: 1,
          show: showValue.value,
          views: 0
        },
        vmdFileList: [],
      }
    }
    await store.addVmd(vmdData.value);
    if (responseAddVmd.value.statusCode === 1) {
      customToast.success('Successful create Vmd.')
      router.push(`/site-management/vmd`)
    } else {
      if(responseAddVmd.value.errorMessages !== '' && !responseAddVmd.value.errorMessages !== null){
        customToast.error(responseAddVmd.value.errorMessages);
      }else{
        customToast.error('Error create Vmd.');
      }

    }

  } catch (error) {
    console.error('Error during create:', error);
    customToast.error('An error occurred during create.');
  }
  // console.log('등록');
  // customToast.success('글을 등록했습니다.');
  // customToast.error('에러 메세지');
};

onMounted(async () => {
  await getListCategory()
})
</script>

<style scoped>
.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
