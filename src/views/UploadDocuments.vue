<template>
  <v-container>
    <div
      style="color: #2d8cff; cursor: pointer"
      @click="$router.push('add-user')"
    >
      Click here to Add User
    </div>
    <div class="title mt-7 mb-7 text-center">
      Document Mangement System Interface
    </div>
    <div class="search">Search</div>
    <Search />
    <v-form ref="form" class="mt-12">
      <div class="search">Form</div>
      <!-- <label for="">Step 1:</label> -->
      <v-row>
        <v-col md="4" sm="12">
          <label for="date">Date</label>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="docObject.document_date"
                placeholder="Select Date"
                :rules="[$rules.required]"
                prepend-inner-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                background-color="#FFF"
                @click="menu = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="docObject.document_date"
              @input="menu = false"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col md="4" sm="12">
          <label @click="getTags()" for="categories">Categories</label>
          <v-select
            :rules="[$rules.required]"
            :items="categories"
            v-model="docObject.major_head"
            outlined
            dense
            placeholder="Select Categories"
            item-value="categories"
          >
          </v-select>
        </v-col>
        <v-col md="4" sm="12">
          <label for="categories">
            {{ placeholder ? placeholder : "Select" }}
          </label>
          <v-select
            :rules="[$rules.required]"
            v-model="docObject.minor_head"
            :items="dynamicSelect"
            outlined
            dense
            :placeholder="placeholder"
          >
          </v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="4" sm="12">
          <label class="text-field">Upload Documents</label>
          <label for="doc" class="add-image">
            <div v-if="!document_preview">
              <v-icon large color="#fff">mdi-cloud-upload</v-icon>
            </div>
            <v-img
              v-if="document_preview"
              :src="document_preview"
              class="doc-logo"
            ></v-img>
          </label>
          <input
            @change="addDocument()"
            type="file"
            accept=".pdf, image/*"
            alt="document input field"
            ref="docField"
            id="doc"
            style="visibility: hidden"
          />
        </v-col>
        <v-col md="4" sm="12">
          <label for="categories">Select Document tags </label>
          <v-combobox
            :rules="[$rules.required]"
            :items="tag"
            dense
            v-model="selected_tag"
            chips
            clearable
            label="Select Tags"
            multiple
            solo
            @change="updateTags()"
          >
            <!-- prepend-icon="mdi-filter-variant" -->
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="remove(item)"
              >
                <strong>{{ item }}</strong
                >&nbsp;
                <!-- <span>(interest)</span> -->
              </v-chip>
            </template>
          </v-combobox>
          <!-- {{ docObject.tags }} -->
        </v-col>
        <v-col md="4" sm="12">
          <label for="mobile">Remarks</label>
          <v-text-field
            dense
            :rules="[$rules.text]"
            type="text"
            v-model="docObject.document_remarks"
            label="Remarks"
            outlined
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <div class="text-right">
      <v-btn
        :loading="loading"
        @click="uploadDoc()"
        color="primary"
        class="white--text text-capitalize"
      >
        Submit Document
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import Search from "@/components/Search.vue";
import { mapActions } from "vuex";

export default {
  components: { Search },
  data() {
    return {
      loading: false,
      menu: false,
      categories: ["Personal", "Professional"],
      demo: {
        name: {
          major_head: "Company",
          minor_head: "Work Order",
          document_date: "12-02-2024",
          document_remarks: "Test Remarks",
          tags: [
            { tag_name: "RMC" },
            { tag_name: "2024" },
            { tag_name: "work_order" },
          ],
          user_id: "sagar",
        },
      },
      demo2: {
        document_date: "24/02/2024",
        major_head: "Professional",
        minor_head: "IT",
        document_remarks: "jhj",
        tags: [{ tag_name: "2024" }, { tag_name: "RMC" }],
        user_id: "Sagar",
      },
      docObject: {
        document_date: null,
        major_head: "",
        minor_head: "",
        document_remarks: "",
        tags: [], // An array of tags
        user_id: "Sagar",
      },
      placeholder: "",
      name: ["Sagar", "Rahul", "Robin", "Akash", "Pawan", "Rudra"],
      departments: ["Accounts", "HR", "IT", "Finance"],
      tag: [],
      selected_tag: [],
      document_preview: "",
      document_file: null,
    };
  },
  computed: {
    dynamicSelect() {
      if (this.docObject.major_head == "Personal") {
        return this.name;
      } else if (this.docObject.major_head == "Professional") {
        return this.departments;
      }
      return [];
    },
  },
  watch: {
    "docObject.major_head": {
      handler(value) {
        if (value == "Personal") {
          this.placeholder = "Select Personal";
        } else if (value == "Professional") {
          this.placeholder = "Select Professional";
        }
      },
    },
  },
  mounted() {
    this.getTags();
  },
  methods: {
    ...mapActions({
      snackBar: "snackBar/showToast",
    }),
    updateTags() {
      this.docObject.tags = [];
      this.selected_tag.forEach((tag) => {
        this.docObject.tags.push({ tag_name: tag });
      });
    },
    remove(item) {
      this.selected_tag.splice(this.selected_tag.indexOf(item), 1);
    },

    getTags() {
      let data = {};
      const onSuccess = (res) => {
        res.data.data.forEach((label) => {
          this.tag.push(label.label);
        });
      };
      const onFailure = () => {};
      data["term"] = "";
      return this.$Axios("post", "/documentTags/", {
        data,
        onSuccess,
        onFailure,
        isTokenRequired: true,
      });
    },

    uploadDoc() {
      if (this.$refs.form.validate() && this.document_file) {
        let data = new FormData();
        this.loading = true;
        const onSuccess = () => {
          this.loading = false;
          this.snackBar({
            message: "Document successfully Add",
            color: "success",
            timeout: 4500,
          });
        };
        const onFailure = () => {
          this.loading = false;
        };
        this.docObject.document_date = dayjs(
          this.docObject.document_date
        ).format("DD-MM-YYYY");
        data.append("file", this.document_file);
        data.append("data", JSON.stringify(this.docObject));
        return this.$Axios("post", this.$apiUrl.SAVE_DOCUMENT, {
          data,
          onSuccess,
          onFailure,
          isTokenRequired: true,
        });
      } else {
        this.snackBar({
          message: "All fields are required",
          color: "warning",
          timeout: 4500,
        });
      }
    },
    addDocument() {
      this.document_file = this.$refs.docField.files.item(0);
      this.document_preview = URL.createObjectURL(this.document_file);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  font-size: 1.5rem;
  color: #2d8cff;
  font-weight: 500;
}
.add-image {
  border: 1px dashed black;
  display: block;
  height: 150px;
  width: 150px;
  background-color: #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.doc-logo {
  height: 150px;
  widows: 150px;
}
.title {
  font-size: 2rem !important;
  font-weight: 500;
}
</style>