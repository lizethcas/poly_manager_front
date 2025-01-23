<template>
  <div class="page-container">
    <!-- Wave pattern container -->
    <div class="wave-pattern">
      <div class="image-container img1">
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f" alt="Student 1" />
      </div>
      <div class="image-container img2">
        <img src="https://images.unsplash.com/photo-1629872430082-93d8912beccf" alt="Student 2" />
      </div>
      <div class="image-container img3">
        <img src="https://images.unsplash.com/photo-1627556704290-2b1f5853ff78" alt="Student 3" />
      </div>
      <div class="image-container img4">
        <img src="https://images.unsplash.com/photo-1629872430082-93d8912beccf" alt="Student 4" />
      </div>
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>
    
    <!-- Existing login form -->
    <div class="login-container">
      <form @submit.prevent="handleLogin" class="login-form">
        <h1>Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <div class="flex flex-column">
          <NuxtLink  type="submit" to="/admin">Login admin</NuxtLink>
          <NuxtLink type="submit" to="/student">Login student</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");

const handleLogin = () => {
  // Add your login logic here
  console.log("Login attempt:", {
    email: email.value,
    password: password.value,
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.wave-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: -1;
}

.image-container {
  position: absolute;
  border-radius: 20px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img1 {
  width: 250px;
  height: 250px;
  top: 10%;
  right: 15%;
  background-color: #FFD700;
}

.img2 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 35%;
  background-color: #FF69B4;
}

.img3 {
  width: 280px;
  height: 280px;
  top: 60%;
  right: 20%;
  background-color: #9370DB;
}

.img4 {
  width: 220px;
  height: 220px;
  top: 25%;
  right: 5%;
  background-color: #98FB98;
}

.shape {
  position: absolute;
  border-radius: 50%;
}

.shape1 {
  width: 300px;
  height: 300px;
  background-color: rgba(147, 112, 219, 0.2);
  top: 20%;
  right: 25%;
}

.shape2 {
  width: 200px;
  height: 200px;
  background-color: rgba(152, 251, 152, 0.2);
  top: 50%;
  right: 10%;
}

.shape3 {
  width: 250px;
  height: 250px;
  background-color: rgba(255, 215, 0, 0.2);
  top: 70%;
  right: 30%;
}
</style>
