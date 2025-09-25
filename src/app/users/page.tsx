"use client";

import { Table, Button, Tag, Space, Typography, message, Card, Select, Avatar, Form, Modal, Input, Spin, Row, Col } from "antd";
import { useEffect, useState, useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import validations from "@/app/utils/validations";
import { useRouter } from "next/navigation";
import config from "../../../config";
import {SearchOutlined} from '@ant-design/icons';


const { Title, Text, Link } = Typography;

const avatarColors = [
  "#FAE7EB",
  "#DBEEF7",
  "#E0D4E7",
  "#BDD2E4",
  "#EECEDA",
  "#CCDCEB", 
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorText, seterrorText] = useState("");
  const [myUser, setMyUser] = useState<User>();
  const pageSize = 10;
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterText, setFilterText] = useState("");
  const [field, setField] = useState<"no_filter" | "email" | "phone">("no_filter");
  

  useEffect(() => {
    fetchMyUser();
    fetchUsers(1);
  }, [field]);

  const fetchMyUser = async () => {
    try{
      const res = await fetch(`${config.apiUrl}/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      if(data.success){
        setMyUser(data.user)
      }else{
        router.push('/login');
      }
    }catch(err){
      console.log(err);
    }
  };

  const fetchUsers = async (page = 1, searchValue = filterText, searchField = field) => {
    setLoading(true);
    try {
      if (searchValue === "" || searchField === "no_filter") {
        const res = await fetch(`${config.apiUrl}/users?page=${page}&limit=10`, {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
        setCurrentPage(data.page);
        return;
      }

      const res = await fetch(
        `${config.apiUrl}/users?page=${page}&limit=10&field=${searchField}&search=${encodeURIComponent(
          searchValue
        )}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setCurrentPage(data.page);
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = (idToRemove: User["id"]) => {
    setUsers(prev => prev.filter(u => u.id !== idToRemove));
  };

    const updateAccount = async (values: Partial<User>) => {
    try {
      const res = await fetch(`${config.apiUrl}/users/${values.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),  
      });

      if (!res.ok) throw new Error('Request failed');
      
      const data = await res.json();
      if(data.success){
        fetchUsers(currentPage);
        setEditingUser(null)
        seterrorText("");
      }else{
        seterrorText(data.message);
      }
    } catch (error) {
      console.log("Error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${config.apiUrl}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();

      if (data.success) {
        removeUser(id);
      }
    } catch (error) {
      message.error('Failed to detele user');
    }
  };

  const handleLogout = async () => {
      try {
      const res = await fetch(`${config.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      if (data.success) {
        console.log(data.message);
        router.push('/login');
      }
    } catch (error) {
      message.error('Failed to detele user');
    }
  }

  interface User {
    id: number;
    firstName: string;
    lastName: string;
    status: string;
    role: string;
    email: string;
    phone: string;
  }
  const baseColumns: ColumnsType<User> = [
  {
    title: "Avatar",
    key: "avatar",
    render: (_: any, record: any, index: number ) => {
      const initials = `${record.firstName[0]}${record.lastName[0]}`;
      const color = avatarColors[index % avatarColors.length];
      return (
        <Avatar
          style={{
            backgroundColor: color,
            color: "black",
          }}
        >
          {initials.toUpperCase()}
        </Avatar>
      );
    },
  },
    {
      title: "Name",
      dataIndex: "firstName",
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (

        <Tag color={status === "Active" ? "green" : "grey"}>{status}</Tag>
      ),
    },
{
  title: "Actions",
  render: (_: any, record: User) => (
    <Space>
      <Button type="link" onClick={() => setEditingUser(record)}>
        Edit
      </Button>
      <Button type="link" danger onClick={() => handleDelete(record.id)}>
        Delete
      </Button>
    </Space>
  ),
}
  ];

  const columns = myUser?.role.toUpperCase() === "ADMIN"
  ? baseColumns
  : baseColumns.filter(col => col.title !== "Actions");

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2} style={{ margin: 0 }}>Users Dashboard</Title>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Card style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: 16 }}>
        {myUser?.role.toUpperCase() === 'ADMIN' && (
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col>
              <Link href="/users/new">
                <Button type="primary" >New User</Button> 
              </Link>
            </Col>
            <Col>
              <Select
                value={field}
                style={{ width: 140 }}
                options={[
                  { value: "no_filter", label: "All"},
                  { value: "email", label: "Email" },
                  { value: "phone", label: "Phone" },
                ]}
                onChange={(v) => setField(v)}
              />
            </Col>

            <Col>
              <Input
                allowClear
                placeholder={
                  field === "phone"
                    ? "Search phone…"
                    : field === "email"
                    ? "Search email…"
                    : "Showing all users.."
                }
                disabled={field === "no_filter"}
                prefix={<SearchOutlined />}
                style={{ width: 260 }}
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  fetchUsers(1, e.target.value, field); 
                }}
              />
            </Col>
          </Row>  
        )}
      </div>
        <Spin spinning={loading} size="large">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            onChange: (page) => fetchUsers(page, filterText, field),
            position: ['bottomCenter'],
          }}
        />
        </Spin>
      </Card>

      {editingUser && (
        <Modal
          title="Edit User"
          open={!!editingUser}
          onCancel={() => setEditingUser(null)}
          footer={null}
        >
          <Form
            layout="vertical"
            initialValues={{
              firstName: editingUser.firstName,
              lastName: editingUser.lastName,
              email: editingUser.email,
              phone: editingUser.phone,
              role: editingUser.role,
              status: editingUser.status,
            }}
            onFinish={(values) => updateAccount({ ...values, id: editingUser.id })}
          >
            <Form.Item name="firstName" label="First Name" rules={validations.firstName}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={validations.lastName}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={validations.email}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={validations.phoneNumber}>
              <Input />
            </Form.Item>
            <Form.Item name="role" label="Role">
              <Select options={[{ value: "User" }, { value: "Admin" }]} />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select options={[{ value: "Active" }, { value: "Inactive" }]} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form>
          {errorText && <p style={{ color: "red", marginTop: 16, textAlign: "center" }}>{errorText}</p>}
        </Modal>
      )}
    </div>
  );
}
