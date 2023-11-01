<script setup lang="ts">
import onboardingContactForm from "@/components/viewComponents/onboarding/onboardingContactForm.vue";
</script>
<template>
  <router-view>
    <onboardingContactForm :formType="'EDIT'" />
  </router-view>
</template>
