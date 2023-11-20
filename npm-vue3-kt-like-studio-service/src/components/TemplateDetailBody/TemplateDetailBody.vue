<template>
  <div class="detail-body">
    <div v-if="content" class="detail-body__content">
      {{ props.content }}
    </div>

    <FileDownload class-bind="!mt-0" v-for="item in props.files" :key="item.id" :files="[
      { id: item.id, filename: item.oriFileName, filePath: item.uniqFileName },
    ]" />

    <ul class="nav">
      <li class="nav__item nav--prev" v-for="(post, index) in [props.prevPost, props.nextPost]" :key="index" :class="{
        'is-disabled': !post || !post.title
      }">
        <button type="button" @click="handleButtonClick(post)" class="nav__item-area">
          <Icons :icon-name="index === 0 ? 'chevron_t' : 'chevron_b'"
            :icon-color="post && post.title ? 'var(--color-neutrals-black)' : 'var(--color-gray-bbb)'" :width="1.4"
            :height="1.4" />
          <span class="nav__item-desc">
            {{ index === 0 ? '이전글' : '다음글' }}
          </span>
          <span v-if="post" class="nav__item-title">{{ post.title }}</span>
          <span v-if="post == undefined" class="nav__item-title">
            {{ index === 0 ? '이전글이 없습니다.' : '다음글이 없습니다.' }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

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
    default: () => { },
  },
  nextPost: {
    type: Object,
    default: () => { },
  },
});

const check = ref(false);
const emit = defineEmits(['someEvent']);
 

function handleButtonClick(post) {
  check.value = true;
  if (post) {
    goToPost(post.id);
    emit('someEvent', post.id);
  }
}

function goToPost(postId) {
  router.push(`${basePath}/${postId}`);
}
</script>

<style scoped>
.detail-body {
  padding: 6rem 0;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.detail-body__content {
  margin-bottom: 6rem;
}

.nav {
  margin-top: 6rem;
}

.nav__item {
  padding: 3rem 0;
  border-top: 1px solid var(--color-gray-ddd);
}

.nav__item.is-disabled {
  color: var(--color-gray-bbb);
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
