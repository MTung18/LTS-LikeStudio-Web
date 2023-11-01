<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import StatusWidgetItem from '@/models/IconsToolbarItem';
import { faUsers, faUser, faUserHardHat, faUserPlus, faClipboardListCheck, faHourglassHalf, faHourglassStart, faHourglassClock } from '@fortawesome/pro-light-svg-icons';
import { computed } from 'vue';

library.add(faUsers, faUser, faUserHardHat, faUserPlus, faClipboardListCheck, faHourglassHalf, faHourglassStart, faHourglassClock);

interface IconsToolbarProps {
    statusItems?: Array<StatusWidgetItem>,
    modelValue?: number,
    enableClick?: boolean,
}
const props = withDefaults(defineProps<IconsToolbarProps>(), {
    modelValue: -1,
    enableClick: true
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const clickFunction = (itemClickFunction: Function, event: Event, itemId: number) => {
    /*
        Use-case logic shouldn't be added here, this component is generic and common. 
        In case of a desired action, please add it to the 'onClickFunction' field passed to the 'statusItems' property.
        
        Example: 
            const employeeIconsToolbarItems: IconsToolbarItem[] = [
                {
                    id: 1,
                    title: "All",
                    onClickFunction: () => { console.log('logic'); },
                }]
    */
    if (props.enableClick === true) {
        localModelValue.value = itemId;

        if (itemClickFunction)
            itemClickFunction(event, itemId);
    }
};

const computedClass = computed<any>(() => {
    return ({
        ["me-2"]: true,
        ["status-widget__icon"]: true,
        ["status-widget__icon__with__hover"]: props.enableClick
    })
});

const computedStyle = (item: StatusWidgetItem) => {
    const selected = item.id === localModelValue.value;

    return {
        "--icon-color": selected ? item.selectedColor : item.color,
        "--icon-background-color": selected ? item.selectedBackground : item.background,
        "--icon-color--hover": item.selectedColor,
        "--icon-background-color--hover": item.selectedBackground,
    }
}

</script>

<template>
    <fs-container fluid class="my-1">
        <fs-row>
            <template v-for="item in statusItems" :key="item.id">
                <fs-col class="col d-flex flex-row justify-content-left ms-3 my-2">
                    <div :class="computedClass" :style="computedStyle(item)"
                        @click="clickFunction(item.onClickFunction, $event, item.id)">
                        <font-awesome-icon :icon=item.icon size="lg" />
                    </div>

                    <div class="d-flex flex-column">
                        <span class="status-widget__title" v-html="item.title" />
                        <span class="status-widget__label">
                            {{ item.label }}
                        </span>
                    </div>
                </fs-col>
            </template>
        </fs-row>
    </fs-container>
</template>