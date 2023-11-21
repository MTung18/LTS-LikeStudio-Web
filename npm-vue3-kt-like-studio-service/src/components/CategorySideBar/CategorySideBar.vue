<template>
  <aside class="sidebar">
    <div class="sidebar__wrap">
      <div class="sidebar__area custom-scrollbar">
        <div class="sidebar__category">
          <div class="category-head">
            <b class="category-title">선택한 조건</b>
            <button type="button" class="category-reset">초기화</button>
          </div>
          <div class="selected-list-wrap">
            <ul class="selected-list">
              <li class="selected-item">
                <span class="selected-name">포스터</span>
                <button type="button" class="selected-remove">
                  <Icons
                    :width="1.4"
                    :height="1.4"
                    icon-color="var(--color-gray-777)"
                    icon-name="delete"
                  />
                </button>
              </li>
              <li class="selected-item">
                <span class="selected-name">브로셔</span>
                <button type="button" class="selected-remove">
                  <Icons
                    :width="1.4"
                    :height="1.4"
                    icon-color="var(--color-gray-777)"
                    icon-name="delete"
                  />
                </button>
              </li>
              <li class="selected-item">
                <span class="selected-name">결합</span>
                <button type="button" class="selected-remove">
                  <Icons
                    :width="1.4"
                    :height="1.4"
                    icon-color="var(--color-gray-777)"
                    icon-name="delete"
                  />
                </button>
              </li>
              <li class="selected-item">
                <span class="selected-name">멤버쉽</span>
                <button type="button" class="selected-remove">
                  <Icons
                    :width="1.4"
                    :height="1.4"
                    icon-color="var(--color-gray-777)"
                    icon-name="delete"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          v-for="category in props.data"
          :key="category.id"
          class="sidebar__category"
        >
          <div class="category-head">
            <b class="category-title">{{ category.name }}</b>
            <IconButton
              icon-name="chevron_t"
              size="small"
              type="outlined"
              component="button"
              class="ml-auto mt-[-0.5rem] rotate-180"
              @click="handlerOpenCategory"
            />
          </div>
          <div class="category-list-wrap">
            <ul class="category-list">
              <li
                v-for="subcategory in category.subcategories"
                :key="subcategory.id"
                class="category-item"
                :class="[subcategory.isSelected && 'is-selected']"
              >
                <button
                  type="button"
                  class="category-item__box"
                  @click="handlerCategorySelected(category.id, subcategory.id)"
                >
                  <span class="category-text">{{ subcategory.name }}</span>
                  <Icons
                    class="category-item__icon"
                    icon-name="check_bold"
                    icon-color="var(--color-primary)"
                    :width="2"
                    :height="2"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import IconButton from '@/components/IconButton/IconButton.vue';
import Icons from '@/components/Icons/Icons.vue';

const props = defineProps({
  data: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits(['category-selected']);

const handlerCategorySelected = (categoryId, subcategoryId) => {
  emit('category-selected', categoryId, subcategoryId);
};

const handlerOpenCategory = (e) => {
  const $target = e.currentTarget;
  const $categoryElement = $target.closest('.sidebar__category');
  if ($categoryElement) {
    const $listWrap = $categoryElement.querySelector('.category-list-wrap');
    if ($listWrap) {
      const $list = $listWrap.querySelector('.category-list');
      const listHeight = $list ? $list.clientHeight : 0;

      if ($listWrap.clientHeight === 0) {
        $listWrap.style.height = `${listHeight}px`;
        $target.style.transform = `rotate(180deg)`;
      } else {
        $listWrap.style.height = `0px`;
        $target.style.transform = `rotate(0deg)`;
      }
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 26rem;
}

.sidebar__wrap {
  position: sticky;
  top: 8rem;
  max-height: calc(100vh - 100px);
  padding: 1rem 0;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 1.2rem;
  background-color: var(--color-neutrals-white-100);
  overflow: hidden;
}

.sidebar__area {
  max-height: calc(100vh - 100px);
  padding: 2.4rem 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar__category {
  width: calc(26rem - 0.4rem);
  padding: 0 2.4rem;
}

.sidebar__category + .sidebar__category {
  border-top: 1px solid var(--color-gray-ddd);
}

.sidebar__category:not(:first-child) {
  padding-top: 2.4rem;
}

.sidebar__category:not(:last-child) {
  padding-bottom: 2.4rem;
}

.category-head {
  display: flex;
  align-items: center;
}

.category-list-wrap {
  overflow: hidden;
  transition: 0.3s ease-out;
}

.category-list {
  padding-top: 1.6rem;
  overflow-y: auto;
}

.category-item + .category-item {
  margin-top: 1.6rem;
}

.category-title {
  font-size: var(--fz-xl);
  font-weight: 700;
}

.category-item__box {
  display: flex;
  align-items: center;
  gap: 0 0.6rem;
}

.category-text {
  font-size: 15px;
  color: var(--color-gray-444);
}

.category-item.is-selected .category-text {
  font-weight: 700;
  color: var(--color-primary);
}

.category-item__icon {
  display: none;
}

.category-item.is-selected .category-item__icon {
  display: block;
}

.category-reset {
  position: relative;
  margin-left: auto;
  font-size: var(--fz-s);
  color: var(--color-gray-777);
  font-weight: 500;
}

.category-reset:hover {
  color: var(--color-neutrals-black);
}

.category-reset::after {
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  width: 100%;
  height: 1px;
  background-color: var(--color-gray-bbb);
}

.category-reset:hover::after {
  background-color: var(--color-neutrals-black);
}

.selected-list {
  margin-top: 1.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  line-height: 1;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  height: 3.4rem;
  padding-left: 1.4rem;
  padding-right: 1.2rem;
  border-radius: 50.9rem;
  background-color: #f4f4f4;
}

.selected-name {
  font-size: var(--fz-m);
}
</style>
