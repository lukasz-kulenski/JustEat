<template>
  <q-form class="q-gutter-md">
    <q-input
      v-show="props.tab == 'Register'"
      outlined
      rounded
      dense
      v-model="formData.name"
      autocomplete
      label="Name *"
      type="text"
      :rules="[(val) => (val && val.length > 0) || 'Please type your name']"
    >
      <template v-slot:prepend>
        <q-icon name="person" />
      </template>
    </q-input>

    <q-input
      outlined
      rounded
      dense
      v-model="formData.email"
      autocomplete
      type="email"
      label="Email *"
      :rules="[(val) => (val && val.length > 0) || 'Please type your email']"
    >
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
    </q-input>

    <q-input
      outlined
      rounded
      dense
      v-model="formData.password"
      autocomplete
      :type="showPassword ? 'password' : 'text'"
      label="Password *"
      :rules="[(val) => (val && val.length > 0) || 'Please type your password']"
    >
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>
      <template v-slot:append>
        <q-icon
          :name="showPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </template>
    </q-input>

    <div class="flex justify-end">
      <q-btn
        @click="usersStore.openForgotPasswordDialog"
        flat
        rounded
        no-caps
        label="Forgot password?"
        class="text-primary text-body1"
      />
    </div>

    <div class="column q-gutter-y-md">
      <q-btn
        no-caps
        @click.prevent="submitForm"
        :label="props.tab"
        type="submit"
        color="primary"
      />

      <q-btn @click="handleGoogle" no-caps>
        <img src="../assets/googleLogo.png" class="q-mr-md" />
        {{ props.tab }} with Google
      </q-btn>
    </div>
    <ForgotPasswordDialog />
  </q-form>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useUsersStore } from "src/stores/usersStore";
import ForgotPasswordDialog from "src/components/ForgotPasswordDialog";

const showPassword = ref(true);

const props = defineProps({
  tab: String,
});

const formData = ref({
  name: "",
  email: "",
  password: "",
});

const usersStore = useUsersStore();

const submitForm = () => {
  if (props.tab == "Register") {
    usersStore.firebaseRegisterUser(formData.value);
  } else {
    usersStore.firebaseLoginUser(formData.value);
  }
};

const handleGoogle = () => {
  usersStore.firebaseLoginUserWithGoogle();
};
</script>