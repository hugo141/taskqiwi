<template>
    <v-menu 
    v-model="menu"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field 
                v-model="inputedValue"
                v-bind="attrs" 
                v-on="on" 
                readonly 
                clearable 
                :label="itemname"
                :key="itemname + 'date'">
            </v-text-field>
        </template>
        <v-date-picker v-model="picker" @input="formatDate(picker)">
        </v-date-picker>
    </v-menu>
</template>

<script>
export default {
    name: "DateInput",
    props:{
        itemname:String,
        datestr:String,
    },
    data: () => ({
        menu: "",
        picker: "",

    }),
    methods: {
        formatDate(date) {
            if (!date) return null;
                const [year, month, day] = date.split("-");
                this.inputedValue = `${year}/${month}/${day}`;
                this.menu = false;
            return;
        },
    },
    computed: {
        inputedValue: {
            get() {
                return this.datestr
            },
            set(newValue) {
                this.$emit("input", newValue);
            },
        },
    },
}
</script>
