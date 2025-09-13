export const MESSAGES = {
  USER: {
    FETCH: {
      FAIL: "Failed to fetch user by email",
    },
    REGISTER: {
      MAIL_VALIDATION_FAIL: "Invalid Email",
      MAIL_VALIDATION_SUCCESS: "Email validation success",
      SUCCESS: "User registered",
      ALREADY_REGISTERED: "User already exists",
      REGISTRATION_FAILED: "User creation failed",
    },
    MOBILE_NUMBER_FAIL: "Mobile Not Found",
    UPDATE_BLOCK_USER_ERROR: "Error while updating block status",
    CHECK_BLOCK_ERROR: "Error while updating the user block status",
    IP_ADD_ERROR: "Error while adding failed login attempt ip",
    IP_BLOCKED: "Ip blocked due to failed login attempts",
    LOGIN: {
      SUCCESS: "You Have Successfully Logged in",
      FAILED: "Login failed",
      WRONG_PASSWORD: "Wrong password entered",
    },
  },
};
