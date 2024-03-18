import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { uid } from 'quasar'
import { db } from 'src/boot/firebase'
import { ref as dbRef, set, onChildAdded, onChildChanged, remove, get } from "firebase/database";
import { useUsersStore } from './usersStore';

export const useProductStore = defineStore('productStore', () => {

  const searchProductContent = vueRef('')

  const showProductForm = vueRef(false)
  const showProductDatabaseForm = vueRef(false)

  const userStore = useUsersStore()

  const newProduct = vueRef({
    name: "",
    calories: null,
    proteins: null,
    fats: null,
    carbohydrates: null,
    units: ''
  });

  const getUserId = () => { return userStore.userDetails.id }

  const firebaseAddNewProduct = () => {
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

    const userId = getUserId()
    set(dbRef(db, `users/${userId}/products/${uid()}`), {
      name: newProduct.value.name,
      calories: newProduct.value.calories,
      proteins: newProduct.value.proteins,
      fats: newProduct.value.fats,
      carbohydrates: newProduct.value.carbohydrates,
      units: newProduct.value.units,
    })

    newProduct.value = {
      name: "",
      calories: null,
      proteins: null,
      fats: null,
      carbohydrates: null,
    };
  }

  const products = vueRef({})
  const loadingProducts = vueRef(true)
  const firebaseGetProducts = () => {
    const userId = getUserId()

    onChildAdded(dbRef(db, `users/${userId}/products`), snapshot => {
      products.value[snapshot.key] = snapshot.val()
    })

    onChildChanged(dbRef(db, `users/${userId}/products`), snapshot => {
      products.value[snapshot.key] = snapshot.val()
    })

    get(dbRef(db, `users/${userId}/products`)).then((snapshot) => {
      if (!snapshot.exists()) {
        loadingProducts.value = false
      }
    })
  }

  const firebaseDeleteProduct = (payLoad) => {
    const userId = getUserId()
    if (payLoad) {
      remove(dbRef(db, `users/${userId}/products/${payLoad}`))
    }
  }

  return {
    products,
    loadingProducts,
    searchProductContent,
    showProductDatabaseForm,
    showProductForm,
    newProduct,
    firebaseAddNewProduct,
    firebaseGetProducts,
    firebaseDeleteProduct,
  }
});
