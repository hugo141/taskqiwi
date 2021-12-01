<template>
    <v-card tile>
        <v-toolbar
            flat
            dark
            color="secondary"
            max-height="100px"
        >
            <v-toolbar-title>タスクの追加</v-toolbar-title>
            <v-spacer/>
            <v-btn
                icon
                dark
                @click="clickClose"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-form>
                <ValidationObserver ref="observer" v-slot="{ invalid }" immediate>
                <template v-for="(item, index) in data">
                    <v-text-field
                        v-if="item.inputtype == 'text'"
                        clearable
                        :key="item.value"
                        :label="item.text"
                        v-model="data[index].content"
                    ></v-text-field>
                    <ValidationProvider 
                        v-if="item.inputtype == 'textreq'"
                        :key="item.value+'require'"
                        :name="item.text"
                        v-slot="{ errors, valid, validate }" 
                        rules="required"
                    >
                        <v-text-field
                            :key="item.value"
                            clearable
                            require
                            :label="item.text"
                            :error-messages="errors"
                            :success="valid"
                            @change="validate"
                            v-model="data[index].content"
                        ></v-text-field>
                    </ValidationProvider>                       
                    <v-textarea
                        v-if="item.inputtype == 'textarea'"
                        clearable
                        :key="item.value"
                        :label="item.text"
                        v-model="data[index].content"
                    ></v-textarea>
                    <DateInput 
                        v-if="item.inputtype == 'date'"
                        :key="item.value"
                        :itemname="item.value"
                        :datestr="data[index].content"
                        v-model="data[index].content"                        
                    ></DateInput>
                </template>
                <div class="text-right">
                <v-btn
                    color="secondary"
                    width="80px"
                    :success="invalid"
                    :disabled="invalid"
                    @click="clickOK"
                >
                    <v-icon>mdi-pencil-plus</v-icon>
                </v-btn>
                </div>
                </ValidationObserver>
            </v-form>
        </v-card-text>
    </v-card>
</template>

// <script>
import { localize, extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import ja from 'vee-validate/dist/locale/ja.json';
import DateInput from "./DateInput.vue"
extend('required', required)
localize('ja', ja)

export default {
    name: "InputDialog",
    props:{
        data:Array,
    },
    components: {
        DateInput,
        ValidationProvider,
        ValidationObserver,
    },
    data: () => ({

    }),
    methods: {
        clickClose() {
            this.$emit("click-close", false);
        },
        clickOK() {
            this.$refs.observer.validate().then(result => {
                this.$emit("click-ok", this.data)
            })
        },
    },
}
</script>