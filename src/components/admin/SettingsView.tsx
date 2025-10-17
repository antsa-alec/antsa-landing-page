import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Spin, Divider } from 'antd';
import { LockOutlined, SaveOutlined, LinkOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Title, Paragraph } = Typography;

interface SettingsViewProps {
  auth: AuthContextType;
}

const SettingsView = ({ auth }: SettingsViewProps) => {
  const [form] = Form.useForm();
  const [globalSettingsForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchGlobalSettings();
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
          // Footer settings
          footer_privacy_url: data.content.footer_privacy_url || '',
          footer_terms_url: data.content.footer_terms_url || '',
          footer_support_url: data.content.footer_support_url || '',
          footer_about_url: data.content.footer_about_url || '',
          footer_careers_url: data.content.footer_careers_url || '',
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

            <Divider orientation="left">Footer Settings</Divider>

            <Form.Item
              label="Privacy Policy URL"
              name="footer_privacy_url"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://antsa.ai/privacy" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              label="Terms of Service URL"
              name="footer_terms_url"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://antsa.ai/terms" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              label="Support URL"
              name="footer_support_url"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://antsa.ai/support" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              label="About Us URL"
              name="footer_about_url"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://antsa.ai/about" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              label="Careers URL"
              name="footer_careers_url"
            >
              <Input 
                prefix={<LinkOutlined />}
                placeholder="https://antsa.ai/careers" 
                size="large" 
              />
            </Form.Item>

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

export default SettingsView;

