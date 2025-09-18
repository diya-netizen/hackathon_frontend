"use client";

import { Form, Input, Button, Card, Typography, Select } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import validations from "@/app/utils/validations";
import config from "../../../../config";


const { Title } = Typography;

export default function NewUserPage() {
  const router = useRouter();
  const [errorText, seterrorText] = useState("");

  const newUser = async (formData: any) => {
    try {
      const response = await fetch(`${config.apiUrl}/users/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
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
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };


  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Card style={{ width: 500 }}>
        <Title level={3}>New User</Title>
        <Form layout="vertical" onFinish={newUser}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" initialValue="User">
            <Select options={[{ value: "User" }, { value: "Admin" }]} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Active">
            <Select options={[{ value: "Active" }, { value: "Inactive" }]} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={validations.password}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
          <div style={{ marginTop: 16, textAlign: "center"}}>
            {errorText && <p style={{ color: 'red' }}>{errorText}</p> }
          </div>
        </Form>
      </Card>
    </div>
  );
}
