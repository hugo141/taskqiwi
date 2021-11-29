<template>
    <v-card>
        <v-card-title class="subtitle-1">
            {{ this.message }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="clickCancel()">
            キャンセル
        </v-btn>
        <v-btn color="error" text @click="clickOK()">
            {{ this.btnMes }}
        </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "DeleteDialog",
    props:{
        message:String,
        btnMes:String,
    },
    methods: {
        clickCancel() {
            this.$emit("click-cancel");
        },
        clickOK() {
            this.$emit("click-ok");
        },
    }
}
</script>
