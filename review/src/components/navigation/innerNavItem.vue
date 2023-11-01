<template>
  <div class="insidenav__category-container">
    <fs-nav-item
        :to="item.to"
        :link-classes="'insidenav__category-link'"
        :class="'insidenav__category-item'"
        :style="[item.hovercolor ? `--hovercolor: ${item.hovercolor}` : '']"
    >
      <div
          class="insidenav__icon-container insidenav__icon-container--left"
          :style="`color: ${item.iconColor}; background-color: ${item.circleColor};`"
      >
        <font-awesome-icon
            :icon="item.icon"
            size="lg"
            class="insidenav__icon"
        />
      </div>

      <span>{{ item.label }}</span>
    </fs-nav-item>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const { item } = defineProps(["item"]);

const backgroundColor = ref(item.hovercolor);
const borderColor = ref(item.iconColor);
</script>
<style lang="scss" scoped>
:deep(.insidenav__category-item.link-active) {
  background: v-bind("backgroundColor");
  color: black;
  border-right: 5px solid v-bind("borderColor");
}
</style>
