<script setup lang="ts">
import OnboardingPlanList from "@/components/viewComponents/onboarding/onboardingPlanList.vue";
import OnboardingPlan from "@/models/onboarding/OnboardingPlan";

function onAssignUser(onboardingPlan: OnboardingPlan) {
  console.log(`Assign User to ${onboardingPlan.name}`);
}

function onEditPlan(onboardingPlan: OnboardingPlan) {
  console.log(`Edit ${onboardingPlan.name}`);
}

function onViewPlanAssignees(onboardingPlan: OnboardingPlan) {
  console.log(`View Assignees on ${onboardingPlan.name}`);
}
</script>
<template>
  <div class="hq-pg list">
    <div class="list__table">
      <onboarding-plan-list
        @assign-user="onAssignUser"
        @edit-plan="onEditPlan"
        @view-assignees="onViewPlanAssignees"
      />
    </div>
  </div>
</template>
