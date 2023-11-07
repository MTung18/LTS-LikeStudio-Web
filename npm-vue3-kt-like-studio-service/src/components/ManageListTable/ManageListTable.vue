<template>
  <div class="select-area">
    <table>
      <thead>
        <tr>
          <th>NO</th>
          <th v-for="item in props.cate" :key="item.id" :class="item.set">
            {{ item.cate }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in props.innerData" :key="item.id" :class="item.name">
          <td>{{ item.id }}</td>
          <td
            v-for="(category, index) in props.cate"
            :key="index"
            :class="category.set"
          >
            {{ item[category.set] }}
          </td>
        </tr>
      </tbody>
    </table>
    <p>{{ item }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  innerData: {
    type: Array,
    default: () => [],
  },
  cate: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
table {
  border-top: 1px solid var(--color-neutrals-black);
  width: 100%;
}
</style>
