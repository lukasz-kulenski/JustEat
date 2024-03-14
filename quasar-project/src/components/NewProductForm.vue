<template>
  <div class="row">
    <q-dialog v-model="productStore.showProductForm">
      <q-card style="min-width: 350px" class="q-pa-md">
        <q-form
          @submit="addNewProduct"
          @keyup.enter="addNewProduct"
          class="q-gutter-sm"
        >
          <q-input
            outlined
            v-model="newProduct.name"
            type="text"
            placeholder="Name of the Product"
            dense
          />

          <q-input
            outlined
            v-model.number="newProduct.calories"
            type="number"
            placeholder="Calories per 100g of Product"
            dense
            step="0.1"
          />

          <q-input
            outlined
            dense
            step="0.1"
            v-model.number="newProduct.proteins"
            type="number"
            placeholder="Protein per 100g of Product"
          />

          <q-input
            outlined
            v-model.number="newProduct.fats"
            type="number"
            placeholder="Fat per 100g of Product"
            dense
            step="0.1"
          />

          <q-input
            outlined
            v-model.number="newProduct.carbohydrates"
            type="number"
            placeholder="Carbohydrates per 100g of Product"
            dense
            step="0.1"
          />
        </q-form>

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
            @click="addNewProduct()"
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
import { useQuasar } from "quasar";

const $q = useQuasar()

const productStore = useProductStore();

const newProduct = ref({
  name: "",
  calories: null,
  proteins: null,
  fats: null,
  carbohydrates: null,
});

const addNewProduct = () => {
  if (
    !newProduct.value.name ||
    !newProduct.value.calories ||
    !newProduct.value.fats ||
    !newProduct.value.proteins ||
    !newProduct.value.carbohydrates
  ) {
    $q.notify({
      type: "negative",
      message: "Fiil in all fields.",
    });

    return;
  }

  productStore.firebaseAddNewProduct(newProduct.value);
  newProduct.value = {
    name: "",
    calories: null,
    proteins: null,
    fats: null,
    carbohydrates: null,
  };
};
</script>