<template>
  <v-container>
    <v-card>
      <v-card-title>
        ToDo
        <div class="flex-grow-1"></div>
        <v-text-field
          v-model="search"
          label="キーワード検索"
          single-line
          hide-details
          clearable
        >
        </v-text-field>
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
      </v-data-table>
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
    </template>
  </v-container>
</template>

<script>
import Axios from "axios";
import path from "path";
// import dbData from "./db/tododata.json";
import Database from "nedb";
// import { remote } from "electron"
import InputDialog from "./InputDialog.vue";
// import tododb from "tododb"

// // const file = path.join(__dirname, "data/tododata.nedb").replace("app.asar", "app.asar.unpacked")
const tododb = new Database({
    // filename: `C:/Users/ea0710055/PGM/taskpicker/taskqiwi/src/components/db/testdata.db`
    // filename: path.join(remote.app.getPath("userData"), "data.db")
    filename: `/home/yuji01k/codes/taskqiwi/taskqiwi/src/components/db/testdata.db`
    , autoload: true
    });
// // tododb.loadDatabase(function(err){ if(err){console.log(err)}})
// tododb.remove();
// tododb.loadDatabase()
// // tododb.insert(dbData);

export default {
  name: "TaskView",
  data: () => ({
    search: "",
    items: null,
    statuses: null,
    headers: null,
    creation: null,
    dialog: false,
  }),
  components:{
    InputDialog,
  },
  methods: {
    onClickStart(item) {
      item.status = 1;
      this.dataUpdate(item)
    },
    onClickEnd(item) {
      item.status = 2;
      this.dataUpdate(item)
    },
    async addData(ar){
      // console.log("ar")
      let count = 0
      count = await this.dataCount()
      let setInsDoc = {}
      setInsDoc["no"]=count + 1
      this.headers.forEach(async function(item){
        if(item.id !== "_id"){
          setInsDoc[item.id]=item.default
        }
      })
      ar.forEach(async function(row){
        setInsDoc[row.id]=row.value
      })
      await this.dataInsert(setInsDoc)
      await this.dataLoad()
      // console.log("setInsDoc")
      // console.log(setInsDoc)
    },
    dataUpdate(data) {
      let query = this.createUpdateQuery(data._id, data)
      console.log(query)
      tododb.update(
        {_id:data._id}, 
        query,
        {multi: false},
        function(err, numReplaced){
          if (err !== null){
            console.log("err", err)
          }
          console.log("numReplaced", numReplaced)
        }       
      )
    },
    createUpdateQuery(_id, data){
      let setModifier = { $set: {} };
      let headar = this.createHeadArray()
      headar.forEach(async function(item){
        if(data[item] == undefined){
          setModifier.$set[item]=""
        } else {
          setModifier.$set[item]=data[item]
        }
      })
      // console.log(setModifier)
      return setModifier

    },
    createHeadArray(){
      let headar = []
      this.headers.forEach(async function(item){
        headar.push(item.id)  
      })
      return headar
    },
    async dataCount(){
      return new Promise(function(resolve,reject){
        tododb.count({}, function(err, count){
          if (err !== null){
            console.log("err", err);
            reject(null)
          }
          resolve(count)
        })
      })
    },
    async dataInsert(doc){
      // console.log(doc)
      return new Promise(function(resolve,reject){
        tododb.insert(doc, function(err, newItem){
            if (err !== null){
              reject(console.log("err", err))
            }
            resolve()
        })
      })
    },
    async dataLoad(){
      tododb.find({} , (err, doc) => {
        this.items = doc;
        console.log(this.items)
      })
    },
    newCreation(){
      let ar = []
      this.headers.forEach(async function(item){
        if(item.inputtype !== "n"){
          let str = {}
          str["id"]=item.id
          str["text"]=item.text
          str["inputtype"]=item.inputtype
          str["value"]=""

          ar.push(str)
        }
      })
      return ar
    },
  },
  mounted: function () {
    Axios.get("../todoconfig.json").then(
      function (response) {
        let array = response.data
        // this.items = array.items
        this.headers = array.headers
        this.statuses = array.states
      }.bind(this)
    );
    tododb.find({} , (err, doc) => {
        // console.log(doc)
        this.items = doc;
    })
  },
  computed: {
    shownHeaders: function () {
      let far = this.headers;
      return far.filter((a) => a.tasklist)
    },
  },
};
</script>
