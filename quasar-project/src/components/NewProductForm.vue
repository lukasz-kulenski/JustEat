<template>
  <div>
    <q-form
      @submit="addNewProduct"
      @keyup.enter="addNewProduct"
      class="q-gutter-sm q-mt-xl"
    >
      <q-input
        outlined
        v-model="productStore.newProduct.name"
        type="text"
        placeholder="Name of the product"
        dense
      />

      <q-input
        outlined
        v-model.number="productStore.newProduct.calories"
        type="number"
        :placeholder="
          tab == 'Grams'
            ? 'Calories per 100g of Product'
            : 'Calories per 1 piece of product'
        "
        dense
        step="0.1"
      />

      <q-input
        outlined
        dense
        step="0.1"
        v-model.number="productStore.newProduct.proteins"
        type="number"
        :placeholder="
          tab == 'Grams'
            ? 'Protein per 100g of Product'
            : 'Protein per 1 piece of product'
        "
      />

      <q-input
        outlined
        v-model.number="productStore.newProduct.fats"
        type="number"
        :placeholder="
          tab == 'Grams'
            ? 'Fat per 100g of Product'
            : 'Fat per 1 piece of product'
        "
        dense
        step="0.1"
      />

      <q-input
        outlined
        v-model.number="productStore.newProduct.carbohydrates"
        type="number"
        :placeholder="
          tab == 'Grams'
            ? 'Carbohydrates per 100g of Product'
            : 'Carbohydrates per 1 piece of product'
        "
        dense
        step="0.1"
      />
    </q-form>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useProductStore } from "src/stores/productStore";

const props = defineProps({
  tab: String,
});

const productStore = useProductStore();

const addNewProduct = () => {
  if(props.tab == 'Grams') productStore.newProduct.units = 'grams'
  else productStore.newProduct.units = 'pieces'

  productStore.firebaseAddNewProduct()
}
</script>