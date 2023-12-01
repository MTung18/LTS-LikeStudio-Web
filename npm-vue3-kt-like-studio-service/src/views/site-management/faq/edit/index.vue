<template>
  <TemplateEdit title="FAQ 관리">
    <template #body>
      <div class="flex gap-x-[8rem]">
        <TemplateEditTextFields label="카테고리" required
          class-bind="relative before:absolute before:right-[-4rem] before:w-[1px] before:h-[4.6rem] before:bg-gray-gray-ddd before:content-['']">
          <DropdownSelect :selectList="categories" :selected="optionList.defaultSelect" @select="handleSelect"
            :firstOption="faqDetail.category"></DropdownSelect>
        </TemplateEditTextFields>
        <TemplateEditTextFields label="노출" required class-bind="items-center leading-none !border-b-0">
          <Switch :toggle="showValue" @someEvent="changeShow" />
        </TemplateEditTextFields>
      </div>
      <TemplateEditTextFields :fields-id="inputId" label="제목" required>
        <TextFields v-bind="$attrs" :input-id="inputId" v-model="faqDetail.title" size="medium" placeholder="제목 입력"
          class-bind="w-full" />
      </TemplateEditTextFields>
      <TemplateEditTextFields label="내용" required>
        <CKEditor v-model="faqDetail.content"></CKEditor>
      </TemplateEditTextFields>
      <TemplateEditTextFields label="첨부파일" class-bind="pt-[3.2rem] border-t-[1px] border-t-gray-gray-ddd">
        <TemplateEditFileFields @file-upload="handleFileUpload" @file-remove="handleFileRemove" :files="listFile"
          file-caption-title="첨부파일은 최대 10개, 1개 파일당 50MB 이하의 아래 확장자만 업로드 가능합니다." file-max-length="10" :file-format="[
            '압축 파일 : zip, 7z, alz, egg',
            '문서 파일 : xls, xlsx, ppt, pptx, doc, docx, pdf',
            '이미지 파일 : jpg , jpeg , png , gif',
            '영상 파일 : mp4, wmv, asf , flv, mov, mpeg',
          ]" />
      </TemplateEditTextFields>

      <TemplateEditInfo :hits="faqDetail.views" :last-modified-date="faqDetail.editDate"
        :modifier="faqDetail.editUserName" :modifier-position="faqDetail.editorPosition"
        :created-date="faqDetail.createDate" :writer="faqDetail.createUserName"
        :writer-position="faqDetail.createrPosition" />
    </template>

    <template #foot>
      <div class="flex mt-[6rem] justify-center gap-x-[1rem]">
        <UIButton component="button" color-type="standard" size="large" class-bind="!min-w-[14rem]"
          @click="handleEditDelete">삭제</UIButton>
        <UIButton component="button" color-type="outlined" size="large" class-bind="!min-w-[14rem] !ml-auto"
          @click="handleEditToList">목록</UIButton>
        <UIButton component="button" color-type="primary" size="large" class-bind="!min-w-[14rem]" @click="handleEdit">수정
        </UIButton>
      </div>
    </template>
  </TemplateEdit>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEdit from '@/components/TemplateEdit/TemplateEdit.vue';
import TemplateEditFileFields from '@/components/TemplateEditFileFields/TemplateEditFileFields.vue';
import TemplateEditInfo from '@/components/TemplateEditInfo/TemplateEditInfo.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import customToast from '@/untils/custom_toast';
import CKEditor from '@/components/CKEditor/CKEditor.vue';

import { categoryStore } from '../../../../stores/categoryStore';
import { faqStore } from '../../../../stores/faqStore';
import { fileManagerStore } from '@/stores/fileManagerStore';
import { storeToRefs } from 'pinia';
import utils from '@/untils/utils';

const store = faqStore();
const cateStore = categoryStore();
const fileStore = fileManagerStore();
const { faq, responseEditFaq } = storeToRefs(store);
const { listCategory } = storeToRefs(cateStore);
const { listOfFile, responseUploadFile } = storeToRefs(fileStore);

const router = useRouter();
const route = useRoute();
const inputId = uuid();

const categories = ref([]);
const categoryId = ref();
const faqId = ref();
const faqDetail = ref({});
const functionType = 1;
const ARCHIVE_FILES = ['zip', '7z', 'alz', 'egg', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'wmv', 'asf', 'flv', 'mov', 'mpeg'];
const maxSizeFile = 50;
const listFile = ref([]);

const showValue = ref()
const listFileSave = ref([])

const optionList = {
  defaultSelect: '전체',
};

const handleSelect = async (selectedOption) => {
  categoryId.value = selectedOption.id
};

const getListCategory = async () => {
  await cateStore.getListCategory(functionType)
  categories.value = listCategory.value;
}

async function gitListFile(functionType, titleId) {
  await fileStore.getListFile(functionType, titleId)
  listFile.value = listOfFile.value;
}

const handleFileUpload = (file) => {
  const sizeInMB = file.size / (1024 * 1024);
  const typeFile = utils.getFileType(file.name);

  if (sizeInMB > maxSizeFile) {
    customToast.error('File size must be no more than 50MB.');
    return;
  }
  if (!ARCHIVE_FILES.includes(typeFile)) {
    customToast.error('This file type is not allowed for upload.');
    return;
  }
  if (listFile.value.length == 10) {
    customToast.error('Maximum of 10 files.');
    return;
  }
  listFile.value.push({
    oriFileName: file.name,
    uniqFileName: null,
  });
  listFileSave.value.push(file)
};

const handleFileRemove = async (index) => {
  listFile.value.splice(index, 1)
};

const handleEditDelete = async () => {
  if (window.confirm('Are you sure you want to delete?')) {
    await store.deleteFaq(faqId.value)
    router.push(`/site-management/faq`)
    customToast.success('Successfully delete Faq')
  }
};

const handleEditToList = () => {
  console.log('목록');
  router.push('/site-management/faq');
};

const faqData = ref({})
const updatedFileManagerList = ref([])
const handleEdit = async () => {
  try {
    if (listFileSave.value.length) {
      const formData = new FormData();
      for (let i = 0; i < listFileSave.value.length; i++) {
        formData.append('files', listFileSave.value[i])
      }
      await fileStore.uploadFile(formData)
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

      updatedFileManagerList.value = listFile.value.map((file, index) => ({
        oriFileName: file.oriFileName,
        createUser: 2,
        uniqFileName: filePaths[index],
      }));
    } else {
      if (listFile.value.length > 0) {
        const filePaths = listFile.value.map(item => item.uniqFileName);

        updatedFileManagerList.value = listFile.value.map((file, index) => ({
          oriFileName: file.oriFileName,
          createUser: 2,
          uniqFileName: filePaths[index],
        }));
      } else {
        updatedFileManagerList.value = [];
      }
    }
    faqData.value = {
      faq: {
        id: faqId.value,
        category: categoryId.value || faqDetail.value.category,
        title: faqDetail.value.title,
        content: faqDetail.value.content,
        createUser: faqDetail.value.createUser,
        editUser: 2,
        show: showValue.value,
      },
      fileManagerList: updatedFileManagerList.value,
    }

    await store.updateFaq(faqData.value);

    if (responseEditFaq.value.statusCode === 1) {
      customToast.success('Successful update Notice.')
      router.push(`/site-management/faq`)
    } else {
      customToast.error(responseEditFaq.value.errorMessages)
    }
  } catch (error) {
    customToast.error('An error occurred during update.');
  }
};

function changeShow(status) {
  showValue.value = status ? 1 : 0
}

async function getFaqId(faqId) {
  await store.getFaqById(faqId)
  faqDetail.value = faq.value
  showValue.value = faqDetail.value.show
}

onMounted(async () => {
  faqId.value = route.params.id
  await getListCategory()
  await getFaqId(faqId.value)
  await gitListFile(functionType, faqId.value)
})
</script>

<style scoped>
.detail-row-col--2 {
  display: flex;
  gap: 0 8rem;
}
</style>
