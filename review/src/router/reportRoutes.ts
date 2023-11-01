import { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import { UIFunctions } from '@/enums/UIFunctions';
//import RouteUtilities from '@/services/RouteUtilities';

const reportMetaData: object = { section: 'reports', };
const baseRoute: string = '/components/reports/';

export const reportRoutes: RouteRecordRaw[] = [
    // reports
    {
        name: 'testreport',
        path: `${baseRoute}testReport`,
        component:  (): any => import(/* webpackChunkName: "projectListReports" */ '../components/reports/testReports/testReport.vue'),
        props: (route: RouteLocationNormalized): object => ({
            ...route.params,
            action: route.query.action,
        }),
        meta: { ...reportMetaData, UIFieldTag: "PM_167_2698|PM_168_2668" },
    },
]