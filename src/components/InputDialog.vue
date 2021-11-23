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
                        :key="item.id"
                        :label="item.text"
                        v-model="data[index].value"
                    ></v-text-field>
                    <ValidationProvider 
                        v-if="item.inputtype == 'textreq'"
                        :key="item.id+'require'"
                        :name="item.text"
                        v-slot="{ errors, valid, validate }" 
                        rules="required"
                    >
                        <v-text-field
                            :key="item.id"
                            clearable
                            require
                            :label="item.text"
                            :error-messages="errors"
                            :success="valid"
                            @change="validate"
                            v-model="data[index].value"
                        ></v-text-field>
                    </ValidationProvider>                       
                    <v-textarea
                        v-if="item.inputtype == 'textarea'"
                        clearable
                        :key="item.id"
                        :label="item.text"
                        v-model="data[index].value"
                    ></v-textarea>
                    <DateInput 
                        v-if="item.inputtype == 'date'"
                        :key="item.id"
                        :itemname="item.id"
                        v-model="data[index].value"                        
                    ></DateInput>
                </template>
                <div class="text-right">
                <v-btn
                    color="secondary"
                    width="80px"
                    :success="invalid"
                    @click="clickAdd"
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
            // console.log(this.data)
            this.$emit("click-close", false);
        },
        clickAdd() {
            this.$refs.observer.validate().then(result => {
                // console.log(this.data)
                // console.log('submit', result)
                this.$emit("click-add", this.data)
                this.clickClose()
            })
        },
    }
}
</script>