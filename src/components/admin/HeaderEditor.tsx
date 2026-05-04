import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Spin, Space, Alert } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { AuthContextType } from '../../pages/Admin';
import { API_BASE_URL } from '../../pages/Admin';

const FIELDS: Array<{ key: string; label: string; tooltip?: string; placeholder?: string }> = [
  { key: 'signin_label', label: 'Log In — button label', placeholder: 'Log In' },
  {
    key: 'signin_url',
    label: 'Log In — destination URL',
    placeholder: 'https://au.antsa.ai/sign-in',
  },
  { key: 'signup_label', label: 'Start Free Trial — button label', placeholder: 'Start Free Trial' },
  { key: 'signup_url', label: 'Start Free Trial — destination URL', placeholder: '/free-trial' },
  { key: 'demo_label', label: 'Book a Demo — button label', placeholder: 'Book a Demo' },
  {
    key: 'demo_url',
    label: 'Book a Demo — destination URL',
    tooltip:
      'Where the Book-a-Demo CTA points (header + mobile nav). Use the Calendly link, a mailto:, or a custom landing page.',
    placeholder: 'https://calendly.com/sally-anne-mcc',
  },
];

const HeaderEditor = ({ auth }: { auth: AuthContextType }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE_URL}/content/section/header`);
      const d = await r.json();
      const c = d?.content || {};
      form.setFieldsValue(
        FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: c[f.key] || '' }), {} as any),
      );
    } catch (e: any) {
      message.error('Failed to load header content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      const r = await fetch(`${API_BASE_URL}/content/section/header`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ content: values }),
      });
      if (!r.ok) throw new Error(await r.text());
      message.success('Header saved');
    } catch (e: any) {
      message.error(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Card>
      <Alert
        showIcon
        type="info"
        style={{ marginBottom: 16 }}
        message="These three CTAs (Log In, Start Free Trial, Book a Demo) appear in both the desktop header and the mobile drawer."
      />
      <Form form={form} layout="vertical" onFinish={handleSave} autoComplete="off">
        {FIELDS.map((f) => (
          <Form.Item key={f.key} label={f.label} name={f.key} tooltip={f.tooltip}>
            <Input placeholder={f.placeholder} size="large" />
          </Form.Item>
        ))}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              size="large"
            >
              Save changes
            </Button>
            <Button onClick={load} size="large">
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default HeaderEditor;
