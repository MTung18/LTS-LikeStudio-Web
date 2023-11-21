<template>
  <div class="article">
    <CIBITitle id="ciBIRegulation" class="pt-[8rem]"
      >CI/BI 관련 규정 안내</CIBITitle
    >
    <CIBIDesc>
      사업부서별로 자체 제작한 심볼/상징/캐릭터는 통일되고 일관된 회사 Identity
      방향성에 저해되므로 사용이 불가하거나 지양하며, KT 브랜드를 사용하지 않는
      개별 브랜드에는 별도로 운영 가능하나 IMC담당과 협의하도록 한다.
    </CIBIDesc>
    <figure class="mt-[6.1rem]">
      <img src="./img/img_list-01.webp" alt="규정 안내" />
    </figure>
    <div class="mt-[6.1rem]">
      <h4 class="text-ttl-s font-bold">[참고] 마크 유형 예시</h4>
      <div class="grid grid-cols-2 gap-x-[3.1rem] mt-[2rem]">
        <div>
          <div
            class="grid grid-cols-2 py-[2.4rem] border-t-[1px] border-b-[1px] border-t-neutrals-black border-b-gray-gray-ddd text-center"
          >
            <div class="text-fz-m font-bold">로고타입</div>
            <div class="text-fz-m font-bold">워드마크</div>
          </div>
          <div class="grid grid-cols-2 h-[18.2rem] text-center">
            <figure class="flex justify-center items-center">
              <img src="./img/img_list-02.webp" alt="naver panasonic" />
            </figure>
            <figure class="flex justify-center items-center">
              <img src="./img/img_list-03.webp" alt="kt IBM" />
            </figure>
          </div>
          <div
            class="py-[2.4rem] text-center border-t-[1px] border-b-[1px] border-t-gray-gray-ddd border-b-gray-gray-ddd"
          >
            <strong class="text-ttl-s font-bold text-primary">권장</strong>
          </div>
        </div>

        <div>
          <div
            class="grid grid-cols-2 py-[2.4rem] border-t-[1px] border-b-[1px] border-t-neutrals-black border-b-gray-gray-ddd text-center"
          >
            <div class="text-fz-m font-bold">로고타입</div>
            <div class="text-fz-m font-bold">워드마크</div>
          </div>
          <div class="grid grid-cols-2 h-[18.2rem] text-center">
            <figure class="flex justify-center items-center">
              <img src="./img/img_list-04.webp" alt="벤츠 애플 로고" />
            </figure>
            <figure class="flex justify-center items-center">
              <img src="./img/img_list-05.webp" alt="skt cj 로고" />
            </figure>
          </div>
          <div
            class="py-[2.4rem] text-center border-t-[1px] border-b-[1px] border-t-gray-gray-ddd border-b-gray-gray-ddd"
          >
            <strong class="text-ttl-s font-bold">지양</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CIBIDesc from '@/containers/ci-bi/CIBIDesc.vue';
import CIBITitle from '@/containers/ci-bi/CIBITitle.vue';
</script>

<style scoped></style>
