<template>
  <q-dialog v-model="usersStore.forgotPasswordDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Your address</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="usersStore.emailAddress"
          autofocus
          @keyup.enter="prompt = false"
          hint="Check your email spam folder to find the password reset link."
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat no-caps label="Cancel" color="red" v-close-popup />
        <q-btn
          @click="usersStore.handleForgotPassword"
          flat
          no-caps
          label="Reset password"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useUsersStore } from "src/stores/usersStore";

const usersStore = useUsersStore();
</script>