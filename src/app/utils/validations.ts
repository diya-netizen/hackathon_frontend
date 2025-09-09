import { Rule } from "antd/lib/form";
const validations: { [key: string]: Rule[] } = {
  firstName: [
    { required: true, message: "First Name is required" },
    {
      pattern: /^[A-Za-z\s-]{2,50}$/,

      message: "Name must be 2–50 characters and contain only letters, spaces, or hyphens"
    }
  ],

  lastName: [
    { required: true, message: "Last Name is required" },
    {
      pattern: /^[A-Za-z\s-]{2,50}$/,
      message: "Name must be 2–50 characters and contain only letters, spaces, or hyphens"
    }
  ],

  phoneNumber: [
    { required: true, message: "Please enter the Phone Number" },
    {
      pattern: /^(?:\d{10}|\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/,
      message:
        "Enter a valid phone number (e.g., 123-456-7890 or (123) 456-7890)"
    }
  ],

  email: [
    { required: true, message: "Email is required" },
    {
      type: "email",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Enter a valid email address (e.g., user@example.com)"
    }
  ],

  password: [
    { required: true, message: "Please enter the Password" },
    {
      pattern: /^.{8,}$/,
      message:
        "Password must be at least 8 characters"
    }
  ],
 

 
};

export default validations;
