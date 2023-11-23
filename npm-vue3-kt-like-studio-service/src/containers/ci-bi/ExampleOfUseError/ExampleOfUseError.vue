<template>
  <div class="article">
    <CIBITitle id="exampleOfUseError" class="pt-[8rem]"
      >사용 오류 예시</CIBITitle
    >
    <CIBIDesc>
      KT 워드마크는 KT의 시각적 이미지를 형성하는 매우 중요한 요소로서 정확한
      관리가 필요하며, 변형된 사용은 브랜드의 이미지를 왜곡시키거나
      커뮤니케이션의 효과를 악화시킬 우려가 있으므로 활용시 반드시 규정을
      지키도록 한다.
    </CIBIDesc>
    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">마크 사용 오류</h4>
      <ul class="grid grid-cols-4 gap-x-[4rem] mt-[2rem]">
        <li>
          <figure>
            <img
              src="./img/img_list-01.webp"
              alt="단색형에 간격없는 형태 오류"
            />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            단색형에 간격없는 형태 오류
          </p>
        </li>
        <li>
          <figure>
            <img src="./img/img_list-02.webp" alt="임의의 비율로 왜곡 오류" />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            임의의 비율로 왜곡 오류
          </p>
        </li>
        <li>
          <figure>
            <img src="./img/img_list-03.webp" alt="색상 임의로 변경 오류" />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            색상 임의로 변경 오류
          </p>
        </li>
        <li>
          <figure>
            <img src="./img/img_list-04.webp" alt="외곽선으로만 표현 오류" />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            외곽선으로만 표현 오류
          </p>
        </li>
      </ul>
    </div>
    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">배경 적용 오류</h4>
      <ul class="grid grid-cols-4 gap-x-[4rem] mt-[2rem]">
        <li>
          <figure>
            <img
              src="./img/img_list-05.webp"
              alt="배경색에 따른 기본형 적용 오류"
            />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            배경색에 따른 기본형 적용 오류
          </p>
        </li>
        <li>
          <figure>
            <img
              src="./img/img_list-06.webp"
              alt="기타 배경색에 기본형 적용 오류"
            />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            기타 배경색에 기본형 적용 오류
          </p>
        </li>
        <li>
          <figure>
            <img
              src="./img/img_list-07.webp"
              alt="복잡한 이미지 배경 적용 오류"
            />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            복잡한 이미지 배경 적용 오류
          </p>
        </li>
        <li>
          <figure>
            <img
              src="./img/img_list-08.webp"
              alt="복자한 패턴 배경 적용 오류"
            />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            복자한 패턴 배경 적용 오류
          </p>
        </li>
      </ul>
    </div>
    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">특수 표현오류</h4>
      <ul class="grid grid-cols-4 gap-x-[4rem] mt-[2rem]">
        <li>
          <figure>
            <img src="./img/img_list-09.webp" alt="워드마크 테두리 사용 오류" />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            워드마크 테두리 사용 오류
          </p>
        </li>
        <li>
          <figure>
            <img
              src="./img/img_list-10.webp"
              alt="지정된 워드마트 이외의 3D 로고 적용 오류"
            />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            지정된 워드마트 이외의 3D 로고 적용 오류
          </p>
        </li>
        <li>
          <figure>
            <img src="./img/img_list-11.webp" alt="그림자 표현 오류" />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">그림자 표현 오류</p>
        </li>
        <li>
          <figure>
            <img
              src="./img/img_list-12.webp"
              alt="워드마트에 이미지 삽입 오류"
            />
          </figure>
          <p class="mt-[2rem] text-fz-m text-gray-gray-777">
            워드마트에 이미지 삽입 오류
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import CIBIDesc from '@/containers/ci-bi/CIBIDesc.vue';
import CIBITitle from '@/containers/ci-bi/CIBITitle.vue';
</script>

<style scoped></style>
