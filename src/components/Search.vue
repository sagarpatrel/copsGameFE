<template>
  <div>
    <v-form class="mb-8">
      <v-row>
        <v-col md="2" cols="6">
          <label for="date">Form Date</label>
          <v-menu
            ref="menu"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="from_date"
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
              v-model="from_date"
              @input="menu1 = false"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col md="2" cols="6">
          <label for="date">To Date</label>
          <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="to_date"
                placeholder="Select Date"
                :rules="[$rules.required]"
                prepend-inner-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                background-color="#FFF"
                @click="menu2 = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="to_date"
              @input="menu2 = false"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col md="2" cols="6">
          <label @click="getTags()" for="categories">Categories</label>
          <v-select
            :items="categories"
            v-model="major_head"
            outlined
            dense
            placeholder="Categories"
          >
          </v-select>
        </v-col>
        <v-col md="2" cols="6">
          <label for="categories">Sub Categories Types </label>
          <v-text-field
            v-model="minor_head"
            outlined
            dense
            placeholder="Sub Categories"
          >
          </v-text-field>
        </v-col>
        <v-col md="2" cols="6">
          <label for="">Uploaded By</label>
          <v-text-field
            v-model="uploaded_by"
            outlined
            dense
            placeholder="Uploaded By"
          >
          </v-text-field>
        </v-col>
        <v-col md="2" cols="6">
          <label for="categories">Document tags </label>
          <!-- :items="tag" -->
          <v-combobox
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
      </v-row>
      <v-btn
        :loading="loading"
        @click="searchResult()"
        color="primary"
        class="white--text text-capitalize"
      >
        <!-- width="100%" -->
        Search Document
      </v-btn>
    </v-form>
    <v-card>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="items"
        hide-default-footer
      >
        <template v-slot:[`item.file_url`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                @click="openImage(item.file_url)"
                color="primary"
                class="white--text text-capitalize"
              >
                <v-icon> mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-menu>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="downloadZip(item.file_url)"
                v-on="on"
                icon
                color="primary"
                class="white--text text-capitalize"
              >
                <v-icon> mdi-download</v-icon>
              </v-btn>
            </template>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
import axios from "axios";
import JSZip from "jszip";

export default {
  name: "SearchComponent",
  data() {
    return {
      categories: ["Personal", "Professional"],
      search: "",
      loading: false,
      menu1: false,
      menu2: false,
      from_date: null,
      to_date: "",
      tags: [],
      uploaded_by: "",
      major_head: "",
      minor_head: "",
      selected_tag: [],
      items: [],
      headers: [
        {
          text: "Categories",
          align: "start",
          filterable: false,
          value: "major_head",
          sortable: false,
          class: "table_header white--text font-weight-medium ",
        },
        {
          text: "Sub Categories",
          align: "start",
          filterable: false,
          value: "minor_head",
          sortable: false,
          class: "table_header white--text font-weight-medium ",
        },

        {
          text: "Date",
          align: "start",
          filterable: true,
          value: "document_date",
          sortable: true,
          class: "table_header white--text font-weight-medium ",
        },
        {
          text: "Remarks",
          align: "start",
          filterable: true,
          value: "document_remarks",
          sortable: true,
          class: "table_header white--text font-weight-medium ",
        },
        {
          text: "Upload Time",
          align: "start",
          filterable: true,
          value: "upload_time",
          sortable: true,
          class: "table_header white--text font-weight-medium ",
        },
        {
          text: "Uploaded BY ",
          align: "start",
          filterable: false,
          value: "uploaded_by",
          sortable: false,
          class: "table_header white--text font-weight-medium ",
        },
        {
          text: "Image",
          align: "start",
          filterable: false,
          value: "file_url",
          sortable: false,
          class: "table_header white--text font-weight-medium ",
        },
        {
          align: "end",
          filterable: false,
          value: "action",
          sortable: false,
          class: "table_header white--text font-weight-medium ",
        },
      ],
    };
  },
  methods: {
    updateTags() {
      this.tags = [];
      this.selected_tag.forEach((tag) => {
        this.tags.push({ tag_name: tag });
      });
    },
    openImage(file) {
      window.open(file);
    },
    remove(item) {
      this.selected_tag.splice(this.selected_tag.indexOf(item), 1);
    },
    searchResult() {
      this.loading = true;
      if (this.to_date) {
        this.to_date = dayjs(this.to_date).format("DD-MM-YYYY");
      }
      if (this.from_date) {
        this.from_date = dayjs(this.from_date).format("DD-MM-YYYY");
      }
      let data = {};
      const onSuccess = (res) => {
        this.items = res.data.data;
        this.loading = false;
      };
      const onFailure = () => {};
      data["major_head"] = this.major_head;
      data["minor_head"] = this.minor_head;
      data["from_date"] = this.from_date;
      data["to_date"] = this.to_date;
      data["tags"] = this.tags;
      data["uploaded_by"] = this.uploaded_by;

      return this.$Axios("post", this.$apiUrl.SEARCH_DOCUMENT, {
        data,
        onSuccess,
        onFailure,
        isTokenRequired: true,
      });
    },
    async downloadZip(url) {
      const zip = new JSZip();
      const filename = url.substring(url.lastIndexOf("/") + 1);
      try {
        const response = await axios.get(url, { responseType: "arraybuffer" });

        // Add file to the zip
        zip.file(filename, response.data);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
      const content = await zip.generateAsync({ type: "blob" });

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "files.zip";
      link.click();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>