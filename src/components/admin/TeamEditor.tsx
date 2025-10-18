import { useState, useEffect } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Spin, Space, Popconfirm, Avatar, Upload, Select, Tag, Divider, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, UploadOutlined, LinkOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image_url?: string;
  order_index: number;
}

interface TeamMemberSocial {
  id: number;
  team_member_id: number;
  platform: string;
  url: string;
  order_index: number;
}

interface TeamEditorProps {
  auth: AuthContextType;
}

// Available social platforms
const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', color: '#0077b5' },
  { value: 'twitter', label: 'Twitter', color: '#1da1f2' },
  { value: 'x', label: 'X (Twitter)', color: '#000' },
  { value: 'github', label: 'GitHub', color: '#333' },
  { value: 'facebook', label: 'Facebook', color: '#1877f2' },
  { value: 'instagram', label: 'Instagram', color: '#e4405f' },
  { value: 'website', label: 'Website', color: '#48abe2' },
  { value: 'email', label: 'Email', color: '#666' },
  { value: 'other', label: 'Other', color: '#666' },
];

const TeamEditor = ({ auth }: TeamEditorProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Social links state
  const [socialsModalVisible, setSocialsModalVisible] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [socials, setSocials] = useState<TeamMemberSocial[]>([]);
  const [socialsLoading, setSocialsLoading] = useState(false);
  const [socialForm] = Form.useForm();
  const [editingSocial, setEditingSocial] = useState<TeamMemberSocial | null>(null);
  const [socialEditModalVisible, setSocialEditModalVisible] = useState(false);

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

  const fetchSocials = async (memberId: number) => {
    setSocialsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content/team/${memberId}/socials`);
      const data = await response.json();

      if (response.ok) {
        setSocials(data.socials || []);
      } else {
        message.error('Failed to load social links');
      }
    } catch (error) {
      console.error('Fetch socials error:', error);
      message.error('Connection error');
    } finally {
      setSocialsLoading(false);
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

  const handleManageSocials = (member: TeamMember) => {
    setCurrentMemberId(member.id);
    fetchSocials(member.id);
    setSocialsModalVisible(true);
  };

  const handleAddSocial = () => {
    setEditingSocial(null);
    socialForm.resetFields();
    setSocialEditModalVisible(true);
  };

  const handleEditSocial = (social: TeamMemberSocial) => {
    setEditingSocial(social);
    socialForm.setFieldsValue(social);
    setSocialEditModalVisible(true);
  };

  const handleDeleteSocial = async (socialId: number) => {
    if (!currentMemberId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/content/team/${currentMemberId}/socials/${socialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Social link deleted successfully!');
        fetchSocials(currentMemberId);
      } else {
        message.error('Failed to delete social link');
      }
    } catch (error) {
      console.error('Delete social error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmitSocial = async (values: any) => {
    if (!currentMemberId) return;

    try {
      const url = editingSocial
        ? `${API_BASE_URL}/content/team/${currentMemberId}/socials/${editingSocial.id}`
        : `${API_BASE_URL}/content/team/${currentMemberId}/socials`;
      
      const method = editingSocial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`Social link ${editingSocial ? 'updated' : 'created'} successfully!`);
        setSocialEditModalVisible(false);
        fetchSocials(currentMemberId);
      } else {
        const data = await response.json();
        message.error(data.error || `Failed to ${editingSocial ? 'update' : 'create'} social link`);
      }
    } catch (error) {
      console.error('Submit social error:', error);
      message.error('Connection error');
    }
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

  const getPlatformLabel = (platform: string) => {
    const found = SOCIAL_PLATFORMS.find(p => p.value === platform);
    return found ? found.label : platform;
  };

  const getPlatformColor = (platform: string) => {
    const found = SOCIAL_PLATFORMS.find(p => p.value === platform);
    return found ? found.color : '#666';
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
                <Button
                  key="socials"
                  type="text"
                  icon={<LinkOutlined />}
                  onClick={() => handleManageSocials(member)}
                >
                  Socials
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

      {/* Team Member Edit Modal */}
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

      {/* Social Links Management Modal */}
      <Modal
        title={`Manage Social Links${currentMemberId ? ` - ${members.find(m => m.id === currentMemberId)?.name}` : ''}`}
        open={socialsModalVisible}
        onCancel={() => setSocialsModalVisible(false)}
        footer={null}
        width={700}
      >
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSocial}>
            Add Social Link
          </Button>
        </div>

        {socialsLoading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : (
          <List
            dataSource={socials}
            locale={{ emptyText: 'No social links yet. Click "Add Social Link" to create one.' }}
            renderItem={(social) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditSocial(social)}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Delete this social link?"
                    onConfirm={() => handleDeleteSocial(social.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Tag color={getPlatformColor(social.platform)}>
                        {getPlatformLabel(social.platform)}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Text style={{ fontSize: '0.9rem' }}>
                      <LinkOutlined style={{ marginRight: 4 }} />
                      {social.url}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* Social Link Edit Modal */}
      <Modal
        title={editingSocial ? 'Edit Social Link' : 'Add Social Link'}
        open={socialEditModalVisible}
        onCancel={() => setSocialEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={socialForm}
          layout="vertical"
          onFinish={handleSubmitSocial}
          initialValues={{ order_index: 0 }}
        >
          <Form.Item
            label="Platform"
            name="platform"
            rules={[{ required: true, message: 'Please select a platform' }]}
            tooltip="Only one link per platform per team member"
          >
            <Select placeholder="Select a social platform" size="large">
              {SOCIAL_PLATFORMS.map(platform => (
                <Option key={platform.value} value={platform.value}>
                  <Tag color={platform.color}>{platform.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: 'Please enter a URL' }]}
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="https://linkedin.com/in/yourprofile"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Order"
            name="order_index"
            tooltip="Links will be sorted by this number (lowest first)"
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSocial ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setSocialEditModalVisible(false)}>
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
