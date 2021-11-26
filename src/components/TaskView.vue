<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-container>
          <v-row>
            <v-col cols="4">
              ToDo
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="search"
                label="キーワード検索"
                single-line
                hide-details
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-switch
              v-model="showfinflg"
              label="完了済みを表示"
              color="info"
              hide-details
              @click="onClickShowFin()"
            ></v-switch>
            <v-switch
              v-model="showdelflg"
              label="削除済みを表示"
              color="info"
              hide-details
              @click="onClickShowdel()"
            ></v-switch>
          </v-row>
        </v-container>
      </v-card-title>
    </v-card>
    <template v-if="items == null || items.length == 0">
      <v-card>
        <v-card-title>タスクがありません。</v-card-title>
      </v-card>
    </template>
    <template v-else>
      <v-data-table
        :headers="shownHeaders"
        :items="items"
        :sort-by="sortby"
        :search="search"
        item-key="no"
        fixed-header
        hide-default-footer
        :items-per-page="10000"
        class="elevation-2 fixed-header v-table__overflow subtitle-2"
        style="white-space: pre-wrap; max-height: auto"
      >
        <template #item.status="{ item }">
          <v-btn v-if="item.status == 0" @click="onClickStart(item)">開始</v-btn>
          <v-btn v-else-if="item.status == 1" @click="onClickEnd(item)">終了</v-btn>
          <v-btn v-else-if="item.status == 2" disabled>完了</v-btn>
        </template>
        <template #item.del="{ item }">
          <v-btn v-if="item.del == 0" color="error" @click="deldialog = true">削除</v-btn>
          <v-btn v-else-if="item.del == 1" disabled>済</v-btn>

          <v-dialog v-model="deldialog">
            <v-card>
              <v-card-title class="subtitle-1">
                このタスクを削除します。よろしいですか？
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="clickDelCancel(item)">
                  キャンセル
                </v-btn>
                <v-btn color="error" text @click="clickDelOK(item)">
                  削除する
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
    </template>
    <v-btn
      fab
      fixed
      bottom
      right
      color="primary"
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="600px"
      transition="dialog-bottom-transition"
      scrollable
    >
      <InputDialog 
        v-bind:data="this.newCreation()"
        @click-close="dialog = $event"
        @click-add="addData($event)"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import Axios from "axios";
import InputDialog from "./InputDialog.vue";

export default {
  name: "TaskView",
  data: () => ({
    search: "",
    showfinflg:false,
    showfin: {status: {$lt:2}},
    showdelflg: false,
    showdel: { del:0},
    items: null,
    statuses: null,
    sortby: null,
    headers: null,
    creation: null,
    dialog: false,
    deldialog: false,
  }),
  components:{
    InputDialog,
  },
  methods: {
    onClickShowFin(){
      let cond = {}
      if (this.showfinflg){
        cond["status"] = {$lte: 2}
        this.showfin = cond
      } else {
        cond["status"] = {$lt: 2}
        this.showfin = cond
      }
      this.dataLoad()
    },
    onClickShowdel(){
      let cond = {}
      if (this.showdelflg){
        cond["del"] = {$lte: 1}
        this.showdel = cond
      } else {
        cond["del"]=0
        this.showdel = cond
      }
      this.dataLoad()
    },
    onClickStart(item) {
      item.status = 1;
      this.doUpdate(item)
    },
    onClickEnd(item) {
      item.status = 2;
      this.doUpdate(item)
    },
    clickDelCancel(item) {
      this.deldialog = false
    },
    clickDelOK(item) {
      item.del = 1;
      this.doUpdate(item)
      this.deldialog = false
    },
    async addData(ar){
      let count = 0
      count = await this.dataCount()
      let setInsDoc = {}
      setInsDoc["no"]= count + 1
      this.headers.forEach(async function(item){
        if(item.value !== "_id" && item.value !== "no" ){
          setInsDoc[item.value]=item.default
        }
      })
      ar.forEach(async function(row){
        setInsDoc[row.value]=row.content
      })
      await this.dataInsert(setInsDoc)
      await this.dataLoad()
    },
    createUpdateQuery(_id, data){
      let setModifier = { $set: {} };
      let headAr = this.createHeadArray()
      headAr.forEach(async function(item){
        if(data[item] == undefined){
          setModifier.$set[item]=""
        } else {
          setModifier.$set[item]=data[item]
        }
      })
      return setModifier
    },
    newCreation(){
      let ar = []
      this.headers.forEach(async function(item){
        if(item.inputtype !== "n"){
          let str = {}
          str["value"]=item.value
          str["text"]=item.text
          str["inputtype"]=item.inputtype
          str["content"]=""
          ar.push(str)
        }
      })
      return ar
    },
    doUpdate(data){
      let query = this.createUpdateQuery(data._id, data)
      this.dataUpdate(data._id, query)
    },
    createHeadArray(){
      let headAr = []
      this.headers.forEach(async function(item){
        headAr.push(item.value)  
      })
      return headAr
    },
    async dataCount(){
      return new Promise((resolve,reject) =>
        this.$database.count({}, (err, count) => {
          if (err !== null){
            console.log("err", err);
            reject(null)
          }
          resolve(count)
        })
      )
    },
    async dataInsert(doc){
      return new Promise((resolve,reject) =>
        this.$database.insert(doc, (err, newItem) => {
            if (err !== null){
              reject(console.log("err", err))
            }
            resolve()
        })
      )
    },
    async dataUpdate(ID, query) {
      return new Promise((resolve, reject) => {
        this.$database.update({_id:ID}, query, {multi: false}, (err, numReplaced) => {
            if (err !== null){
              console.log("err", err)
            }
            console.log("numReplaced", numReplaced)
          }       
        ) 
      })
    },
    async dataLoad(){
      let query = {}
      query["del"] = this.showdel["del"]
      query["status"] = this.showfin["status"]
      this.$database.find(query, (err, doc) => {
        this.items = doc;
      })
    },
  },
  mounted: function () {
    Axios.get("../todoconfig.json").then(
      function (response) {
        let array = response.data
        this.headers = array.headers
        this.statuses = array.states
      }.bind(this)
    );
    this.$database.find({ del:0 , status: {$lt: 2}} , (err, doc) => {
        this.items = doc;
    })

  },
  computed: {
    shownHeaders: function () {
      let far = this.headers.filter((a) => a.tasklist);
      return far
    },
  },
};
</script>
