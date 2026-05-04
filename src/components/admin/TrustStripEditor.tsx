import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;

interface TrustStripEditorProps {
  auth: AuthContextType;
}

const TrustStripEditor = ({ auth }: TrustStripEditorProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/content/section/trust_strip`);
        const data = await res.json();
        if (res.ok && data.content) {
          form.setFieldsValue({
            itemsJson: JSON.stringify(data.content.items || [], null, 2),
          });
        }
      } catch (e) {
        message.error('Failed to load trust strip');
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const onFinish = async (values: { itemsJson: string }) => {
    setSaving(true);
    try {
      let items;
      try {
        items = JSON.parse(values.itemsJson);
      } catch {
        message.error('Items must be valid JSON');
        setSaving(false);
        return;
      }
      if (!Array.isArray(items)) {
        message.error('Items must be a JSON array');
        setSaving(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/content/section/trust_strip`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ content: { items } }),
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
    <Card title="Trust strip (home page)">
      <p style={{ color: '#666', marginBottom: 16 }}>
        Array of <code>label</code> and <code>icon</code> (Ant Design icon name), e.g.{' '}
        <code>GlobalOutlined</code>.
      </p>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="itemsJson"
          label="Items JSON"
          rules={[{ required: true, message: 'Required' }]}
        >
          <TextArea rows={14} style={{ fontFamily: 'monospace' }} />
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

export default TrustStripEditor;
