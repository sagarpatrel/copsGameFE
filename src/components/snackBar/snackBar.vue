<template>
  <v-snackbar
    v-model="snackBar.show"
    :color="snackBar.config.color"
    :multi-line="snackBar.config.multi_line"
    :top="snackBar.config.top"
    :bottom="snackBar.config.bottom"
    :left="snackBar.config.left"
    :right="snackBar.config.right"
    :timeout="snackBar.config.timeout"
  >
    <div class="ma-0 text-capitalize d-flex justify-space-between align-center">
      <div>
        {{ snackBar.config.message }}
      </div>
      <div>
        <v-btn
          icon
          @click="closeSnackBar"
          class="px-0 ml-2"
          v-if="!$store.state.showMenu"
        >
          <v-icon color=""> mdi-close-circle-outline </v-icon>
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "SnackBar",
  computed: {
    snackBar() {
      return this.$store.state.snackBar;
    },
  },
  methods: {
    ...mapActions({ closeSnack: "snackBar/hideToast" }),
    closeSnackBar() {
      this.closeSnack();
    },
  },
};
</script>

<style scoped></style>
