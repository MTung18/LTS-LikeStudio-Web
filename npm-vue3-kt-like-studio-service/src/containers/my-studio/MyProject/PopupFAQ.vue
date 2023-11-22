<template>
  <PopupLarge
    :is-open="props.isOpen"
    popupTitle="FAQ"
    @close-button="handleClose"
    class="py-[3.2rem] px-[4rem]"
  >
    <h6 class="faq__title">FAQ</h6>
    <ul class="category__list">
      <li
        v-for="category in categories"
        :key="category.id"
        class="category__item"
      >
        <Tabs
          type="withIcon"
          use-icon
          size="small"
          :is-selected="category.isSelected"
          @tab-selected="updateSelectedCategory(category.id)"
        >
          {{ category.category }}</Tabs
        >
      </li>
    </ul>
    <div class="flex p-[2.6rem] mb-[2.4rem] bg-[#f6f6f6]">
      <SearchInput
        v-model="dummyInputValue"
        placeholder="검색어를 입력해주세요"
        size="medium"
        style-type="square"
        color-type="gray"
        class="!max-w-[none] flex-1 mr-[1.4rem]"
      />
      <RoundButton
        component="button"
        color-type="filed"
        size="medium"
        class="mr-[1.4rem]"
        >검색</RoundButton
      >
    </div>
    <div class="list custom-scrollbar">
      <details class="list__item">
        <summary class="item__question-wrap">
          <span class="question__symbol">Q</span>
          <span class="question__title"
            >결제 후 유료 회원으로 전환이 되지 않는 경우</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
                </div>
                <div class="answer__content-file">
                  <FileDownload
                    class-bind="!mt-0 !pb-0"
                    :files="[
                      { id: 0, filename: '라이크 스튜디오 사용 매뉴얼.docx' },
                      { id: 1, filename: '라이크 스튜디오 사용 매뉴얼.pdf' },
                    ]"
                  />
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
            >글자 모양이 다름 : 다운로드 한 이미지와 작업했을 때의 모양이 서로
            다릅니다.</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
      <details class="list__item">
        <summary class="item__question-wrap">
          <span class="question__symbol">Q</span>
          <span class="question__title">화면이 나타나지 않는 오류</span>

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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
                </div>
                <div class="answer__content-file">
                  <FileDownload
                    class-bind="!mt-0 !pb-0"
                    :files="[
                      { id: 0, filename: '라이크 스튜디오 사용 매뉴얼.docx' },
                      { id: 1, filename: '라이크 스튜디오 사용 매뉴얼.pdf' },
                    ]"
                  />
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
            >이미지가 작업한 내용보다 너무 크거나 작게 출력됩니다.</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
      <details class="list__item">
        <summary class="item__question-wrap">
          <span class="question__symbol">Q</span>
          <span class="question__title">작업물의 해상도가 떨어져보여요.</span>

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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
                </div>
                <div class="answer__content-file">
                  <FileDownload
                    class-bind="!mt-0 !pb-0"
                    :files="[
                      { id: 0, filename: '라이크 스튜디오 사용 매뉴얼.docx' },
                      { id: 1, filename: '라이크 스튜디오 사용 매뉴얼.pdf' },
                    ]"
                  />
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
            >몇 시간 전 작업 상태로 돌리고 싶어요.</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
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
            >작업했던 템플릿이 없어졌어요 혹은 다른 템플릿으로 바뀌었어요.</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
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
            >인쇄시 명함, 현수막, 세로배너 길이 맞추기</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
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
            >팀룸 기능 및 팀 작업에 대해 궁금하신가요?</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
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
            >팀룸이나 템플릿에 댓글을 달 수 있나요?</span
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
                    원인은 몇가지가 있을 수 있습니다. 아래의 원인 중 하나일 수
                    있사오니 확인 바랍니다.
                  </p>
                  <ul class="answer__desc-list">
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        1. 글자를 감싸고 있는 영역으로 인하여 자동 줄바꿈이 된
                        경우 해당 증상이 발생할 수 있습니다.
                      </p>
                      <p class="answer__desc-text">
                        이는 자동으로 줄이 바뀐 위치에서 키보드의 엔터를 직접
                        누르시면 해결 됩니다.
                      </p>
                    </li>
                    <li class="answer__desc-item">
                      <p class="answer__desc-title">
                        2. 혹시 크롬 외의 브라우저를 사용하시나요?
                        라이크스튜디오는 크롬 브라우저에 최적화되어 있기에
                        크롬을 사용하셔서 다운로드 해보시기 바랍니다.
                      </p>
                      <p class="answer__desc-text">
                        이러한 조치를 취하여도 문제가 계속 발생할 경우 1:1 문의
                        남겨주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
                </div>
                <div class="answer__content-file">
                  <FileDownload
                    class-bind="!mt-0 !pb-0"
                    :files="[
                      { id: 0, filename: '라이크 스튜디오 사용 매뉴얼.docx' },
                      { id: 1, filename: '라이크 스튜디오 사용 매뉴얼.pdf' },
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <UIButton
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >닫기</UIButton
      >
    </div>
  </PopupLarge>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import FileDownload from '@/components/FileDownload/FileDownload.vue';
import IconButton from '@/components/IconButton/IconButton.vue';
import PopupLarge from '@/components/PopupLarge/PopupLarge.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const dummyInputValue = ref('');
const categories = ref([
  {
    id: 0,
    category: '전체',
    dummyLength: 10,
    isSelected: true,
  },
  {
    id: 1,
    category: '자주 묻는 질문 10',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 2,
    category: '저작권',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 3,
    category: '로그인',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 4,
    category: '팀룸',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 5,
    category: '사용법',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 6,
    category: '다운로드',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 7,
    category: 'PDF 인쇄',
    dummyLength: 0,
    isSelected: false,
  },
  {
    id: 8,
    category: '서비스 오류',
    dummyLength: 0,
    isSelected: false,
  },
]);
const detailsElements = reactive([]);

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};

const handleToggle = (event) => {
  if (event.target.open) {
    detailsElements.value.forEach((otherDetail) => {
      if (otherDetail !== event.target) {
        otherDetail.removeAttribute('open');
      }
    });
  }
};

function updateSelectedCategory(selectedId) {
  categories.value = categories.value.map((category) => ({
    ...category,
    isSelected: category.id === selectedId,
  }));
}

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
.faq__title {
  margin-bottom: 2.4rem;
  font-size: var(--ttl-m);
  font-weight: 700;
}

.category__list {
  display: flex;
  align-items: flex-end;
  gap: 0 2.4rem;
  margin-bottom: 3.2rem;
  font-size: 1.6rem;
  line-height: 2.4rem;
}

.list {
  max-height: 84.2rem;
  overflow-y: auto;
}

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
  flex-grow: 1;
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
