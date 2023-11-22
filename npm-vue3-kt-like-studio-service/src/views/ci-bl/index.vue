<template>
  <div class="ci-bi">
    <h2 class="page__title">KT CI/BI 가이드</h2>
    <div class="ci-bi__download">
      <UIButton
        @click="handleDownload"
        component="button"
        color-type="primary"
        size="big"
        isIcon
      >
        KT CI/BI 디자인 가이드
        <Icons
          icon-name="download"
          icon-color="var(--color-neutrals-white-100)"
        />
      </UIButton>
    </div>
    <div class="ci-bi__wrap">
      <CIBISideBar />
      <div class="content">
        <Watermark
          class="pb-[16rem] border-b-[1px] border-solid border-gray-gray-ddd"
        />
        <WatermarkColor
          class="py-[8rem] border-b-[1px] border-solid border-gray-gray-ddd"
        />
        <WatermarkBackground
          class="py-[8rem] border-b-[1px] border-solid border-gray-gray-ddd"
        />
        <ExampleOfUseError
          class="py-[8rem] border-b-[1px] border-solid border-gray-gray-ddd"
        />
        <KTServiceCategory
          class="py-[8rem] border-b-[1px] border-solid border-gray-gray-ddd"
        />
        <KTSpaceCategory
          class="py-[8rem] border-b-[1px] border-solid border-gray-gray-ddd"
        />
        <CIBIRegulation
          class="py-[8rem] border-b-[1px] border-solid border-gray-gray-ddd"
        />

        <CIBIFAQ class="pt-[8rem]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CIBIGuideFile from '@/assets/KT_CI_BI_Design_Guidelines_V6.0.pdf';
import Icons from '@/components/Icons/Icons.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import CIBIFAQ from '@/containers/ci-bi/CIBIFAQ/CIBIFAQ.vue';
import CIBIRegulation from '@/containers/ci-bi/CIBIRegulation/CIBIRegulation.vue';
import CIBISideBar from '@/containers/ci-bi/CIBISideBar.vue';
import ExampleOfUseError from '@/containers/ci-bi/ExampleOfUseError/ExampleOfUseError.vue';
import KTServiceCategory from '@/containers/ci-bi/KTServiceCategory/KTServiceCategory.vue';
import KTSpaceCategory from '@/containers/ci-bi/KTSpaceCategory/KTSpaceCategory.vue';
import Watermark from '@/containers/ci-bi/Watermark/Watermark.vue';
import WatermarkBackground from '@/containers/ci-bi/WatermarkBackground/WatermarkBackground.vue';
import WatermarkColor from '@/containers/ci-bi/WatermarkColor/WatermarkColor.vue';

const handleDownload = () => {
  const url = CIBIGuideFile;
  const link = document.createElement('a');
  link.href = url;
  console.log('url', url);
  link.setAttribute('download', 'KT_CI_BI_Design_Guidelines_V6.0');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.ci-bi {
  padding-top: 7.2rem;
  padding-bottom: 19rem;
}

.ci-bi__download {
  margin-top: 4rem;
  text-align: center;
}

.page__title {
  text-align: center;
  font-size: var(--ttl-xl);
  font-weight: 700;
}

.ci-bi__wrap {
  max-width: 1622px;
  display: flex;
  gap: 0 3rem;
  padding: 0 8rem;
}

.content {
  min-width: 0;
  flex: 1;
}
</style>
