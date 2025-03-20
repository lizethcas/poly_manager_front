<template>  
    <h1>My Profile</h1>
    <ProfileUpdate />
 </template>
 <script>
  import ProfileUpdate from "@/components/ProfileUpdate.vue";
 definePageMeta({
   layout: "dashboard-layout",
   middleware: ["auth"]
 });
 </script>