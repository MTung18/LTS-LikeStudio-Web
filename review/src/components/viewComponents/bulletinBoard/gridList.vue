<script lang="ts" setup>
import GridItem from "@/components/viewComponents/bulletinBoard/gridItem.vue";
import { Bulletin } from "@/models/Bulletin";
import { defineEmits, defineProps } from "vue";

interface Props {
  posts: Bulletin[];
}
defineProps<Props>();

const emit = defineEmits(["delete"]);

function getId(data: number) {
  emit("delete", data);
}
</script>
<template >
  <fs-container fluid class="contain py-4">
    <fs-row>
      <fs-col lg="3" md="6" v-for="post in posts" :key="post.postId" class="item mb-4">
        <GridItem :post="post" @delete="getId" />
      </fs-col>
    </fs-row>
  </fs-container>
</template>

