<template>
  <div>
    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      class="q-pa-md"
      style="width: 100%"
      :style="$q.screen.height > 670 ? 'height: 85dvh;' : 'height: 80dvh;'"
    >
      <q-list
        v-show="
          Object.keys(filteredProducts).length ||
          Object.keys(productStore.products).length
        "
        bordered
        separator
      >
        <div class="flex items-center justify-between">
          <q-item-label header>Name</q-item-label>
          <q-item-label header class="gt-xs"
            >Calories per 100g / 1 piece</q-item-label
          >
          <q-item-label header>Options</q-item-label>
        </div>
        <q-separator />

        <q-item
          v-for="(product, key) in productStore.searchProductContent
            ? filteredProducts
            : productStore.products"
          :key="key"
          @click="showProduct(product)"
          clickable
          v-ripple
          class="flex items-center justify-between"
        >
          <q-item-section top class="col-sm-3 col-xs-7">
            <q-item-label class="text-bold">{{ product.name }}</q-item-label>
          </q-item-section>

          <q-item-section top class="gt-xs text-center absolute-center col-6">
            <q-item-label>
              <span class="text-weight-medium"
                >kcal: {{ product.calories }}</span
              >
              <span class="text-grey-8">
                Proteins: {{ product.proteins }}g</span
              >
              <span class="text-grey-8">
                Carbohydrates: {{ product.carbohydrates }}g</span
              >
              <span class="text-grey-8"> Fats: {{ product.fats }}g</span>
            </q-item-label>
          </q-item-section>

          <q-item-section top side class="col-sm-3 col-xs-5">
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                @click.stop="addProduct(key)"
                size="12px"
                flat
                round
                icon="done"
                title="add"
              />
              <q-btn
                @click.stop="deleteProduct(key)"
                size="12px"
                flat
                round
                icon="delete"
                title="delete"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useProductStore } from "src/stores/productStore";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useQuasar } from "quasar";
import { customScrollBar } from "src/composables/ScrollBar.js";

const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const $q = useQuasar();

const productStore = useProductStore();
const currentDayStore = useCurrentDayStore();

const filteredProducts = ref({});
watch(
  () => productStore.searchProductContent,
  (newVal) => {
    if (newVal) {
      filteredProducts.value = {};
      Object.keys(productStore.products).forEach((key) => {
        if (
          productStore.products[key].name
            .toLowerCase()
            .includes(newVal.toLowerCase().trim())
        ) {
          filteredProducts.value[key] = productStore.products[key];
        }
      });
    }
  }
);

const showProduct = (product) => {
  $q.dialog({
    dark: true,
    title: `<span class="flex justify-center">${product.name}</span>`,
    message: `<span class="flex">Kcal: ${product.calories}, Proteins: ${product.proteins}g, Carbohydrates: ${product.carbohydrates}g, Fats: ${product.fats}g</span>`,
    html: true,
    ok: {
      push: true,
      color: "primary",
    },
    persistent: false,
  });
};

const addProduct = (id) => {
  $q.dialog({
    dark: true,
    message: "Enter Quantity (grams / pieces)",
    prompt: {
      model: "",
      type: "number",
      step: 0.1,
      min: 0.1,
    },
    cancel: {
      push: true,
      color: "negative",
    },
    ok: {
      push: true,
      color: "primary",
    },
    persistent: false,
  }).onOk((quantity) => {
    currentDayStore.firebaseAddProduct(productStore.products[id], quantity);
  });
};

const deleteProduct = (id) => {
  $q.dialog({
    dark: true,
    title: "Confirm",
    message: "Are you sure?",
    cancel: {
      push: true,
      color: "negative",
    },
    ok: {
      push: true,
      color: "primary",
    },
    persistent: false,
  }).onOk(() => {
    productStore.firebaseDeleteProduct(id);
    delete productStore.products[id];
  });
};
</script>

<style lang="scss" scoped>
.q-item__section--main {
  flex: none;
}
</style>