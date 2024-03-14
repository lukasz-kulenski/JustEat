<template>
  <div>
    <div class="text-h6 text-center">Calorie Charts</div>

    <column-chart
      suffix="kcal"
      thousands=","
      empty="No data"
      :data="currentDayStore.historyChartsData"
    ></column-chart>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";

const currentDayStore = useCurrentDayStore();
</script>