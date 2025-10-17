import { useState, useEffect } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Spin, Space, Popconfirm, Switch, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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

  const handleAdd = () => {
    setEditingPlan(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      ...plan,
      features: plan.features.join('\n'),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/pricing/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Pricing plan deleted successfully!');
        fetchPlans();
      } else {
        message.error('Failed to delete pricing plan');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const featuresArray = values.features.split('\n').filter((f: string) => f.trim());

      const url = editingPlan
        ? `${API_BASE_URL}/content/pricing/${editingPlan.id}`
        : `${API_BASE_URL}/content/pricing`;

      const response = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...values,
          features: featuresArray,
        }),
      });

      if (response.ok) {
        message.success(`Pricing plan ${editingPlan ? 'updated' : 'created'} successfully!`);
        setModalVisible(false);
        fetchPlans();
      } else {
        message.error('Failed to save pricing plan');
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
        <h3>Pricing Plans</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Plan
        </Button>
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
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(plan)}
                  />
                  <Popconfirm
                    title="Delete this plan?"
                    onConfirm={() => handleDelete(plan.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              }
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 8 }}>
                {plan.price}
                {plan.period && (
                  <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#999' }}>
                    /{plan.period}
                  </span>
                )}
              </div>
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingPlan ? 'Edit Plan' : 'Add Plan'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ order_index: 0, featured: false }}
        >
          <Form.Item
            label="Plan Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a plan name' }]}
          >
            <Input placeholder="Professional" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter a price' }]}
          >
            <Input placeholder="$99" />
          </Form.Item>

          <Form.Item
            label="Period"
            name="period"
          >
            <Input placeholder="month" />
          </Form.Item>

          <Form.Item
            label="Featured"
            name="featured"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Features (one per line)"
            name="features"
            tooltip="Enter each feature on a new line"
          >
            <Input.TextArea rows={8} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
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
                {editingPlan ? 'Update' : 'Create'}
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

