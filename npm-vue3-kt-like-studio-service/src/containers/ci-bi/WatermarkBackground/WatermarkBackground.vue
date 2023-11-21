<template>
  <div class="article">
    <CIBITitle id="watermarkBackground" class="pt-[8rem]"
      >워드마크 배경색 규정</CIBITitle
    >
    <CIBIDesc>
      KT 워드마크의 색상표현을 White/Black 배경에 사용하는 것을 최우선 원칙으로
      하지만 불가피한 경우 예시와 같이 기타 배경색에 적용할 수 있다. 다만,
      어떠한 배경색에도 항상 명확하게 표현되어야 한다. 예시에 포함되어 있지 않은
      배경색은 명도, 채도, 색상 등을 고려하여 가장 유사한 색상을 적용하고 특수한
      상황이 생길 때에는 반드시 담당 부서와 협의 후 사용한다.
    </CIBIDesc>
    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">워드마크 기본형</h4>
      <p class="mt-[1rem] text-fz-m text-gray-gray-777">
        White / Black<br />
        배경색 규정 ※ 워드마크의 기본형의 가시성 확보를 위해 명도 30% 이하와 90%
        이상일 경우에만 사용이 가능하다. Black 명도대비 40%에서 80% 사이의
        배경은 KT 워드마크의 색상표현에 효과적이지 않으므로 사용을 제한한다.
      </p>
      <figure class="mt-[2rem]">
        <img src="./img/img_list-01.webp" alt="워드마크 기본형" />
      </figure>
    </div>

    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">워드마크 단색형</h4>
      <p class="mt-[1rem] text-fz-m text-gray-gray-777">
        White / Balck 배경색 규정
      </p>
      <figure class="mt-[2rem]">
        <img src="./img/img_list-02.webp" alt="워드마크 기본형" />
      </figure>
    </div>

    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">워드마크 단색형</h4>
      <p class="mt-[1rem] text-fz-m text-gray-gray-777">
        기타 배경색 규정 ※ 단색형이 경우 배경색에서 명도 10% 이하일 경우에는
        D.Gray 단색을 사용하고, 명도 10% 초과일 때에는 White 단색을 사용한다.
      </p>
      <figure class="mt-[2rem]">
        <img src="./img/img_list-03.webp" alt="워드마크 기본형" />
      </figure>
    </div>

    <div class="mt-[4rem]">
      <p class="mt-[1rem] text-fz-m text-gray-gray-777">
        ※ 복잡한 배경 이미지 위에 사용할 시에는 반드시 단색형 White를 사용한다.
      </p>
      <figure class="mt-[2rem]">
        <img src="./img/img_list-04.webp" alt="워드마크 기본형" />
      </figure>
    </div>
  </div>
</template>

<script setup>
import CIBIDesc from '@/containers/ci-bi/CIBIDesc.vue';
import CIBITitle from '@/containers/ci-bi/CIBITitle.vue';
</script>

<style scoped></style>
