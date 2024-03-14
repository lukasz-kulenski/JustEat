import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { useQuasar } from 'quasar'
import { db, auth } from 'src/boot/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { ref as dbRef, set, get, update, onChildChanged } from "firebase/database";
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

    const getUserId = () => { return userDetails.value.id }

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
                },
                averageCalories: {
                    weekly: 0,
                    monthly: 0,
                    yearly: 0,
                },
            }
        })

    }

    const firebaseRegisterUser = (payLoad) => {
        if (payLoad.name.trim() && payLoad.email.trim() && payLoad.password.trim()) {

            createUserWithEmailAndPassword(auth, payLoad.email, payLoad.password)
                .then(response => {
                    const id = response.user.uid;

                    sendEmailVerification(auth.currentUser).then(() => {
                        $q.notify({
                            type: 'positive',
                            message: 'Verify email address before logging in.'
                        })
                    })

                    createUser(payLoad, id)
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
                message: 'Fill in all fields.'
            })
        }
    }

    const firebaseLoginUser = (payLoad) => {
        if (payLoad.email.trim() && payLoad.password.trim()) {
            signInWithEmailAndPassword(auth, payLoad.email, payLoad.password)
                .then((userCredential) => {
                    const id = userCredential.user.uid

                    if (!userCredential.user.emailVerified) {
                        $q.notify({
                            type: 'negative',
                            message: 'Verify your email address.'
                        })
                    } else {
                        userDetails.value.id = id
                    }
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
                    if (errorCode == 'auth/invalid-credential') {
                        $q.notify({
                            type: 'negative',
                            iconL: "warning",
                            message: 'Wrong email or password.'
                        })
                    }
                });
        } else {
            $q.notify({
                type: 'negative',
                message: 'Fill in all fields.'
            })
        }
    }

    const firebaseLogoutUser = () => {
        signOut(auth)
    }

    const firebaseGetUserAverageCalories = () => {
        const userId = getUserId()

        onChildChanged(dbRef(db, `users/${userId}/firebaseUserDetails/averageCalories`), snapshot => {
            userDetails.value.averageCalories[snapshot.key] = snapshot.val()
        })
    }

    const firebaseOnAuthStateChanged = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const id = user.uid;

                if (user.emailVerified || user.providerData[0].providerId == 'google.com') {
                    $q.loading.show()
                    get(dbRef(db, `users/${id}/firebaseUserDetails`)).then(snapshot => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();

                            if (userData) {
                                userDetails.value.userName = userData.name;
                                userDetails.value.macronutrients = userData.macronutrients;
                                userDetails.value.id = id;
                                userDetails.value.averageCalories = userData.averageCalories
                            }

                            router.push(`/`);
                            firebaseGetUserAverageCalories()
                        } else {
                            const payLoad = {
                                name: user.displayName,
                                email: user.email
                            }

                            const id = user.uid

                            createUser(payLoad, id)

                            userDetails.value = {
                                userName: user.displayName,
                                id: id,
                                macronutrients: {
                                    calories: 2010,
                                    carbohydrates: 250,
                                    fats: 50,
                                    proteins: 140
                                },
                                averageCalories: {
                                    weekly: 0,
                                    monthly: 0,
                                    yearly: 0,
                                },
                            }

                            router.push(`/`);
                            firebaseGetUserAverageCalories()
                        }
                    });
                }

            } else {
                userDetails.value = {
                    userName: '',
                    id: '',
                    macronutrients: {
                        calories: 0,
                        proteins: 0,
                        fats: 0,
                        carbohydrates: 0,
                    },
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
        const id = getUserId()
        update(dbRef(db, `users/${id}/firebaseUserDetails/macronutrients`), userDetails.value.macronutrients)
    }

    const firebaseLoginUserWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');

        signInWithRedirect(auth, provider)
    }

    const forgotPasswordDialog = vueRef(false)
    const openForgotPasswordDialog = () => {
        forgotPasswordDialog.value = true
    }

    const emailAddress = vueRef('')
    const handleForgotPassword = () => {
        sendPasswordResetEmail(auth, emailAddress.value).then(() => {
            $q.notify({
                type: 'positive',
                message: 'Password reset link sent.'
            })

            emailAddress.value = ''
        }).catch((error) => {
            const errorCode = error.code

            if (errorCode == 'auth/invalid-email') {
                $q.notify({
                    type: 'negative',
                    message: "Invalid email"
                })
            }
        })
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
        forgotPasswordDialog,
        openForgotPasswordDialog,
        handleForgotPassword,
        emailAddress,
    }
});