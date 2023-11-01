import DefaultLayout from "@/components/layouts/defaultLayout.vue";
import EmptyLayout from "@/components/layouts/emptyLayout.vue";
import type { App } from "vue";
import { LayoutNames } from "./layoutNames";

export const layoutPlugin = {
  install: (app: App) => {
    app.component(LayoutNames.DEFAULT, DefaultLayout);
    app.component(LayoutNames.EMPTY, EmptyLayout);
  },
};
