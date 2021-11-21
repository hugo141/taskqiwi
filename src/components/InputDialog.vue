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
            <!-- <v-text-field
                label="タスク名"
                :rules="require"
                hide-details="auto"
                clearable
                v-model = title
            ></v-text-field>
            <v-textarea
                label="メモ"
                hide-details="auto"
                clearable
                v-model = memo
            ></v-textarea> -->
            <template v-for="item in header">
                <template v-if="item.input !== 'n'">
                    <v-text-field
                        v-if="item.input == 'text'"
                        clearable
                        :key="item.value"
                        label="item.text"
                    ></v-text-field>
                    <v-text-field
                        v-if="item.input == 'textreq'"
                        clearable
                        :key="item.value"
                        :rules="req"
                        :label="item.text"
                    ></v-text-field>
                    <v-textarea
                        v-if="item.input == 'textarea'"
                        clearable
                        :key="item.value"
                        :label="item.text"
                    ></v-textarea>
                    <!-- <v-date-picker
                        v-if="item.input == 'date'"
                        clearable
                        :key="item.value"
                        :label="item.text"
                    ></v-date-picker> -->
                    <v-menu 
                        v-if="item.input == 'date'"
                        v-model="menu"
                        :key="item.value"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field 
                                v-model="text" 
                                v-bind="attrs" 
                                v-on="on" 
                                readonly 
                                clearable 
                                :label="item.text"
                                :key="item.value + 'date'">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="picker" @input="formatDate(picker)">
                        </v-date-picker>
                    </v-menu>
                </template>
            </template>
            <v-list 
                v-if="error.length"
                dense
            >
                <v-list-item
                    v-for="(er, i) in error"
                    :key = "i"
                > 
                    <v-list-item-icon><v-icon>mdi-alert</v-icon></v-list-item-icon>
                    {{ er }}
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-footer>
            <v-spacer/>
            <v-btn
                bottom
                right
                color="secondary"
                width="80px"
                @click="clickAdd"
            >
                <v-icon>mdi-pencil-plus</v-icon>
            </v-btn>
        </v-footer>
    </v-card>
</template>

<script>
    export default {
        name: "InputDialog",
        props:{
            header:Array,
        },
        data: () => ({
            req: [
                value => !!value || "Required.",
            ],
            error: [],
            menu: "",
            text: "",
            picker: "",
        }),
        methods: {
            clickClose() {
                console.log(this.header)
               this.$emit("click-close", false);
            },
            clickAdd() {
                if (!this.title){
                    this.error = []
                    this.error.push("タスク名は必ず入力してください。")
                } else {
                    // let ar = [this.title, this.memo]
                    let ar = []
                    this.error = []
                    this.$emit("click-add", ar)
                    this.clickClose()
                }
            },
            formatDate(date) {
                if (!date) return null;
                    const [year, month, day] = date.split("-");
                    this.text = `${year}/${month}/${day}`;
                    this.menu = false;
                return;
            },
        }
    }
</script>