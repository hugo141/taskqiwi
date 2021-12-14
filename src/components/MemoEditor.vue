<template>
<v-container fluid>
    <v-card :elevation="0">
        <v-card-title>
            <v-row>
                <v-col cols="4">
                    Markdown Editor
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="1" class="d-flex justify-center">
                    <v-btn color="primary" small width="60" @click="doSave()">SAVE</v-btn>
                    <v-icon v-if="saved == true" color="green">mdi-check-circle</v-icon>
                </v-col>
                <v-col cols="1" class="d-flex justify-center">
                    <v-btn color="primary" small outlined width="60" @click="doExport()">EXPORT</v-btn>
                </v-col>
            </v-row>
        </v-card-title>
    </v-card>
    <v-form id="editor-form">
        <v-row justify="space-between">
            <v-col cols="6">
                <h4>Editor</h4>
                <div id="editor">
                    <v-textarea 
                        v-model="markdownText"
                        v-on:input="handleInput()"
                        v-on:keydown.ctrl.s="doSave"
                        outlined
                        auto-grow
                        rows=15
                    ></v-textarea>
                </div>
            </v-col>
            <v-col cols="6">
                <h4>Preview</h4>
                <div id="preview">
                    <div v-html="compiledMarkdown"></div>
                </div>
            </v-col>
        </v-row>
    </v-form>
</v-container>
</template>

<script>
import { marked } from "marked"
import { remote } from "electron";
import fs from "fs";

export default {
    name: "MemoEditor",
    data: () => ({
        _id: "",
        markdownText:"",
        saved: false,
    }),
    methods: {
        handleInput(){
            this.saved = false
        },
        async doExport(){
            let data = this.markdownText
            let filename = await remote.dialog.showSaveDialog(
                remote.getCurrentWindow(),
                {
                    filters: [
                        { name: "Text File", extensions:["txt"]},
                        { name: "All Files", extensions: ["*"]}
                    ],
                }
            )
            console.log(filename)
            if (filename) {
                fs.writeFile(filename.filePath, data, (err) => {
                    if (err) {
                        alert(err);
                    }
                });
            }
        },
        async doSave(){
            if(this._id != "" && this._id != undefined){
                let setModifier = { $set: {} }
                setModifier.$set["text"]=this.markdownText
                await this.dataUpdate(this._id, setModifier)
            }else{
                let setInsDoc = {}
                setInsDoc["text"]=this.markdownText
                await this.dataInsert(setInsDoc)
            }
            this.saved = true
        },
        async dataInsert(doc){
            return new Promise((resolve,reject) =>
                this.$editdata.insert(doc, (err, newItem) => {
                    if (err !== null){
                    reject(console.log("err", err))
                    }
                    resolve()
                })
            )
        },
        async dataUpdate(ID, query) {
            return new Promise((resolve, reject) => {
                this.$editdata.update({_id:ID}, query, {multi: false}, (err, numReplaced) => {
                    if (err !== null){
                    reject(console.log("err", err))
                    }
                    resolve(console.log("numReplaced", numReplaced))
                }) 
            })
        },
        async dataLoad(){
            // this.$editdata.remove({}, { multi: true }, (err) => {
            //     console.log(err)
            // })
            this.$editdata.find({}, (err, doc) => {
                // console.log(doc)
                if(err != null){console.log(err)}
                if(doc.length > 0){
                    this._id = doc[0]._id
                    this.markdownText = doc[0].text;
                }
            })
        },
    },
    created: function(){
        this.$editdata.find({}, (err, doc) => {
            if(err != null){console.log(err)}
            if(doc.length > 0){
                this._id = doc[0]._id
                this.markdownText = doc[0].text;
            }
        })
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.markdownText);
      }
    },
};
</script>
