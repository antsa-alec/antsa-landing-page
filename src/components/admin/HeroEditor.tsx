import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;

interface HeroEditorProps {
  auth: AuthContextType;
}

const HeroEditor = ({ auth }: HeroEditorProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/hero`);
      const data = await response.json();

      if (response.ok) {
        form.setFieldsValue({
          badge: data.content.badge || '',
          title: data.content.title || '',
          subtitle: data.content.subtitle || '',
          title_highlights:
            typeof data.content.title_highlights === 'string'
              ? data.content.title_highlights
              : JSON.stringify(data.content.title_highlights || []),
          description: data.content.description || '',
          hero_desktop_image: data.content.hero_desktop_image || '',
          hero_mobile_image: data.content.hero_mobile_image || '',
          cta_primary: data.content.cta_primary || '',
          cta_primary_url: data.content.cta_primary_url || '',
          cta_secondary: data.content.cta_secondary || '',
          cta_secondary_url: data.content.cta_secondary_url || '',
          stat1_value: data.content.stat1_value || '',
          stat1_label: data.content.stat1_label || '',
          stat2_value: data.content.stat2_value || '',
          stat2_label: data.content.stat2_label || '',
          stat3_value: data.content.stat3_value || '',
          stat3_label: data.content.stat3_label || '',
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
      let highlights: string[] = [];
      if (values.title_highlights) {
        try {
          highlights = JSON.parse(values.title_highlights);
        } catch {
          message.error('Title highlights must be valid JSON array');
          setSaving(false);
          return;
        }
      }
      const content = { ...values, title_highlights: highlights };
      const response = await fetch(`${API_BASE_URL}/content/section/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        message.success('Hero section updated successfully!');
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
          label="Badge Text"
          name="badge"
          tooltip="The small badge above the main title"
        >
          <Input placeholder="AI-Powered Mental Health Platform" size="large" />
        </Form.Item>

        <Form.Item
          label="Main Title"
          name="title"
          tooltip="The primary headline"
        >
          <Input placeholder="Transform Mental Healthcare" size="large" />
        </Form.Item>

        <Form.Item
          label="Title highlights (JSON array of phrases to color)"
          name="title_highlights"
        >
          <Input placeholder='["Reduce admin."]' size="large" />
        </Form.Item>

        <Form.Item
          label="Hero desktop image URL"
          name="hero_desktop_image"
        >
          <Input placeholder="/landing/hero-dashboard.svg" size="large" />
        </Form.Item>

        <Form.Item
          label="Hero phone image URL"
          name="hero_mobile_image"
        >
          <Input placeholder="/landing/hero-phone.svg" size="large" />
        </Form.Item>

        <Form.Item
          label="Subtitle"
          name="subtitle"
          tooltip="Text that appears below the title"
        >
          <Input placeholder="With ANTSA" size="large" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          tooltip="The paragraph below the title"
        >
          <TextArea
            rows={4}
            placeholder="24/7 AI mental health assistant support..."
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Primary Button Text"
          name="cta_primary"
        >
          <Input placeholder="Start Free Trial" size="large" />
        </Form.Item>

        <Form.Item
          label="Primary Button URL"
          name="cta_primary_url"
          tooltip="URL for the primary call-to-action button"
        >
          <Input placeholder="https://app.antsa.ai/signup" size="large" />
        </Form.Item>

        <Form.Item
          label="Secondary Button Text"
          name="cta_secondary"
        >
          <Input placeholder="Watch Demo" size="large" />
        </Form.Item>

        <Form.Item
          label="Secondary Button URL (Video)"
          name="cta_secondary_url"
          tooltip="YouTube, Vimeo, or any video URL for the demo"
        >
          <Input placeholder="https://www.youtube.com/watch?v=..." size="large" />
        </Form.Item>

        <div style={{ marginTop: 30, marginBottom: 15 }}>
          <strong style={{ fontSize: '1.1rem' }}>Statistics Section</strong>
        </div>

        <Form.Item
          label="Stat 1 Value"
          name="stat1_value"
        >
          <Input placeholder="500+" size="large" />
        </Form.Item>

        <Form.Item
          label="Stat 1 Label"
          name="stat1_label"
        >
          <Input placeholder="Clinicians" size="large" />
        </Form.Item>

        <Form.Item
          label="Stat 2 Value"
          name="stat2_value"
        >
          <Input placeholder="10K+" size="large" />
        </Form.Item>

        <Form.Item
          label="Stat 2 Label"
          name="stat2_label"
        >
          <Input placeholder="Clients" size="large" />
        </Form.Item>

        <Form.Item
          label="Stat 3 Value"
          name="stat3_value"
        >
          <Input placeholder="80%" size="large" />
        </Form.Item>

        <Form.Item
          label="Stat 3 Label"
          name="stat3_label"
        >
          <Input placeholder="Time Saved" size="large" />
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

export default HeroEditor;

