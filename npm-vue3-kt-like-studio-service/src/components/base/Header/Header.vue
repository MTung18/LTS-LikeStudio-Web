<template>
  <header class="header">
    <div ref="headerInnerRef" class="header__inner">
      <h1>
        <p class="visually--hidden">Like studio</p>
        <RouterLink to="/" class="header__logo">
          <IconLogo />
        </RouterLink>
      </h1>
      <nav class="header__nav-wrap">
        <ul class="header__nav-list">
          <li
            class="header__nav-item"
            :class="oneDepthPathName === 'template' && 'is-active'"
          >
            <RouterLink to="/template" class="header__nav-item-inner">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">템플릿</div>
            </RouterLink>
          </li>
          <li
            class="header__nav-item"
            :class="oneDepthPathName === 'gallery' && 'is-active'"
          >
            <RouterLink to="/gallery" class="header__nav-item-inner">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">갤러리</div>
            </RouterLink>
          </li>
          <li
            class="header__nav-item"
            :class="oneDepthPathName === 'vmd' && 'is-active'"
          >
            <RouterLink
              to="/vmd"
              class="header__nav-item-inner"
              role="button"
              tabindex="0"
            >
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">매장 VMD</div>
            </RouterLink>
          </li>
          <li
            class="header__nav-item"
            :class="oneDepthPathName === 'customer-service' && 'is-active'"
          >
            <div class="header__nav-item-inner" role="button" tabindex="0">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">고객센터</div>
            </div>
            <div class="header__two-depth-wrap">
              <ul class="header__two-depth-list">
                <li class="header__two-depth-item">
                  <RouterLink to="/customer-service/announcements"
                    >공지사항</RouterLink
                  >
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/customer-service/faq">FAQ</RouterLink>
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/customer-service/inquiries"
                    >1:1 문의</RouterLink
                  >
                </li>
              </ul>
            </div>
          </li>
          <li
            class="header__nav-item"
            :class="oneDepthPathName === 'site-management' && 'is-active'"
          >
            <div class="header__nav-item-inner" role="button" tabindex="0">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">사이트 관리</div>
            </div>
            <div class="header__two-depth-wrap">
              <ul class="header__two-depth-list">
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/template"
                    >템플릿 관리</RouterLink
                  >
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/gallery"
                    >갤러리 관리</RouterLink
                  >
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/asset">에셋 관리</RouterLink>
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/vmd"
                    >매장 VMD 관리</RouterLink
                  >
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/inquiries"
                    >1:1 문의 관리</RouterLink
                  >
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/faq">FAQ 관리</RouterLink>
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/announcements"
                    >공지사항 관리</RouterLink
                  >
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/main">메인 관리</RouterLink>
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/statistics">통계</RouterLink>
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/site-management/admin"
                    >관리자 권한</RouterLink
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      <div class="user-action">
        <div class="user-action__list">
          <RouterLink to="" class="user-action__item">사용 매뉴얼</RouterLink>
          <RouterLink to="" class="user-action__item">저작권 규정</RouterLink>
          <RouterLink to="/ci-bi" class="user-action__item"
            >KT CI/BI 가이드</RouterLink
          >
        </div>
        <UIButton
          component="a"
          href="/my-studio"
          color-type="primary"
          size="small"
        >
          나의 스튜디오
        </UIButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import IconLogo from '@/components/base/Header/IconLogo.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import useWindowSizes from '@/composables/useWindowSizes';

const router = useRoute();
const { windowWidth } = useWindowSizes();
const headerInnerRef = ref(null);
const scrollX = ref(window.pageXOffset);

const getCurrentPath = (path) => {
  const segments = path.split('/');
  return segments[1];
};

const oneDepthPathName = ref(getCurrentPath(router.path));

watch(
  () => router.path,
  (newPath) => {
    oneDepthPathName.value = getCurrentPath(newPath);
  },
);

const handleScrollEvent = () => {
  const responsive = 1280;
  const headerInner = headerInnerRef.value;
  const currentScrollX = window.pageXOffset;
  if (windowWidth > responsive || scrollX.value === currentScrollX) return;
  scrollX.value = currentScrollX;
  headerInner.style.transform = `translateX(-${scrollX.value}px)`;
};

onMounted(() => {
  window.addEventListener('scroll', handleScrollEvent);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollEvent);
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem 8rem;
  background-color: var(--color-neutrals-white-100);
  z-index: 9999;
}

.header__inner {
  display: flex;
  align-items: center;
}

.header__logo {
  display: inline-block;
  width: 16.2rem;
}

.header__nav-list {
  display: flex;
  gap: 0 1.2rem;
  margin-left: 6.4rem;
}

.header__nav-item {
  position: relative;
}

.header__nav-item-inner {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  height: 4rem;
  line-height: 3.9rem;
  padding-left: 1.8rem;
  padding-right: 2rem;
  border-radius: 4rem;
  border: 1px solid var(--color-gray-ddd);
  font-size: var(--fz-l);
  font-weight: 500;
}

.header__nav-item:hover .header__nav-item-inner {
  border-color: var(--color-primary);
}

.header__nav-icon-circle {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 9999px;
  border: 1px solid var(--color-gray-bbb);
}

.header__nav-item.is-active .header__nav-icon-circle {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.header__two-depth-wrap {
  position: absolute;
  left: 0;
  top: 100%;
  display: none;
  width: 100%;
  padding-top: 1rem;
}

.header__nav-item:hover .header__two-depth-wrap {
  display: block;
}

.header__two-depth-list {
  padding: 1.6rem 0;
  font-size: var(--fz-l);
  text-align: center;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 2rem;
  background-color: var(--color-neutrals-white-100);
}

.header__two-depth-item {
  padding: 0.4rem 0;
  line-height: 3rem;
  margin: 0.4rem 0;
}

.header__two-depth-item:first-child {
  margin-top: 0;
}

.header__two-depth-item:last-child {
  margin-bottom: 0;
}

.header__two-depth-item:hover {
  color: var(--color-primary);
  font-weight: 500;
}

.header__two-depth-item a {
  display: block;
  width: 100%;
}

.user-action {
  display: flex;
  align-items: center;
  gap: 0 2rem;
  margin-left: auto;
  padding-left: 2.9rem;
}

.user-action__list {
  display: flex;
  gap: 0 3.2rem;
  font-size: var(--fz-m);
}

.user-action__item {
  position: relative;
}

.user-action__item:hover {
  color: var(--color-primary);
}

.user-action__item:not(:last-child)::before {
  position: absolute;
  top: 0;
  right: -1.6rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

@media screen and (max-width: 1440px) {
  .header {
    padding: 2rem 1rem;
  }

  .header__nav-list {
    margin-left: 2rem;
  }

  .user-action {
    gap: 0 1.2rem;
    padding-left: 1rem;
  }

  .user-action__list {
    gap: 0 2.4rem;
  }

  .user-action__item:not(:last-child)::before {
    right: -1.2rem;
  }
}
</style>
