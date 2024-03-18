<template>
  <div>
    <q-dialog v-model="productStore.showProductForm">
      <q-card
        class="q-pa-md"
      style="max-width: 490px;"  :style="$q.screen.width <= 500 ? 'min-width: 95%' : 'min-width: 490px'"
      >
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="Grams" label="Grams" />
            <q-tab name="Pieces" label="Pieces" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="Grams">
              <div class="text-h6">Add a new product (in grams)</div>
              <NewProductForm :tab="tab" />
            </q-tab-panel>

            <q-tab-panel name="Pieces">
              <div class="text-h6">Add a new product (in pieces)</div>
              <div class="text-caption">
                You can also use other units of measurement, such as one
                tablespoon of something, etc
              </div>
              <NewProductForm :tab="tab" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <q-card-actions class="flex justify-end">
          <q-btn
            flat
            no-caps
            v-close-popup
            padding="6px 30px"
            label="Close"
            class="bg-red-6 text-white"
          />

          <q-btn
            @click="addNewProduct"
            flat
            no-caps
            v-close-popup
            padding="6px 30px"
            label="Add"
            type="submit"
            class="bg-primary text-white"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import { useProductStore } from "src/stores/productStore";
import NewProductForm from "./NewProductForm";
import { useQuasar } from "quasar";

const $q = useQuasar();

const tab = ref("Grams");

const productStore = useProductStore();

const addNewProduct = () => {
  if (tab.value == "Grams") productStore.newProduct.units = "grams";
  else productStore.newProduct.units = "pieces";

  productStore.firebaseAddNewProduct();
};
</script>