<template>
  <q-dialog v-model="currentDayStore.showHistoryCharts">
    <q-card style="min-width: 90%">
      <div class="text-h6 text-center">Calorie Charts</div>

      <column-chart
        suffix="kcal"
        thousands=","
        empty="No data"
        :data="currentDayStore.historyChartsData"
      ></column-chart>

      <q-card-actions class="flex justify-between">
        <q-select
          rounded
          outlined
          dense
          v-model="currentDayStore.chartScope"
          :options="options"
          hint="Select Scope"
        />
        <q-btn
          flat
          v-close-popup
          no-caps
          label="Close"
          class="text-white bg-red-5"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";

const currentDayStore = useCurrentDayStore();

const options = ref([
  "Last 30 days",
  "Last 60 days",
  "Last 90 days",
  "Last 180 days",
  "Last 360 days",
  "From The Begining",
]);
</script>