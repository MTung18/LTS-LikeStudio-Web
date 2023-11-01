import { computed, ref, Ref } from 'vue'
import { notify as innerNotify, NotificationsOptions } from '@kyvg/vue3-notification';

export interface useAlertsOptions {
    label?: string;
}

export function useAlerts(options: useAlertsOptions = {}) {
    const { label = 'document' } = options;

    const DEFAULT_DURATION: number = 5000; // 5 seconds
    const GROUP_APP: string = 'app';
    const TYPE_NOTIFICATION_ERROR: string = 'notification--error';
    const TYPE_NOTIFICATION_SUCCESS: string = 'notification--success';
    const TYPE_NOTIFICATION_WARNING: string = 'notification--warning';

    const notifyLabel: Ref<string> = ref(label);
    const canDeleteErrorMessage = computed<string>(() => {
        return `${titleCase(notifyLabel.value)} cannot be deleted because it is currently being used on active documents.`;
    });

    // Private method called by all others
    function vueNotify(options: NotificationsOptions): void {
        innerNotify(options);
    }

    function notify(isError: boolean, msg: string, dur?: number): void {
        vueNotify({
            group: GROUP_APP,
            type: isError ? TYPE_NOTIFICATION_ERROR : TYPE_NOTIFICATION_SUCCESS,
            text: msg,
            duration: dur || DEFAULT_DURATION,
        });
    }

    function notifyWithOptions(options: NotificationsOptions): void {
        vueNotify(options);
    }

    function notifyError(errorMsg: string, dur?: number, title?: string): void {
        vueNotify({
            group: GROUP_APP,
            type: TYPE_NOTIFICATION_ERROR,
            text: errorMsg,
            duration: dur || DEFAULT_DURATION,
            title
        });
    }

    function notifySuccess(successMsg: string, dur?: number): void {
        vueNotify({
            group: GROUP_APP,
            type: TYPE_NOTIFICATION_SUCCESS,
            text: successMsg,
            duration: dur || DEFAULT_DURATION,
        });
    }

    function notifyWarning(warningMsg: string, dur?: number): void {
        vueNotify({
            group: GROUP_APP,
            type: TYPE_NOTIFICATION_WARNING,
            text: warningMsg,
            duration: dur || DEFAULT_DURATION,
        });
    }

    function notifyCommonSuccess(verb: string, type: string = notifyLabel.value, dur?: number): void {
        vueNotify({
            group: GROUP_APP,
            type: TYPE_NOTIFICATION_SUCCESS,
            text: `${titleCase(type)} ${pastTense(verb.toLowerCase())}.`,
            duration: dur || DEFAULT_DURATION,
        });
    }

    function notifyCommonError(verb: string, type: string = notifyLabel.value, dur?: number): void {
        vueNotify({
            group: GROUP_APP,
            type: TYPE_NOTIFICATION_ERROR,
            text: `${titleCase(type)} not ${pastTense(verb.toLowerCase())}.  Try again.`,
            duration: dur || DEFAULT_DURATION,
        });
    }

    function notifyCommon(type: string = notifyLabel.value, verb: string, success: boolean, dur?: number): void {
        verb = pastTense(verb.toLowerCase());
        vueNotify({
            group: GROUP_APP,
            type: success ? TYPE_NOTIFICATION_SUCCESS : TYPE_NOTIFICATION_ERROR,
            text: `${titleCase(type)} ${(success ? `${verb}.` : `not ${verb}.  Try again.`)}`,
            duration: dur || DEFAULT_DURATION,
        });
    }

    function notifyCreateSuccess(type: string = notifyLabel.value, dur?: number): void {
        notifyCommon(type, 'create', true, dur);
    }

    function notifyCreateFail(type: string = notifyLabel.value, dur?: number): void {
        notifyCommon(type, 'create', false, dur);
    }

    function notifyModifySuccess(type: string = notifyLabel.value, dur?: number): void {
        notifyCommon(type, 'update', true, dur);
    }

    function notifyModifyFail(type: string = notifyLabel.value, dur?: number): void {
        notifyCommon(type, 'update', false, dur);
    }

    function notifyDeleteSuccess(type: string = notifyLabel.value, dur?: number): void {
        notifyCommon(type, 'delete', true, dur);
    }

    function notifyDeleteFail(type: string = notifyLabel.value, dur?: number): void {
        notifyCommon(type, 'delete', false, dur);
    }

    function clearNotifications(): void {
        vueNotify({
            group: GROUP_APP,
            clean: true,
        });
    }

    function pastTense(verb?: string): string {
        if (verb && !verb.endsWith('ed')) {
            verb = verb.endsWith('y') ? verb.substr(0, (verb.length - 1)) + 'ied' :
                (verb.endsWith('e') ? (verb + 'd') : (verb + 'ed'));
        }
        return verb;
    }

    function titleCase(str: string): string {
        const acronyms: string = '*rfi*rfc*';
        if (!str) return;
        if (str.includes('/')) {
            let slashArray: string[] = [];
            slashArray = str.split('/');
            for (let i: number = 0; i < slashArray.length; i++) {
                slashArray[i] = slashArray[i].charAt(0).toUpperCase() + slashArray[i].slice(1);
                if (acronyms.includes('*' + slashArray[i].toLowerCase() + '*')) {
                    slashArray[i] = slashArray[i].toUpperCase();
                }
            }
            str = slashArray.join('/');
        }
    
        let strArray: string[] = [];
        strArray = str.split(' ');
        for (let i: number = 0; i < strArray.length; i++) {
            strArray[i] = strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1);
            if (acronyms.includes('*' + strArray[i].toLowerCase() + '*')) {
                strArray[i] = strArray[i].toUpperCase();
            }
        }
    
        str = strArray.join(' ');
        return str;
    }

    return {
        notifyLabel,
        canDeleteErrorMessage,
        notify,
        notifyWithOptions,
        notifyError,
        notifySuccess,
        notifyWarning,
        notifyCommonSuccess,
        notifyCommonError,
        notifyCommon,
        notifyCreateSuccess,
        notifyCreateFail,
        notifyModifySuccess,
        notifyModifyFail,
        notifyDeleteSuccess,
        notifyDeleteFail,
        clearNotifications,
    };
}