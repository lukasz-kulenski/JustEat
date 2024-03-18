import { defineStore } from 'pinia';
import { ref as vueRef, watch } from 'vue'
import { uid } from 'quasar'
import { db } from 'src/boot/firebase'
import { ref as dbRef, set, get, onChildAdded, onChildChanged, remove, update } from "firebase/database";
import { useRoute } from 'vue-router';
import { format } from "date-fns";
import { useUsersStore } from './usersStore';

export const useCurrentDayStore = defineStore('currentDayStore', () => {

    const macronutrients = vueRef({
        calories: 0,
        proteins: 0,
        fats: 0,
        carbohydrates: 0
    })
    const macronutrientsHistory = vueRef({})
    const macronutrientsHistoryTotal = vueRef({})

    const showHistoryToday = vueRef(false)
    const showHistoryTotal = vueRef(false)

    const showAddMacronutrientsForm = vueRef(false)

    const route = useRoute()

    const userStore = useUsersStore()

    const getUserId = () => { return userStore.userDetails.id }

    const getDay = () => {
        let d = new Date()
        return format(d, "dd-MM-yyyy");
    }

    const firebaseAddProduct = (payLoad, quantity) => {
        if (payLoad && quantity) {
            const day = getDay()
            const userId = getUserId()

            const roundToTwoDecimalPlaces = (value) => {
                return parseFloat(value.toFixed(2))
            }

            Object.keys(payLoad).forEach((property) => {
                if (property != 'name' || property != 'units') {
                    if (payLoad.units == 'pieces') {
                        macronutrients.value[property] += payLoad[property] * quantity;
                        macronutrients.value[property] = roundToTwoDecimalPlaces(macronutrients.value[property]);
                    } else {
                        macronutrients.value[property] += payLoad[property] * (quantity / 100);
                        macronutrients.value[property] = roundToTwoDecimalPlaces(macronutrients.value[property]);
                    }
                }
            });

            set(dbRef(db, `users/${userId}/dailies/${day}/total`), {
                calories: macronutrients.value.calories,
                proteins: macronutrients.value.proteins,
                fats: macronutrients.value.fats,
                carbohydrates: macronutrients.value.carbohydrates,
            })

            const id = uid()

            console.log(payLoad)

            if (payLoad.units == 'pieces') {
                set(dbRef(db, `users/${userId}/dailies/${day}/history/${id}`), {
                    calories: roundToTwoDecimalPlaces(payLoad.calories * quantity),
                    proteins: roundToTwoDecimalPlaces(payLoad.proteins * quantity),
                    fats: roundToTwoDecimalPlaces(payLoad.fats * quantity),
                    carbohydrates: roundToTwoDecimalPlaces(payLoad.carbohydrates * quantity),
                    quantity: quantity,
                    name: payLoad.name,
                    units: 'pieces'
                })
            } else {
                set(dbRef(db, `users/${userId}/dailies/${day}/history/${id}`), {
                    calories: roundToTwoDecimalPlaces(payLoad.calories * (quantity / 100)),
                    proteins: roundToTwoDecimalPlaces(payLoad.proteins * (quantity / 100)),
                    fats: roundToTwoDecimalPlaces(payLoad.fats * (quantity / 100)),
                    carbohydrates: roundToTwoDecimalPlaces(payLoad.carbohydrates * (quantity / 100)),
                    quantity: quantity,
                    name: payLoad.name,
                    units: 'grams'
                })
            }
        }
    }

    const firebaseGetProducts = () => {
        const day = getDay()
        const userId = getUserId()

        onChildAdded(dbRef(db, `users/${userId}/dailies/${day}/history`), snapshot => {
            macronutrientsHistory.value[snapshot.key] = snapshot.val()
        })

        onChildAdded(dbRef(db, `users/${userId}/dailies/${day}/total`), snapshot => {
            macronutrients.value[snapshot.key] = snapshot.val()
        })

        onChildChanged(dbRef(db, `users/${userId}/dailies/${day}/total`), snapshot => {
            macronutrients.value[snapshot.key] = snapshot.val()
        })
    }

    const resetDay = () => {
        macronutrients.value = {
            calories: 0,
            proteins: 0,
            fats: 0,
            carbohydrates: 0
        }

        macronutrientsHistory.value = {}
        macronutrientsHistoryTotal.value = {}

        const day = getDay()
        const userId = getUserId()
        remove(dbRef(db, `users/${userId}/dailies/${day}`))
    }


    const sortDate = (dateA, dateB) => {
        const dataA = new Date(dateA.split('-').reverse().join('-'));
        const dataB = new Date(dateB.split('-').reverse().join('-'));

        if (dataA < dataB) {
            return 1;
        }
        if (dataA > dataB) {
            return -1;
        }
        return 0;
    };

    const showStatistics = vueRef(false)
    const historyChartsData = vueRef({})
    const historyChartsHelpObj = vueRef({})
    const chartScope = vueRef('Last 30 days')

    const loadingHistoryTotal = vueRef(true)
    const firebaseCheckHistoryTotal = () => {
        const userId = getUserId();
        const historyTotal = [];

        get(dbRef(db, `users/${userId}/dailies`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((data) => {
                    const totalChild = data.child('total');
                    if (totalChild.exists()) {
                        historyTotal.push({
                            date: data.key,
                            total: totalChild.val(),
                        });
                    }
                });
            } else {
                loadingHistoryTotal.value = false
            }

            historyTotal.sort((b, a) => sortDate(a.date, b.date));

            historyTotal.forEach((item) => {
                historyChartsHelpObj.value[item.date] = item.total.calories;
            });

            historyChartsData.value = Object.fromEntries(
                Object.entries(historyChartsHelpObj.value).slice(-30)
            );

            historyTotal.sort((a, b) => sortDate(a.date, b.date));

            historyTotal.forEach((item) => {
                macronutrientsHistoryTotal.value[item.date] = item.total;
            });

            calculateAverageCalories(historyTotal)
        });
    };

    watch(chartScope, (newVal) => {
        let numberOfDays = 0;
        historyChartsData.value = {}

        switch (newVal) {
            case 'Last 30 days':
                numberOfDays = 30;
                break;
            case 'Last 60 days':
                numberOfDays = 60;
                break;
            case 'Last 90 days':
                numberOfDays = 90;
                break;
            case 'Last 180 days':
                numberOfDays = 180;
                break;
            case 'Last 360 days':
                numberOfDays = 360;
                break;
            case 'From The Begining':
                numberOfDays = Object.keys(historyChartsHelpObj.value).length;
                break;
        }

        historyChartsData.value = Object.fromEntries(
            Object.entries(historyChartsHelpObj.value).slice(-numberOfDays)
        );

    });

    const firebaseDeleteProductFromHistory = (payLoad) => {
        const day = getDay()
        const userId = getUserId()

        const roundToTwoDecimalPlaces = (value) => {
            return parseFloat(value.toFixed(2))
        }

        get(dbRef(db, `users/${userId}/dailies/${day}/history/${payLoad}`)).then(snapshot => {

            Object.keys(snapshot.val()).forEach((property) => {
                if (property != 'name' && property != 'quantity') {
                    macronutrients.value[property] -= snapshot.val()[property]
                    macronutrients.value[property] = roundToTwoDecimalPlaces(macronutrients.value[property]);
                }
            });

            update(dbRef(db, `users/${userId}/dailies/${day}/total`), macronutrients.value)
        })

        remove(dbRef(db, `users/${userId}/dailies/${day}/history/${payLoad}`))
    }

    const firebaseAddMacronutrients = (payLoad) => {
        macronutrients.value.calories += parseFloat(payLoad.calories)
        macronutrients.value.proteins += parseFloat(payLoad.proteins)
        macronutrients.value.fats += parseFloat(payLoad.fats)
        macronutrients.value.carbohydrates += parseFloat(payLoad.carbohydrates)

        const day = getDay()
        const userId = getUserId()

        update(dbRef(db, `users/${userId}/dailies/${day}/total`), macronutrients.value)
    }

    const weeklyAverageCalories = vueRef(0)
    const monthlyAverageCalories = vueRef(0)
    const yearlyAverageCalories = vueRef(0)

    const calculateAverageCalories = (historyTotal) => {
        if (historyTotal.length) {
            const averages = {
                weekly: [],
                monthly: [],
                yearly: [],
            }

            averages.weekly = historyTotal.slice(0, 7).map(item => item.total.calories)
            averages.monthly = historyTotal.slice(0, 30).map(item => item.total.calories)
            averages.yearly = historyTotal.slice(0, 365).map(item => item.total.calories)

            const calculateAverage = (arr, ref) => {
                let sum = 0

                arr.forEach(item => {
                    sum += item
                })

                ref.value = (sum / arr.length).toFixed(1)
            }

            calculateAverage(averages.weekly, weeklyAverageCalories)
            calculateAverage(averages.monthly, monthlyAverageCalories)
            calculateAverage(averages.yearly, yearlyAverageCalories)

            const userId = getUserId()
            set(dbRef(db, `users/${userId}/firebaseUserDetails/averageCalories/weekly`), weeklyAverageCalories.value)
            set(dbRef(db, `users/${userId}/firebaseUserDetails/averageCalories/monthly`), monthlyAverageCalories.value)
            set(dbRef(db, `users/${userId}/firebaseUserDetails/averageCalories/yearly`), yearlyAverageCalories.value)

        } else {
            const userId = getUserId()

            update(dbRef(db, `users/${userId}/firebaseUserDetails/averageCalories`), {
                weekly: 0,
                monthly: 0,
                yearly: 0,
            })
        }

    }

    return {
        macronutrients,
        macronutrientsHistory,
        macronutrientsHistoryTotal,
        showHistoryToday,
        showHistoryTotal,
        showAddMacronutrientsForm,
        loadingHistoryTotal,
        historyChartsData,
        showStatistics,
        chartScope,
        historyChartsHelpObj,
        firebaseAddProduct,
        resetDay,
        firebaseCheckHistoryTotal,
        firebaseGetProducts,
        firebaseDeleteProductFromHistory,
        firebaseAddMacronutrients,
        calculateAverageCalories,
    }
});
