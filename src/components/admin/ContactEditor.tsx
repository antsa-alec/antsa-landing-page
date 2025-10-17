import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;

interface ContactEditorProps {
  auth: AuthContextType;
}

const ContactEditor = ({ auth }: ContactEditorProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/contact`);
      const data = await response.json();

      if (response.ok) {
        form.setFieldsValue({
          title: data.content.title || '',
          subtitle: data.content.subtitle || '',
          email: data.content.email || '',
          phone: data.content.phone || '',
        });
      } else {
        message.error('Failed to load content');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ content: values }),
      });

      if (response.ok) {
        message.success('Contact section updated successfully!');
      } else {
        const data = await response.json();
        message.error(data.error || 'Failed to update content');
      }
    } catch (error) {
      console.error('Save error:', error);
      message.error('Connection error');
    } finally {
      setSaving(false);
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
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
        >
          <Input placeholder="Get in Touch" size="large" />
        </Form.Item>

        <Form.Item
          label="Subtitle"
          name="subtitle"
        >
          <TextArea
            rows={3}
            placeholder="We'd love to hear from you..."
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
        >
          <Input placeholder="hello@antsa.com.au" size="large" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
        >
          <Input placeholder="+61 XXX XXX XXX" size="large" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              size="large"
              style={{ minWidth: 150 }}
            >
              Save Changes
            </Button>
            <Button onClick={() => form.resetFields()} size="large">
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContactEditor;

