import { useState, useEffect } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Spin, Space, Tag, Alert } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  featured: number;
  features: string[];
  order_index: number;
}

interface PricingEditorProps {
  auth: AuthContextType;
}

const PricingEditor = ({ auth }: PricingEditorProps) => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/pricing`);
      const data = await response.json();

      if (response.ok) {
        setPlans(data.content.plans || []);
      } else {
        message.error('Failed to load pricing plans');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      features: plan.features.join('\n'),
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (!editingPlan) return;

    try {
      const featuresArray = values.features
        ? values.features.split('\n').filter((f: string) => f.trim())
        : [];

      const response = await fetch(`${API_BASE_URL}/content/pricing/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...editingPlan,
          features: featuresArray,
        }),
      });

      if (response.ok) {
        message.success('Feature list updated successfully!');
        setModalVisible(false);
        fetchPlans();
      } else {
        message.error('Failed to update feature list');
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
      <div style={{ marginBottom: 16 }}>
        <h3>Pricing Tiers — Feature Lists</h3>
        <Alert
          message="Pricing comes from Stripe. Use this editor to manage the feature bullet points shown on each pricing card."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
        dataSource={plans}
        renderItem={(plan) => (
          <List.Item>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {plan.name}
                  {plan.featured === 1 && <Tag color="gold">Featured</Tag>}
                </div>
              }
              extra={
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(plan)}
                />
              }
            >
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{feature}</li>
                ))}
              </ul>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={`Edit features — ${editingPlan?.name || ''}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Features (one per line)"
            name="features"
            tooltip="Each line becomes a bullet point on the pricing card"
          >
            <Input.TextArea rows={10} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Features
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

export default PricingEditor;
