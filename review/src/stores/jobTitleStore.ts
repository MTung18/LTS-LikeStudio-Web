import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import { jobTitleApi } from "../axios/instances/jobTitleApi";
import JobTitle from '../models/JobTitle';

export const useJobTitleStore = defineStore("jobtitle", () => {
  const jobTitles: Ref<JobTitle[]> = ref();

  async function fetchJobTitle(): Promise<void> {
    jobTitles.value = await jobTitleApi.getJobTitles();
  }

  async function addJobTitle(jobTitleName: string): Promise<boolean> {
    return await jobTitleApi.createJobTitle(jobTitleName);
  }

  return {
    jobTitles,
    fetchJobTitle,
    addJobTitle
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJobTitleStore, import.meta.hot));
}
