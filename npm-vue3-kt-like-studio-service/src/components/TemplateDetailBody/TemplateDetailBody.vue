<template>
  <div class="detail-body">
    <div v-if="content" class="detail-body__content">
      {{ props.content }}
    </div>

    <FileDownload :files="props.files" />

    <ul v-if="props.prevPost && props.nextPost" class="nav">
      <li class="nav__item nav--prev" :class="!prevPost.title && 'is-disabled'">
        <button
          type="button"
          @click="goToPost(props.prevPost.id)"
          class="nav__item-area"
        >
          <Icons
            icon-name="chevron_t"
            :icon-color="
              props.prevPost.title
                ? 'var(--color-neutrals-black)'
                : 'var(--color-gray-bbb)'
            "
            :width="1.4"
            :height="1.4"
          />
          <span class="nav__item-desc">이전글</span>
          <span v-if="prevPost.title" class="nav__item-title">{{
            props.prevPost.title
          }}</span>
          <span v-else class="nav__item-title">이전글이 없습니다.</span>
        </button>
      </li>
      <li class="nav__item nav--prev" :class="!nextPost.title && 'is-disabled'">
        <button
          type="button"
          @click="goToPost(props.nextPost.id)"
          class="nav__item-area"
        >
          <Icons
            icon-name="chevron_b"
            :icon-color="
              props.nextPost.title
                ? 'var(--color-neutrals-black)'
                : 'var(--color-gray-bbb)'
            "
            :width="1.4"
            :height="1.4"
          />
          <span class="nav__item-desc">다음글</span>
          <span v-if="nextPost.title" class="nav__item-title">
            {{ props.nextPost.title }}
          </span>
          <span v-else class="nav__item-title">다음글이 없습니다.</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

import FileDownload from '@/components/FileDownload/FileDownload.vue';
import Icons from '@/components/Icons/Icons.vue';

const route = useRoute();
const router = useRouter();
const currentPath = route.path;
const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  files: {
    type: Array,
    default: () => [],
  },
  prevPost: {
    type: Object,
    default: () => {},
  },
  nextPost: {
    type: Object,
    default: () => {},
  },
});

function goToPost(postId) {
  router.push(`${basePath}/${postId}`);
}
</script>

<style scoped>
.detail-body {
  padding-top: 6rem;
}

.detail-body__content {
  margin-bottom: 6rem;
}

.nav {
  margin-top: 6rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.nav__item {
  padding: 3rem 0;
  border-top: 1px solid var(--color-gray-ddd);
}

.nav__item.is-disabled {
  color: var(--color-gray-bbb);
  pointer-events: none;
}

.nav__item-area {
  display: flex;
  align-items: center;
}

.nav__item-desc {
  margin-left: 1rem;
  font-size: var(--fz-l);
  font-weight: 700;
}

.nav__item-title {
  margin-left: 2.6rem;
  font-size: var(--fz-l);
}
</style>
