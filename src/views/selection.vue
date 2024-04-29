<template>
  <div id="route">
    <v-form ref="validateForm" class="px-10 pb-10">
      <div class="cops-list">
        <v-row class="d-flex align-center">
          <v-col cols="4" class="d-flex">
            <div class="d-flex align-center flex-column justify-start">
              <div>
                <v-img
                  height="100px"
                  width="100px"
                  style="border-radius: 50%"
                  :src="cops.cops1.image"
                >
                </v-img>
              </div>
              <div>{{ cops.cops1.name }}</div>
            </div>
          </v-col>
          <v-col cols="4">
            <label>Select City</label>
            <v-select
              :rules="[$rules.required]"
              item-text="name"
              item-disabled="isAssigned"
              item-value="id"
              :items="cities"
              v-model="cops.cops1.city"
              outlined
              dense
              placeholder="Select City"
              @change="handelCity"
            >
            </v-select>
          </v-col>
          <v-col cols="4">
            <label>Select Vehicle</label>
            <v-select
              :rules="[$rules.required]"
              item-value="id"
              :items="vehicles"
              v-model="cops.cops1.vehicle"
              item-text="type"
              outlined
              item-disabled="notAvailable"
              dense
              placeholder="Select Vehicle"
              @change="handelVehicle"
            >
            </v-select>
          </v-col>
        </v-row>
      </div>
      <div class="my-6 cops-list">
        <v-row class="d-flex align-center">
          <v-col cols="4" class="d-flex">
            <div class="d-flex align-center flex-column justify-start">
              <div>
                <v-img
                  height="100px"
                  width="100px"
                  style="border-radius: 50%"
                  :src="cops.cops2.image"
                >
                </v-img>
              </div>
              <div>{{ cops.cops2.name }}</div>
            </div>
          </v-col>
          <v-col cols="4">
            <label>Select City</label>
            <v-select
              :rules="[$rules.required]"
              item-text="name"
              item-value="id"
              item-disabled="isAssigned"
              :items="cities"
              v-model="cops.cops2.city"
              outlined
              dense
              placeholder="Select City"
              @change="handelCity"
            >
            </v-select>
          </v-col>
          <v-col cols="4">
            <label>Select Vehicle</label>
            <v-select
              :rules="[$rules.required]"
              item-value="id"
              :items="vehicles"
              v-model="cops.cops2.vehicle"
              item-disabled="notAvailable"
              item-text="type"
              outlined
              dense
              @change="handelVehicle"
              placeholder="Select Vehicle"
            >
            </v-select>
          </v-col>
        </v-row>
      </div>
      <div class="cops-list">
        <v-row class="d-flex align-center">
          <v-col cols="4" class="d-flex">
            <div class="d-flex align-center flex-column justify-start">
              <div>
                <v-img
                  height="100px"
                  width="100px"
                  style="border-radius: 50%"
                  :src="cops.cops3.image"
                >
                </v-img>
              </div>
              <div>{{ cops.cops3.name }}</div>
            </div>
          </v-col>
          <v-col cols="4">
            <label>Select City</label>
            <v-select
              :rules="[$rules.required]"
              :items="cities"
              item-value="id"
              v-model="cops.cops3.city"
              item-disabled="isAssigned"
              outlined
              item-text="name"
              dense
              placeholder="Select City"
              @change="handelCity"
            >
            </v-select>
          </v-col>
          <v-col cols="4">
            <label>Select Vehicle</label>
            <v-select
              :rules="[$rules.required]"
              item-value="id"
              :items="vehicles"
              item-text="type"
              item-disabled="notAvailable"
              v-model="cops.cops3.vehicle"
              @change="handelVehicle"
              outlined
              dense
              placeholder="Select Vehicle"
            >
            </v-select>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex justify-end mt-3">
        <v-btn
          @click="submitData()"
          class="text-capitalize"
          x-large
          outlined
          color="primary"
          :loading="btn_loader"
        >
          Let's See who wins <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "selectionVue",
  data() {
    return {
      vehicle: "",
      btn_loader: false,
      vehicles: [],
      cities: [],
      city: "",
      cops: {
        cops1: {
          name: "Sagar",
          city: "",
          vehicle: "",
          image: require("@/assets/cop1.png"),
        },
        cops2: {
          name: "Pawan",
          city: "",
          vehicle: "",
          image: require("@/assets/cop2.png"),
        },
        cops3: {
          name: "Akash",
          city: "",
          vehicle: "",
          image: require("@/assets/cop3.png"),
        },
      },
    };
  },

  methods: {
    ...mapActions({
      snackBar: "snackBar/showToast",
    }),
    getCities() {
      let data = {};
      const onSuccess = (res) => {
        // console.log(res);
        this.cities = res.data.map((city) => {
          city.isAssigned = false;
          return city;
        });
      };
      const onFailure = () => {};
      //   data["term"] = "";
      return this.$Axios("get", "cities/", {
        data,
        onSuccess,
        onFailure,
        isTokenRequired: false,
      });
    },
    getVehicles() {
      let data = {};
      const onSuccess = (res) => {
        console.log(res);
        this.vehicles = res.data;
      };
      const onFailure = () => {};
      //   data["term"] = "";
      return this.$Axios("get", "vehicles/", {
        data,
        onSuccess,
        onFailure,
        isTokenRequired: false,
      });
    },

    submitData() {
      if (this.$refs.validateForm.validate()) {
        this.btn_loader = true;
        let data = {};
        const onSuccess = (res) => {
          this.btn_loader = false;

          // console.log(res);
          this.snackBar({
            message: res.data,
            color: "success",
            timeout: 3500,
          });
        };
        const onFailure = () => {
          this.btn_loader = false;
        };
        // for (const key in this.cops) {
        //   if (Object.hasOwnProperty.call(this.cops, key)) {
        //     delete this.cops[key].image;
        //   }
        // }
        data["copSelections"] = this.cops;
        return this.$Axios("post", "results/", {
          data,
          onSuccess,
          onFailure,
          isTokenRequired: false,
        });
      } else {
        this.snackBar({
          message: "Please fill all the fields",
          color: "red",
          timeout: 3500,
        });
      }
    },
    handelCity(id) {
      console.log(id);
      this.cities = this.cities.map((city) => {
        if (city.id == id) {
          city.isAssigned = true;
        }
        return city;
      });
    },
    handelVehicle(id) {
      this.vehicles = this.vehicles.map((v) => {
        if (v.id == id && v.count != 0) {
          v.count = v.count - 1;
          console.log(v.count);
          if (v.count == 0) {
            v.notAvailable = true;
          }
        }
        return v;
      });
    },
    // isVehicleDisabled(item) {
    //   return item.count == 0;
    // },
  },
  mounted() {
    this.getCities();
    this.getVehicles();
  },
};
</script>

<style lang="scss" scoped>
.cops-list {
  border: 1px solid #aca6a6;
  box-sizing: border-box;
  padding-left: 40px;
  border-radius: 16px;
  padding: 10px;
  padding-right: 40px;
}
</style>