<template>
  <div>
    <div style="image-div">
      <v-img height="100vh" :src="police_image"></v-img>
      <div class="start-game">
        <a
          @click="show = true"
          href="#route"
          target=""
          rel="noopener noreferrer"
        >
          <v-btn x-large class="btn-game" color="blue"
            >Let's catch the Criminal
          </v-btn>
        </a>
      </div>
    </div>
    <Selection v-if="show" class="mt-15"> </Selection>
  </div>
</template>

<script>
import Selection from "@/views/selection.vue";
export default {
  name: "LandingPage",
  components: { Selection },
  data() {
    return {
      show: false,
      police_image: require("@/assets/wallpapers.jpg"),
    };
  },
};
</script>

<style lang="scss" scoped>
.image-div {
  //   height: 100vh;
  position: relative;
}
.btn-game {
  background-color: #2196f3d9 !important;
}
.start-game {
  position: absolute;
  top: 5%;
  //   bottom: 5%;
  left: 43%;
  right: 50%;
}
.btn-game {
  text-transform: capitalize;
  color: #fff;
}
</style>