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
            <v-text-field
                label="タスク名"
                :rules="rules"
                hide-details="auto"
                clearable
                v-model = title
            ></v-text-field>
            <v-textarea
                label="メモ"
                hide-details="auto"
                clearable
                v-model = memo
            ></v-textarea>
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
        data: () => ({
            rules: [
                value => !!value || "Required.",
            ],
            title: "",
            memo: "",
            error: []
        }),
        methods: {
            clickClose() {
               this.$emit("click-close", false);
            },
            clickAdd() {
                if (!this.title){
                    this.error = []
                    this.error.push("タスク名は必ず入力してください。")
                } else {
                    let ar = [this.title, this.memo]
                    this.title = ""
                    this.memo = ""
                    this.error = []
                    this.$emit("click-add", ar)
                    this.clickClose()
                }
            }
        }
    }
</script>