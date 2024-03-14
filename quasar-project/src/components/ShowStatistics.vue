<template>
  <q-dialog v-model="currentDayStore.showStatistics">
    <q-card
      :style="$q.screen.width <= 450 ? 'min-width: 95%' : 'min-width: 450px;'"
    >
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="charts" label="Charts" />
        <q-tab name="information" label="Additional information" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-if="Object.keys(currentDayStore.macronutrientsHistoryTotal).length"
        v-model="tab"
        animated
      >
        <q-tab-panel name="charts">
          <HistoryCharts />
        </q-tab-panel>

        <q-tab-panel name="information">
          <AdditionalInformation />
        </q-tab-panel>
      </q-tab-panels>

      <div v-else class="flex justify-center">
        <span class="text-h6"> No data </span>
      </div>

      <q-card-actions
        class="flex items-center"
        :class="tab == 'charts' ? 'justify-between' : 'justify-end'"
      >
        <q-select
          v-show="tab == 'charts'"
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
import HistoryCharts from "src/components/HistoryCharts";
import AdditionalInformation from "src/components/AdditionalInformation";
import { useQuasar } from "quasar";

const $q = useQuasar();

const currentDayStore = useCurrentDayStore();

const tab = ref("charts");

const options = ref([
  "Last 30 days",
  "Last 60 days",
  "Last 90 days",
  "Last 180 days",
  "Last 360 days",
  "From The Begining",
]);
</script>