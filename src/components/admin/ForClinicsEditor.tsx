import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;

interface ForClinicsEditorProps {
  auth: AuthContextType;
}

const ForClinicsEditor = ({ auth }: ForClinicsEditorProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/content/section/for_clinics`);
        const data = await res.json();
        if (res.ok && data.content) {
          const c = data.content;
          form.setFieldsValue({
            title: c.title || '',
            subtitle: c.subtitle || '',
            checklistText: Array.isArray(c.checklist) ? c.checklist.join('\n') : '',
            cta_label: c.cta_label || '',
            cta_href: c.cta_href || '',
          });
        }
      } catch {
        message.error('Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const onFinish = async (values: Record<string, string>) => {
    setSaving(true);
    try {
      const checklist = values.checklistText
        .split('\n')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const res = await fetch(`${API_BASE_URL}/content/section/for_clinics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          content: {
            title: values.title,
            subtitle: values.subtitle,
            checklist,
            cta_label: values.cta_label,
            cta_href: values.cta_href,
          },
        }),
      });
      if (res.ok) message.success('Saved');
      else message.error('Save failed');
    } catch {
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
    <Card title="For Clinics & Enterprises (home page band)">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title">
          <Input size="large" />
        </Form.Item>
        <Form.Item name="subtitle" label="Subtitle">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="checklistText"
          label="Checklist (one line per item)"
        >
          <TextArea rows={6} />
        </Form.Item>
        <Form.Item name="cta_label" label="CTA label">
          <Input />
        </Form.Item>
        <Form.Item name="cta_href" label="CTA link (URL or mailto)">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ForClinicsEditor;
