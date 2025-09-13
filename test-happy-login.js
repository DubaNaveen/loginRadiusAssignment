const axios = require("axios");

const BASE_URL = "http://localhost:3004/api/v1";

async function testHappyLogin() {
  console.log("🧪 Testing Happy Login...\n");

  try {
    // Test 1: Register a new user
    console.log("1. Registering a new user...");
    const testUser = {
      email: "happytest@example.com",
      password: "testpassword123",
    };

    try {
      await axios.post(`${BASE_URL}/user/register`, testUser);
      console.log("   ✅ User registered successfully");
    } catch (error) {
      if (error.response?.data?.message?.includes("already registered")) {
        console.log("   ℹ️  User already exists (continuing with login test)");
      } else {
        console.log(error, "-------");
        throw error;
      }
    }

    // Test 2: Successful login
    console.log("\n2. Testing successful login...");
    const loginResponse = await axios.post(`${BASE_URL}/user/login`, testUser);

    if (loginResponse.data.error === false) {
      console.log("   ✅ Login successful");
      console.log(`   Message: ${loginResponse.data.message}`);
    } else {
      console.log("   ❌ Login failed");
    }

    console.log("\n✅ Happy Login test completed");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testHappyLogin();
