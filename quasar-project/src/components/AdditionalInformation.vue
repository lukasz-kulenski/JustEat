<template>
  <div>
    <q-list v-if="userStore.userDetails.averageCalories">
      <q-item>
        <q-item-section>
          <q-item-label
            >Weekly average calories:
            <span class="text-bold">
              {{ userStore.userDetails.averageCalories.weekly }}
              kcal</span
            >
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>
            Monthly average calories:
            <span class="text-bold">
              {{ userStore.userDetails.averageCalories.monthly }}
              kcal
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>
            Yearly average calories:
            <span class="text-bold">
              {{ userStore.userDetails.averageCalories.yearly }}
              kcal
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>
            Your weekly average calories
            <span class="text-caption text-bold"
              >({{ userStore.userDetails.averageCalories.weekly }})</span
            >
            are
            {{ difference ? "less" : "greater" }}
            than your target calories
            <span class="text-caption text-bold"
              >({{ userStore.userDetails.macronutrients.calories }})</span
            >
            <span>
              <q-icon
                v-show="difference < 0"
                name="arrow_upward"
                color="green"
                size="md"
              />
              <q-icon
                v-show="difference > -1"
                name="arrow_downward"
                color="red"
                size="md"
              />
              ({{ Math.abs(compareCaloriesPercentageResults) }}%)
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useUsersStore } from "src/stores/usersStore";
import { computed, onMounted, ref } from "vue";

const userStore = useUsersStore();

const difference = ref(0);

const compareCaloriesPercentageResults = computed(() => {
  let targetCalories = userStore.userDetails.macronutrients.calories;
  let averageCalories = userStore.userDetails.averageCalories.weekly;

  let comparison = averageCalories / targetCalories;

  if (difference.value) {
    const result = ((1 - comparison) * 100).toFixed(1);

    return result;
  } else {
    const result = (comparison * 100 - 100).toFixed(1);

    return result;
  }
});

onMounted(() => {
  difference.value =
    userStore.userDetails.macronutrients.calories -
    userStore.userDetails.averageCalories.weekly;
});
</script>