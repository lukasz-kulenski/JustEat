import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { useQuasar } from 'quasar'
import { db, auth } from 'src/boot/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult } from "firebase/auth";
import { ref as dbRef, set, get, update } from "firebase/database";
import { useRouter, useRoute } from 'vue-router';
import { useCurrentDayStore } from './currentDayStore';
import { useProductStore } from './productStore';

export const useUsersStore = defineStore('usersStore', () => {

    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const currentDayStore = useCurrentDayStore()
    const productStore = useProductStore()

    const userDetails = vueRef({
        userName: '',
        id: '',
        macronutrients: {
            calories: 0,
            proteins: 0,
            fats: 0,
            carbohydrates: 0,
        },
    })

    const showMacronutrientsForm = vueRef(false)

    const createUser = (payLoad, id) => {
        set(dbRef(db, `users/${id}`), {
            firebaseUserDetails: {
                name: payLoad.name,
                email: payLoad.email,
                macronutrients: {
                    calories: 2010,
                    carbohydrates: 250,
                    fats: 50,
                    proteins: 140
                }
            }
        })
    }

    const firebaseRegisterUser = (payLoad) => {
        if (payLoad.name.trim() && payLoad.email.trim() && payLoad.password.trim()) {

            createUserWithEmailAndPassword(auth, payLoad.email, payLoad.password)
                .then(response => {
                    $q.notify({
                        type: 'positive',
                        iconL: "check_circle",
                        message: 'Account created successfully.'
                    })

                    const id = response.user.uid;

                    createUser(payLoad, id)

                    userDetails.value = {
                        userName: payLoad.name,
                        macronutrients: {
                            calories: 2010,
                            carbohydrates: 250,
                            fats: 50,
                            proteins: 140
                        },
                        id: id,
                    }

                    $q.loading.show()
                    router.push(`/${id}`)
                })
                .catch((error) => {
                    const errorCode = error.code;

                    if (errorCode == 'auth/invalid-email') {
                        $q.notify({
                            type: 'negative',
                            icon: 'warning',
                            message: 'Invalid email.'
                        })
                    }
                    if (errorCode == 'auth/weak-password') {
                        $q.notify({
                            type: 'negative',
                            icon: 'warning',
                            message: 'Weak password.'
                        })
                    }
                    if (errorCode == 'auth/email-already-in-use') {
                        $q.notify({
                            type: 'negative',
                            icon: 'warning',
                            message: 'Email alreasy in use.'
                        })
                    }
                });
        } else {
            $q.notify({
                type: 'negative',
                iconL: "warning",
                message: 'Fill in all fields.'
            })
        }
    }

    const firebaseLoginUser = (payLoad) => {
        if (payLoad.email.trim() && payLoad.password.trim()) {
            signInWithEmailAndPassword(auth, payLoad.email, payLoad.password)
                .then((response) => {
                    $q.loading.show()
                })
                .catch((error) => {
                    const errorCode = error.code
                    if (errorCode == 'auth/invalid-email') {
                        $q.notify({
                            type: 'negative',
                            iconL: "warning",
                            message: 'Invalid email.'
                        })
                    }
                    if (errorCode == 'auth/invalid-login-credentials') {
                        $q.notify({
                            type: 'negative',
                            iconL: "warning",
                            message: 'Wrong email or password.'
                        })
                    }
                });
        }
    }

    const firebaseLogoutUser = () => {
        signOut(auth)
    }

    const firebaseOnAuthStateChanged = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                $q.loading.show()

                const id = user.uid;
                console.log('user:', user)

                get(dbRef(db, `users/${id}/firebaseUserDetails`)).then(snapshot => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();

                        if (userData) {
                            userDetails.value.userName = userData.name;
                            userDetails.value.macronutrients = userData.macronutrients;
                            userDetails.value.id = id;
                        }

                        router.push(`/${id}`);
                    } else {
                        const payLoad = {
                            name: user.displayName,
                            email: user.email
                        }

                        const id = user.uid

                        createUser(payLoad, id)

                        userDetails.value.userName = user.displayName
                        userDetails.value.id = id;
                        userDetails.value.macronutrients = {
                            calories: 2010,
                            carbohydrates: 250,
                            fats: 50,
                            proteins: 140
                        },

                            router.push(`/${id}`);
                    }
                });

            } else {

                userDetails.value.userName = ''
                userDetails.value.id = ''
                userDetails.value.macronutrients = {
                    calories: 0,
                    proteins: 0,
                    fats: 0,
                    carbohydrates: 0,
                }

                productStore.products = {}
                productStore.searchProductContent = ''
                productStore.loadingProducts = true

                currentDayStore.macronutrients = {
                    calories: 0,
                    proteins: 0,
                    fats: 0,
                    carbohydrates: 0
                }
                currentDayStore.macronutrientsHistory = {}
                currentDayStore.macronutrientsHistoryTotal = {}

                router.push('/auth')
            }
        });
    };

    const firebaseChangeMacronutrients = () => {
        const id = route.params.userId
        update(dbRef(db, `users/${id}/firebaseUserDetails/macronutrients`), userDetails.value.macronutrients)
    }

    const firebaseLoginUserWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');

        // signInWithRedirect(auth, provider)
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...

          console.log(user)
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    }

    return {
        userDetails,
        showMacronutrientsForm,
        firebaseRegisterUser,
        firebaseLoginUser,
        firebaseLogoutUser,
        firebaseOnAuthStateChanged,
        firebaseChangeMacronutrients,
        firebaseLoginUserWithGoogle,
    }
});