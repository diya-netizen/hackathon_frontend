"use client";

import {  useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Link, Title } = Typography;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorText, seterrorText] = useState("");

  const login = async (values: any) => {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success){
        router.push('/users');
        seterrorText("");
      }
      else{
        seterrorText(data.message);
      }
    } else {
      const error = await res.json();
      console.error('Login failed:', error.message);
    }
  }; 

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: "400px", maxWidth: "90vw" }}>
        <Title level={2} style={{ textAlign: "center", marginTop: 0 }}>
          Login
        </Title>
        <Form name="login" layout="vertical" onFinish={login} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              disabled={loading}
              loading={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <span>Don't have an account? </span>
          <Link href="/signup" underline>
            Sign up
          </Link>
        </div>
        <div style={{ marginTop: 16, textAlign: "center"}}>
          {errorText && <p style={{ color: 'red' }}>{errorText}</p> }
        </div>
      </Card>
    </div>
  );
}
