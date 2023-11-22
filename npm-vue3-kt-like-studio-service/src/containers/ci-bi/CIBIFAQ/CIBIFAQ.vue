<template>
  <div class="article">
    <CIBITitle id="ciBIFAQ" class="pt-[8rem]">주요 질문사항 모음</CIBITitle>
    <div class="list">
      <details class="list__item">
        <summary class="item__question-wrap">
          <span class="question__symbol">Q</span>
          <span class="question__title"
            >대표 컬러 Red 가이드가 적용되는 범위는 어디까지인가요?</span
          >

          <IconButton
            class-bind="question__icon"
            icon-name="chevron_b"
            size="small"
            type="outlined"
            component="button"
          />
        </summary>
        <div class="item__answer-wrap">
          <div class="answer__wrap">
            <div class="answer__area">
              <div class="answer__symbol">A</div>
              <div class="answer__content">
                <div class="answer__content-text">
                  <p class="answer__title">
                    KT의 이미지를 대표하는 모든 대고객 커뮤니케이션 표현물에
                    적용됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
      <details class="list__item">
        <summary class="item__question-wrap">
          <span class="question__symbol">Q</span>
          <span class="question__title"
            >모든 표현물을 Red 색상으로만 제작해야 하나요?</span
          >

          <IconButton
            class-bind="question__icon"
            icon-name="chevron_b"
            size="small"
            type="outlined"
            component="button"
          />
        </summary>
        <div class="item__answer-wrap">
          <div class="answer__wrap">
            <div class="answer__area">
              <div class="answer__symbol">A</div>
              <div class="answer__content">
                <div class="answer__content-text">
                  <p class="answer__title">
                    일관된 이미지로 고객과 소통하기 위해 대표 컬러 Red와 보조
                    컬러 Gray 계열, White를 기본으로 사용하며, p13 컬러 비율에
                    소개되어 있는 것처럼 다양하게 활용 가능하지만 Red 20% 이내의
                    Type 1, 2를 권장합니다. 대표 컬러 Red는 고객에게 알리고 싶은
                    가장 중요한 문구, 아이콘, 이미지 등 적재적소에 활용하며,
                    이를 통해 KT의 디자인 표현물이 전체적으로 밝고 경쾌한
                    이미지로 노출될 수 있도록 합니다.
                    <span class="block text-gray-gray-444 font-normal"
                      >※ Chapter 3의 다양한 활용 예제를 참고하여 주세요.</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
      <details class="list__item">
        <summary class="item__question-wrap">
          <span class="question__symbol">Q</span>
          <span class="question__title"
            >인쇄 컬러와 웹/앱 스크린 컬러가 다른가요?</span
          >

          <IconButton
            class-bind="question__icon"
            icon-name="chevron_b"
            size="small"
            type="outlined"
            component="button"
          />
        </summary>
        <div class="item__answer-wrap">
          <div class="answer__wrap">
            <div class="answer__area">
              <div class="answer__symbol">A</div>
              <div class="answer__content">
                <div class="answer__content-text">
                  <p class="answer__title">
                    대표 컬러 Red는 하나지만, 인쇄 or 디지털 환경에 따라 컬러
                    값이 세부적으로 지정되어 있습니다. 반드시 수록되어 있는 컬러
                    값을 정확하게 활용 필요하며, 매체에 맞는 컬러 파일을
                    사용해야 합니다.
                    <span class="block text-gray-gray-444 font-normal"
                      >※ 주의: 인쇄용 CMYK를 웹/앱용 RGB 컬러에 사용 금지</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
      <details class="list__item">
        <summary class="item__question-wrap">
          <span class="question__symbol">Q</span>
          <span class="question__title"
            >협력사가 대표 컬러를 사용하려고 하는데 어떤 절차를 거치면
            되나요?</span
          >

          <IconButton
            class-bind="question__icon"
            icon-name="chevron_b"
            size="small"
            type="outlined"
            component="button"
          />
        </summary>
        <div class="item__answer-wrap">
          <div class="answer__wrap">
            <div class="answer__area">
              <div class="answer__symbol">A</div>
              <div class="answer__content">
                <div class="answer__content-text">
                  <p class="answer__title">
                    CI/BI Guide에서 다운로드 받은 가이드(PDF) , 활용파일 (ai,
                    PNG 등)을 전달해 주세요. 단, 제작된 디자인 표현물은 개시 전
                    반드시 CI/BI Guide 게시판(지식iN) 통해 자문 및 검수를 거쳐
                    주시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from 'vue';

import IconButton from '@/components/IconButton/IconButton.vue';
import CIBITitle from '@/containers/ci-bi/CIBITitle.vue';

const detailsElements = reactive([]);
const handleToggle = (event) => {
  if (event.target.open) {
    detailsElements.value.forEach((otherDetail) => {
      if (otherDetail !== event.target) {
        otherDetail.removeAttribute('open');
      }
    });
  }
};

onMounted(() => {
  detailsElements.value = document.querySelectorAll('details');
  detailsElements.value.forEach((detail) => {
    detail.addEventListener('toggle', handleToggle);
  });
});

onUnmounted(() => {
  detailsElements.value.forEach((detail) => {
    detail.removeEventListener('toggle', handleToggle);
  });
});
</script>

<style scoped>
.list__item {
  border-bottom: 1px solid var(--color-gray-ddd);
}

.item__question-wrap {
  display: flex;
  align-items: center;
  padding: 3rem 0;
  cursor: pointer;
}

.question__symbol {
  margin-right: 1rem;
  font-size: var(--fz-xl);
  font-weight: 700;
}

.question__title {
  font-size: var(--fz-l);
  font-weight: 700;
}

.question__icon {
  margin-left: auto;
}

.list__item[open] .question__icon {
  transform: rotate(180deg);
}

.answer__wrap {
  padding-bottom: 3rem;
}

.answer__area {
  display: flex;
  gap: 0 1rem;
  padding: 2.4rem;
  background-color: #f6f6f6;
  border-radius: 2.4rem;
}

.answer__symbol {
  font-size: var(--fz-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.answer__content {
  min-width: 0;
  flex: 1;
  padding-right: 2.4rem;
}

.answer__content-text {
  font-size: var(--fz-l);
}

.answer__title {
  font-weight: 700;
}

.answer__desc-list {
  margin-top: 4rem;
}

.answer__desc-item + .answer__desc-item {
  margin-top: 4rem;
}

.answer__desc-title {
  font-weight: 700;
}

.answer__desc-text {
  font-weight: 400;
  color: var(--color-gray-444);
}

.answer__content-file {
  margin-top: 3.6rem;
  border-top: 1px solid #ead9ff;
}
</style>
