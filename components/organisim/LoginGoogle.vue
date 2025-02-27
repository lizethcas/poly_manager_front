<template>
  <GoogleSignInButton
    @success="handleLoginSuccess"
    @error="handleLoginError"
  ></GoogleSignInButton>
</template>

<script setup lang="ts">
import { useLogin } from "~/composables/useLogin";
import { GoogleSignInButton, type CredentialResponse } from "vue3-google-signin";

const { loginMutation } = useLogin();

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  console.log(credential);
  await loginMutation.mutate({ token: credential });
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};
</script>
