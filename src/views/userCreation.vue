<template>
  <div style="height: 100vh" class="d-flex justify-center align-center">
    <v-card class="" width="450px">
      <v-btn icon @click="$router.go(-1)">
        <v-icon color="primary"> mdi-keyboard-backspace</v-icon>
      </v-btn>
      <v-card-title class="text--primary mb-4" style="font-size: 27px">
        Create User
      </v-card-title>
      <v-container>
        <v-form ref="user">
          <v-row>
            <v-col cols="12" class="py-0">
              <label for="name">Enter Name</label>
              <v-text-field
                :rules="[$rules.required]"
                type="text"
                v-model="name"
                placeholder="Enter Name"
                color="primary"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <label for="password">Enter Password</label>
              <v-text-field
                color="primary"
                :rules="[$rules.required]"
                type="password"
                v-model="password"
                placeholder="Enter Password"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                :loading="loading"
                @click="makeUser()"
                width="100%"
                color="primary"
                class="white--text text-capitalize"
              >
                Add User
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "UserCreationPage",
  data() {
    return {
      loading: false,
      name: "",
      password: "",
    };
  },
  methods: {
    ...mapActions({
      snackBar: "snackBar/showToast",
    }),
    makeUser() {
      this.snackBar({
        message: "User created successfully",
        color: "success",
        timeout: 4500,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>