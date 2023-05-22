<template>
  <div>
    <v-row class="white">
      <v-col class="pl-5">
        匯入CSV<input type="file" @change="onFileChange"
      /></v-col>
      <v-col class="text-right pr-5"
        ><v-btn rounded color="primary" @click="onSave">
          <v-icon>mdi-content-save</v-icon> 儲存結果</v-btn
        >
        <v-btn
          rounded
          color="success"
          @click="downloadCSV(csvData, 'data.csv')"
        >
          <v-icon>mdi-download</v-icon> 匯出CSV</v-btn
        >
      </v-col>
    </v-row>
    <v-row justify="center" class="pa-5">
      <v-col :cols="$vuetify.breakpoint.xs ? 12 : 3">
        <div>
          <v-date-picker
            v-model="picker"
            type="month"
            locale="zh-tw"
          ></v-date-picker>
        </div>
      </v-col>
      <v-col class="col-9">
        <v-row>
          <v-col
            :cols="$vuetify.breakpoint.xs ? 12 : 3"
            :class="{ ' pa-2': true, 'red lighten-4': isWarning(key) }"
            :key="key + idx"
            v-for="(mclass, key, idx) in classifyStudentsByAge"
          >
            <div class="mclass">
              <h2 :class="{ 'red--text lighten-1': isWarning(key) }">
                {{ key }} ({{ mclass.length }})
              </h2>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div
                  :class="{
                    student: true,
                    'pink lighten-2': stu.sex === 'F',
                    mannual: stu.manual,
                  }"
                  :key="'stu_' + idx2"
                  v-for="(stu, idx2) in classifyStudentsByAge[key]"
                >
                  <v-icon v-if="stu.isNew" class="white--text"
                    >mdi-new-box</v-icon
                  >
                  {{ stu.name }}
                  <span v-if="stu.ageInMonths >= 0" class="age">{{
                    calculateYearsMonths(stu.ageInMonths)
                  }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="pa-5">
      <table class="table" v-if="clist && clist[0]">
        <thead>
          <th>No.</th>
          <th v-for="(field, key) in fields" :key="'fields' + key">
            {{ field.name }}
          </th>
        </thead>
        <tr class="blue lighten-4">
          <td>+</td>
          <td>
            <v-text-field
              @input="handleInput"
              @change="handleInput"
              :counter="6"
              label="姓名"
              required
            ></v-text-field>
          </td>
          <td>
            <input type="date" v-model="newstu_birth" />
          </td>
          <td>
            <input type="date" v-model="newstu_regdate" />
          </td>
          <td>
            <v-radio-group v-model="newstu_sex" row>
              <v-radio label="男" value="M"></v-radio>
              <v-radio label="女" value="F"></v-radio>
            </v-radio-group>
          </td>

          <td>
            <v-textarea
              :value="newstu_note"
              @input="(e) => (newstu_note = e)"
              hint="Hint text"
              rows="1"
            ></v-textarea>
          </td>
          <td>
            <v-btn
              elevation="2"
              @click="addnewstu"
              :disabled="!(newstu_name && newstu_birth && newstu_regdate)"
              >新增</v-btn
            >
          </td>
        </tr>
        <tr
          v-for="(i, idx) in nlist.filter((i) => i.name)"
          class="orange lighten-4"
          :key="'nlist' + idx"
        >
          <td>{{ clist.filter((i) => i.name).length + 1 }}</td>
          <td>
            <v-icon @click="nlist.splice(idx, 1)">mdi-delete</v-icon>

            {{ i.name }}
          </td>
          <td>{{ i.birth }}</td>
          <td>{{ i.regdate }}</td>
          <td>{{ i.sex }}</td>
          <td>
            <v-textarea :value="i.note" hint="Hint text" rows="1"></v-textarea>
          </td>
          <td><v-checkbox v-model="i.disable"></v-checkbox></td>
        </tr>
        <tr
          v-for="(i, idx) in clist.filter((i) => i.name)"
          :key="'clist' + idx"
        >
          <td>
            {{ idx + 1 }}
          </td>
          <td>
            <v-icon @click="clist.splice(idx, 1)">mdi-delete</v-icon>
            {{ i.name }}
          </td>
          <td>{{ i.birth }}</td>
          <td>{{ i.regdate }}</td>
          <td>{{ i.sex }}</td>
          <td>
            <v-textarea
              :value="i.note"
              @input="(e) => handleNoteInput(e, idx)"
              hint="Hint text"
              rows="1"
            ></v-textarea>
          </td>
          <td><v-checkbox v-model="i.disable"></v-checkbox></td>
        </tr>
      </table>
    </v-row>
  </div>
</template>
<script>
module.exports = {
  methods: {
    isWarning(key) {
      let classifyStudentsByAge = this.classifyStudentsByAge;
      return (
        ((key === "A" || key === "B") &&
          classifyStudentsByAge["A"].length +
            classifyStudentsByAge["B"].length >
            10) ||
        ((key === "C" || key === "D") &&
          classifyStudentsByAge["C"].length +
            classifyStudentsByAge["D"].length >
            10)
      );
    },
    convertToCSV(arr) {
      const csvRows = [];
      const headers = Object.keys(arr[0]);
      csvRows.push(headers.join(","));

      for (const obj of arr) {
        const values = headers.map((header) => {
          const escapedValue = obj[header].toString().replace(/"/g, '\\"');
          return `"${escapedValue}"`;
        });
        csvRows.push(values.join(","));
      }

      return csvRows.join("\n");
    },
    downloadCSV(data, filename) {
      let csvContent = this.convertToCSV(data);
      csvContent = "\ufeff" + csvContent;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      if (navigator.msSaveBlob) {
        // For IE 10 or older
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          // Modern browsers
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    handleNoteInput(event, i) {
      this.$set(this.clist[i], "note", event);
    },
    handleInput(event) {
      this.newstu_name = event;
    },
    addnewstu: function () {
      this.nlist.push({
        name: this.newstu_name,
        birth: this.newstu_birth,
        regdate: this.newstu_regdate,
        disable: this.newstu_disable,
        note: this.newstu_note,
        sex: this.newstu_sex,
        manual: true,
      });
      this.newstu_name = "";
      this.newstu_birth = moment().format("YYYY-MM-DD");
      this.newstu_regdate = moment().format("YYYY-MM-DD");
      this.newstu_sex = "M";
      this.newstu_note = "";
    },

    onSave() {
      localStorage.setItem(
        "_clist",
        JSON.stringify([...this.clist, ...this.nlist])
      );
    },

    onFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const decoder = new TextDecoder("UTF-8");
        const csvData = decoder.decode(new Uint8Array(data));
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            this.clist = results.data;
          },
          error: (error) => {
            console.log(error);
          },
        });
      };
      reader.readAsArrayBuffer(file);
    },
    calculateYearsMonths: function (months) {
      const years = Math.floor(months / 12); // 計算年份
      const remainingMonths = months % 12; // 計算剩餘的月份

      let result = "";

      if (years > 0) {
        result += years + "Y "; // 添加年份結果
      }

      if (remainingMonths > 0) {
        result += remainingMonths + "M"; // 添加剩餘的月份結果
      }

      if (remainingMonths == 0 && years == 0) result = "0M";

      return result.trim(); // 去除前後空格
    },
    test: function () {
      this.message = "clicked";
    },
    getData: function () {
      let that = this;

      let _clist = localStorage.getItem("_clist");
      if (_clist) {
        let clit = JSON.parse(_clist);

        that.clist = clit.sort((a, b) =>
          moment(a.regdate).diff(moment(b.regdate))
        );
      }
    },
  },
  computed: {
    csvData: function () {
      return [...this.clist, ...this.nlist].filter((i) => i.name);
    },
    classifyStudentsByAge: function () {
      let date = moment(this.picker + "-01", "YYYY-MM-DD");
      let clist = this.clist;
      let nlist = this.nlist;
      let students = [...nlist, ...clist].filter((i) => i.name);

      const ageRanges = {
        A: [0, 5],
        B: [6, 11],
        C: [12, 17],
        D: [18, 36],
      };

      const classifiedStudents = {
        A: [],
        B: [],
        C: [],
        D: [],
      };

      students.forEach((student) => {
        const birthDate = moment(student.birth, "YYYY-MM-DD");
        const ageInMonths = date.diff(birthDate, "months");
        const regDate = moment(student.regdate, "YYYY-MM-DD");
        const regdiff = date.diff(regDate, "months");
        const isNew =
          moment(student.regdate, "YYYY-MM").format("YYYYMM") ===
          moment(this.picker + "-01", "YYYY-MM").format("YYYYMM");

        for (const [range, [min, max]] of Object.entries(ageRanges)) {
          if (
            ageInMonths >= min &&
            ageInMonths <= max &&
            regdiff >= 0 &&
            student.disable != true
          ) {
            classifiedStudents[range].push({
              ...student,
              regdiff,
              ageInMonths,
              isNew,
            });
            break;
          }
        }
      });

      return classifiedStudents;
    },
  },
  created: function () {
    this.getData();
  },
  mounted: function () {},
  components: {
    CsvDownload: httpVueLoader("../components/CsvDownload.vue"),
  },
  data: function () {
    return {
      picker: moment().format("YYYY-MM"),
      clist: [],
      newstu_name: "",
      newstu_birth: moment().format("YYYY-MM-DD"),
      newstu_regdate: moment().format("YYYY-MM-DD"),
      newstu_sex: "M",
      newstu_disable: "",
      newstu_note: "",
      nlist: [],
      fields: [
        { name: "名稱", key: "name" },
        { name: "出生日期", key: "birth" },
        { name: "預計入托日期", key: "regdate" },
        { name: "性別", key: "sex" },
        { name: "備註", key: "note" },
        { name: "忽略", key: "disable" },
      ],
    };
  },
};
</script>
<style scoped>
.student {
  background-color: cadetblue;
  margin: 5px;
  color: #fff;
  text-align: center;
  padding: 5px;
  max-width: 10rem;
  padding-right: 15px;
  padding-left: 15px;
  border-radius: 16px;
}
.student.mannual {
  color: orange;
}
.age {
  background: #ffffff2b;
  color: #fff;
  padding: 3px;
  font-size: 10px;
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tr:hover {
  background-color: #f1f1f1;
}
.mclass {
  border: 1px dashed #888;
  background: #fff;
  border-radius: 8px;
  padding: 5px;
  text-align: center;
}
</style>

