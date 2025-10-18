import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Spin, Divider, List, Modal, Space, Popconfirm } from 'antd';
import { LockOutlined, SaveOutlined, LinkOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Title, Paragraph } = Typography;

interface SettingsViewProps {
  auth: AuthContextType;
}

interface FooterLink {
  id: number;
  label: string;
  url: string;
  order_index: number;
}

const SettingsView = ({ auth }: SettingsViewProps) => {
  const [form] = Form.useForm();
  const [globalSettingsForm] = Form.useForm();
  const [footerLinkForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [footerLinksLoading, setFooterLinksLoading] = useState(true);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);

  useEffect(() => {
    fetchGlobalSettings();
    fetchFooterLinks();
  }, []);

  const fetchGlobalSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/settings`);
      const data = await response.json();

      if (response.ok && data.content) {
        globalSettingsForm.setFieldsValue({
          signup_url: data.content.signup_url || '',
          pricing_url: data.content.pricing_url || '',
          demo_video_url: data.content.demo_video_url || '',
          features_cta_text: data.content.features_cta_text || '',
          features_cta_url: data.content.features_cta_url || '',
          pricing_free_cta_text: data.content.pricing_free_cta_text || '',
          pricing_paid_cta_text: data.content.pricing_paid_cta_text || '',
          footer_copyright: data.content.footer_copyright || '',
          footer_tagline: data.content.footer_tagline || '',
          footer_subtitle: data.content.footer_subtitle || '',
        });
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      message.error('Failed to load settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchFooterLinks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/footer-links`);
      const data = await response.json();

      if (response.ok && data.links) {
        setFooterLinks(data.links);
      }
    } catch (error) {
      console.error('Fetch footer links error:', error);
      message.error('Failed to load footer links');
    } finally {
      setFooterLinksLoading(false);
    }
  };

  const handleSaveGlobalSettings = async (values: any) => {
    setSavingSettings(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ content: values }),
      });

      if (response.ok) {
        message.success('Global settings saved successfully!');
      } else {
        const data = await response.json();
        message.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      message.error('Connection error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Password changed successfully!');
        form.resetFields();
      } else {
        message.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      message.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    setEditingLink(null);
    footerLinkForm.resetFields();
    setLinkModalVisible(true);
  };

  const handleEditLink = (link: FooterLink) => {
    setEditingLink(link);
    footerLinkForm.setFieldsValue(link);
    setLinkModalVisible(true);
  };

  const handleDeleteLink = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/footer-links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Footer link deleted successfully!');
        fetchFooterLinks();
      } else {
        message.error('Failed to delete footer link');
      }
    } catch (error) {
      console.error('Delete link error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmitLink = async (values: any) => {
    try {
      const url = editingLink
        ? `${API_BASE_URL}/content/footer-links/${editingLink.id}`
        : `${API_BASE_URL}/content/footer-links`;
      
      const method = editingLink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`Footer link ${editingLink ? 'updated' : 'created'} successfully!`);
        setLinkModalVisible(false);
        fetchFooterLinks();
      } else {
        const data = await response.json();
        message.error(data.error || `Failed to ${editingLink ? 'update' : 'create'} footer link`);
      }
    } catch (error) {
      console.error('Submit link error:', error);
      message.error('Connection error');
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>
          <LinkOutlined style={{ marginRight: 8 }} />
          Global Settings & CTAs
        </Title>
        <Paragraph style={{ color: '#666', marginBottom: 24 }}>
          Configure global URLs and call-to-action text that appear across all sections of your landing page.
        </Paragraph>

        {settingsLoading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={globalSettingsForm}
            layout="vertical"
            onFinish={handleSaveGlobalSettings}
            autoComplete="off"
          >
            <Divider orientation="left">URL Settings</Divider>

            <Form.Item
              label="Signup URL"
              name="signup_url"
              tooltip="Main signup/registration URL used in pricing and other sections"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://app.antsa.ai/signup" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              label="Pricing Page URL"
              name="pricing_url"
              tooltip="Link to your pricing page"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://app.antsa.ai/pricing" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              label="Demo Video URL"
              name="demo_video_url"
              tooltip="Link to your product demo video (YouTube, Vimeo, etc.)"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://www.youtube.com/watch?v=..." 
                size="large" 
              />
            </Form.Item>

            <Divider orientation="left">Features Section CTA</Divider>

            <Form.Item
              label="Features CTA Text"
              name="features_cta_text"
            >
              <Input placeholder="Get Started Free" size="large" />
            </Form.Item>

            <Form.Item
              label="Features CTA URL"
              name="features_cta_url"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://app.antsa.ai/signup" 
                size="large" 
              />
            </Form.Item>

            <Divider orientation="left">Pricing Section CTAs</Divider>

            <Form.Item
              label="Free Plan CTA Text"
              name="pricing_free_cta_text"
              tooltip="Button text for free pricing plans"
            >
              <Input placeholder="Start Free Trial" size="large" />
            </Form.Item>

            <Form.Item
              label="Paid Plan CTA Text"
              name="pricing_paid_cta_text"
              tooltip="Button text for paid pricing plans"
            >
              <Input placeholder="Get Started" size="large" />
            </Form.Item>

            <Divider orientation="left">Footer Text</Divider>

            <Form.Item
              label="Copyright Text"
              name="footer_copyright"
              tooltip="Automatically includes the current year"
            >
              <Input placeholder="© 2025 ANTSA. All rights reserved." size="large" />
            </Form.Item>

            <Form.Item
              label="Tagline"
              name="footer_tagline"
              tooltip="You can use HTML like: Made with ❤️ in Australia"
            >
              <Input placeholder="Made with ❤️ in Australia" size="large" />
            </Form.Item>

            <Form.Item
              label="Subtitle Text"
              name="footer_subtitle"
            >
              <Input placeholder="Data encrypted and securely hosted on Australian servers" size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={savingSettings}
                size="large"
                style={{ minWidth: 150 }}
              >
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      {/* Footer Links Manager */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ marginBottom: 8 }}>
              <LinkOutlined style={{ marginRight: 8 }} />
              Footer Links
            </Title>
            <Paragraph style={{ color: '#666', marginBottom: 0 }}>
              Add custom links that will appear in the footer. Common examples: Privacy Policy, Terms of Service, Support, etc.
            </Paragraph>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddLink}>
            Add Link
          </Button>
        </div>

        {footerLinksLoading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            dataSource={footerLinks}
            locale={{ emptyText: 'No footer links yet. Click "Add Link" to create one.' }}
            renderItem={(link) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditLink(link)}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Delete this link?"
                    onConfirm={() => handleDeleteLink(link.id)}
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
                  title={link.label}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text style={{ color: '#666', fontSize: '0.9rem' }}>
                        <LinkOutlined style={{ marginRight: 4 }} />
                        {link.url}
                      </Text>
                      <Text style={{ color: '#999', fontSize: '0.85rem' }}>
                        Order: {link.order_index}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Footer Link Modal */}
      <Modal
        title={editingLink ? 'Edit Footer Link' : 'Add Footer Link'}
        open={linkModalVisible}
        onCancel={() => setLinkModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={footerLinkForm}
          layout="vertical"
          onFinish={handleSubmitLink}
          initialValues={{ order_index: 0 }}
        >
          <Form.Item
            label="Label"
            name="label"
            rules={[{ required: true, message: 'Please enter a label' }]}
          >
            <Input placeholder="Privacy Policy" size="large" />
          </Form.Item>

          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: 'Please enter a URL' }]}
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="https://antsa.ai/privacy"
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
                {editingLink ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setLinkModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Change Password</Title>
        <Paragraph style={{ color: '#666' }}>
          It's recommended to change your password regularly for security.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          autoComplete="off"
          style={{ maxWidth: 500 }}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        style={{
          background: '#fff3e0',
          border: '1px solid #ffb74d',
        }}
      >
        <Title level={4} style={{ color: '#f57c00' }}>
          ⚠️ Security Best Practices
        </Title>
        <ul style={{ margin: 0 }}>
          <li>Use a strong, unique password</li>
          <li>Don't share your admin credentials</li>
          <li>Change password regularly</li>
          <li>Never use the default password in production</li>
        </ul>
      </Card>
    </div>
  );
};

// Missing import that was referenced
const { Text } = Typography;

export default SettingsView;
