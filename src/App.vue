<template>
  <v-app>
    <snackBar />
    <router-view />
  </v-app>
</template>

<script>
import snackBar from "./components/snackBar/snackBar.vue";
import "vuetify/dist/vuetify.min.css";

export default {
  name: "App",
  components: {
    snackBar,
  },
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
