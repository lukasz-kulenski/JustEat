<template>
  <q-page class="q-pa-sm">
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
        <q-tab name="Login" label="Login" />
        <q-tab name="Register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Login">
          <LoginRegisterForm :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="Register">
          <LoginRegisterForm :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import LoginRegisterForm from "../components/LoginRegisterForm.vue";
import { useUsersStore } from "src/stores/usersStore";
import { useRouter } from "vue-router";

const tab = ref("Login");

const router = useRouter();

const usersStore = useUsersStore();

onMounted(() => {
  const userId = usersStore.userDetails.id;

  if (userId) router.push(`/`);
});
</script>

<style lang="scss" scoped>
.custom-toggle {
  border: 1px solid #027be3;
}

.q-page {
  margin-left: auto;
  margin-right: auto;
  max-width: 40%;
  @media (max-width: $breakpoint-sm-max) {
    max-width: 70%;
  }
  @media (max-width: $breakpoint-xs-max) {
    max-width: 90%;
  }
}
</style>