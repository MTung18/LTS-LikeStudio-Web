<template>
    <fs-row>
        <fs-col cols="12">
            <fs-input type="fsTextInput" :name="`${labelPrepend}address1`" defaultEmptyValue="" :maxlength="30"
                :label="`${labelPrepend} Address 1`" :rules="{ required: false }" :required="false"
                v-model="internalGoogleAddress.address1" @update:modelValue="addressInput"></fs-input>
        </fs-col>
        <fs-col cols="12">
            <fs-input type="fsTextInput" :name="`${labelPrepend}address2`" defaultEmptyValue="" :maxlength="30"
                :label="`${labelPrepend} Address 2`" :rules="{ required: false }" :required="false"
                v-model="internalGoogleAddress.address2" @update:modelValue="addressInput"></fs-input>
        </fs-col>

        <fs-col md="6">
            <fs-input type="fsTextInput" :name="`${labelPrepend}city`" :id="uiFieldMap.city" defaultEmptyValue=""
                :label="`${labelPrepend} City`" :maxlength="30" :rules="{ required: false }" :required="false"
                v-model="internalGoogleAddress.city" @update:modelValue="addressInput"></fs-input>
        </fs-col>

        <fs-col sm="6" md="3">
            <fs-input type="fsTextInput" :name="`${labelPrepend}state`" key="stateText" defaultEmptyValue=""
                :label="`${labelPrepend} State`" :maxlength="2" :id="uiFieldMap.state" :rules="{ required: false }"
                :required="false" v-model="internalGoogleAddress.state_Province" @blur="formatState"
                @update:modelValue="addressInput"></fs-input>
        </fs-col>
        <fs-col sm="6" md="3">
            <fs-input type="fsTextInput" :name="`${labelPrepend}zipCode`" defaultEmptyValue="" :maxlength="10"
                :id="uiFieldMap.zipCode" :rules="{ zipCode: { country: internalGoogleAddress.country }, required: false }"
                :required="false"
                :label="internalGoogleAddress.country === 'CA' ? `${labelPrepend} Postal Code` : `${labelPrepend} Zip Code`"
                v-model="internalGoogleAddress.zip_PostalCode" @update:modelValue="addressInput" 
                :validate-on-input="false"
                :validate-on-change="true"
                @blur="formatZip"></fs-input>
        </fs-col>

        <fs-col md="12" v-if="isCountryEnabled">
            <fs-input type="fsMultiselectList" :id="uiFieldMap.country" v-if="countryItems && countryItems.length > 0"
                key="country" :name="`${labelPrepend}country`" :label="`${labelPrepend} Country`" v-model="countrySelected"
                :typeaheaddata="countryItems" typeaheadkey="name" typeaheadvalueattribute="abbreviation"
                :defaultEmptyValue="null" :showClear="false" :rules="{ required: false }" :required="false" />
        </fs-col>
    </fs-row>
</template>

<script src="./fsAddress.ts" lang="ts"></script>
