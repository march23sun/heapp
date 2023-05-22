<template>
  <span>{{ nbrStr }}</span>
</template>
<script>
module.exports = {
  watch: {
    nbr: function (newVal, oldVal) {
      this.incNbrRec(oldVal, newVal, Math.floor((newVal - oldVal) * 0.1));
    },
  },
  created: function () {
    this.tmpNbr = this.nbr;
  },
  data: function () {
    return {
      tmpNbr: 0,
    };
  },
  props: {
    nbr: Number,
    speed: {
      default: 10,
      type: Number,
    },
  },
  computed: {
    nbrStr: function () {
      return this.$formatNumber(this.tmpNbr);
    },
  },
  methods: {
    incNbrRec: function (startNbr, endNbr, step) {
      let that = this;
      if (startNbr <= endNbr) {
        that.tmpNbr = startNbr;
        setTimeout(function () {
          //Delay a bit before calling the function again.
          that.incNbrRec(startNbr + step, endNbr, step);
        }, that.speed);
      }
    },
  },
};
</script>
<style>
</style>

