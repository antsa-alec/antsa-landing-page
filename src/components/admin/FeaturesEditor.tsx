import { useState, useEffect } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Spin, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  order_index: number;
}

interface FeaturesEditorProps {
  auth: AuthContextType;
}

const FeaturesEditor = ({ auth }: FeaturesEditorProps) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/features`);
      const data = await response.json();

      if (response.ok) {
        setFeatures(data.content.items || []);
      } else {
        message.error('Failed to load features');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFeature(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    form.setFieldsValue(feature);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/features/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Feature deleted successfully!');
        fetchFeatures();
      } else {
        message.error('Failed to delete feature');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingFeature
        ? `${API_BASE_URL}/content/features/${editingFeature.id}`
        : `${API_BASE_URL}/content/features`;

      const response = await fetch(url, {
        method: editingFeature ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`Feature ${editingFeature ? 'updated' : 'created'} successfully!`);
        setModalVisible(false);
        fetchFeatures();
      } else {
        message.error('Failed to save feature');
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
        <h3>Feature Cards</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Feature
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
        dataSource={features}
        renderItem={(feature) => (
          <List.Item>
            <Card
              title={feature.title}
              extra={
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(feature)}
                  />
                  <Popconfirm
                    title="Delete this feature?"
                    onConfirm={() => handleDelete(feature.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              }
            >
              <p>{feature.description}</p>
              <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#999' }}>
                Icon: {feature.icon}<br />
                Color: <span style={{ color: feature.color }}>{feature.color}</span>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingFeature ? 'Edit Feature' : 'Add Feature'}
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
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Icon Name"
            name="icon"
            tooltip="Ant Design icon name (e.g., RobotOutlined)"
          >
            <Input placeholder="RobotOutlined" />
          </Form.Item>

          <Form.Item
            label="Color"
            name="color"
            tooltip="Hex color code"
          >
            <Input placeholder="#48abe2" />
          </Form.Item>

          <Form.Item
            label="Gradient"
            name="gradient"
            tooltip="CSS gradient"
          >
            <Input placeholder="linear-gradient(135deg, #48abe2 0%, #2196f3 100%)" />
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
                {editingFeature ? 'Update' : 'Create'}
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

export default FeaturesEditor;

