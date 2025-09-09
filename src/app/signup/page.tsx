"use client";

import { Form, Input, Button, Card, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import validations from "@/app/utils/validations";

const { Title } = Typography;

type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorText, seterrorText] = useState("");

  const signUp = async (formData: SignupFormData) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create user");
      }
      const data = await response.json();
      if(data.success){
        router.push("/users");
        seterrorText("");
      } else {
        seterrorText(data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };


  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: "500px", maxWidth: "90vw" }}>
        <Title level={2} style={{ textAlign: "center", marginTop: 0 }}>
          Create Account
        </Title>

        <Form
          name="signup"
          layout="vertical"
          onFinish={signUp}
          autoComplete="off"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={validations.firstName}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={validations.lastName}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={validations.email} 
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={validations.phoneNumber}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={validations.password}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Form.Item>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span>Already have an account? </span>
            <a href="/login">Log in</a>
          </div>
        </Form>
        <div style={{ marginTop: 16, textAlign: "center"}}>
          {errorText && <p style={{ color: 'red' }}>{errorText}</p> }
        </div>
      </Card>
    </div>
  );
}
