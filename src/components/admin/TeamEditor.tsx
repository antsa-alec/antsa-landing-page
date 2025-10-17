import { useState, useEffect } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Spin, Space, Popconfirm, Avatar, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image_url?: string;
  order_index: number;
}

interface TeamEditorProps {
  auth: AuthContextType;
}

const TeamEditor = ({ auth }: TeamEditorProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/team`);
      const data = await response.json();

      if (response.ok) {
        setMembers(data.content.members || []);
      } else {
        message.error('Failed to load team members');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    form.resetFields();
    setImageUrl(null);
    setModalVisible(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.setFieldsValue(member);
    setImageUrl(member.image_url || null);
    setModalVisible(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('sectionName', 'team');
      formData.append('key', `member-${Date.now()}`);

      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.path);
        message.success('Image uploaded successfully!');
        return data.path;
      } else {
        message.error('Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Team member deleted successfully!');
        fetchMembers();
      } else {
        message.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingMember
        ? `${API_BASE_URL}/content/team/${editingMember.id}`
        : `${API_BASE_URL}/content/team`;

      const payload = {
        ...values,
        image_url: imageUrl,
      };

      const response = await fetch(url, {
        method: editingMember ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success(`Team member ${editingMember ? 'updated' : 'created'} successfully!`);
        setModalVisible(false);
        setImageUrl(null);
        fetchMembers();
      } else {
        message.error('Failed to save team member');
      }
    } catch (error) {
      console.error('Save error:', error);
      message.error('Connection error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h3>Team Members</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Team Member
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
        dataSource={members}
        renderItem={(member) => (
          <List.Item>
            <Card
              actions={[
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete this member?"
                  onConfirm={() => handleDelete(member.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                {member.image_url ? (
                  <Avatar size={80} src={member.image_url} />
                ) : (
                  <Avatar size={80} icon={<UserOutlined />} />
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '1.1rem' }}>{member.name}</strong>
                {member.role && <div style={{ color: '#999', marginTop: 4 }}>{member.role}</div>}
                {member.bio && (
                  <p style={{ marginTop: 12, fontSize: '0.9rem', color: '#666' }}>
                    {member.bio}
                  </p>
                )}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ order_index: 0 }}
        >
          <Form.Item label="Profile Image">
            <Space direction="vertical" style={{ width: '100%' }}>
              {imageUrl && (
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <Avatar size={100} src={imageUrl} />
                </div>
              )}
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImageUpload(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {imageUrl ? 'Change Image' : 'Upload Image'}
                </Button>
              </Upload>
              {imageUrl && (
                <Button 
                  danger 
                  size="small" 
                  onClick={() => setImageUrl(null)}
                >
                  Remove Image
                </Button>
              )}
            </Space>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="Jane Smith" />
          </Form.Item>

          <Form.Item
            label="Role/Title"
            name="role"
          >
            <Input placeholder="CEO & Founder" />
          </Form.Item>

          <Form.Item
            label="Bio"
            name="bio"
          >
            <TextArea rows={4} placeholder="Brief biography..." />
          </Form.Item>

          <Form.Item
            label="Order"
            name="order_index"
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMember ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamEditor;

