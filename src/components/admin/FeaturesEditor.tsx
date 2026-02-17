import { useState, useEffect } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Spin, Space, Popconfirm, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
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
  image_url: string | null;
}

interface FeaturesEditorProps {
  auth: AuthContextType;
  sectionName?: string;
}

const FeaturesEditor = ({ auth, sectionName = 'features' }: FeaturesEditorProps) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFeatures();
  }, [sectionName]);

  const fetchFeatures = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/${sectionName}`);
      const data = await response.json();

      if (response.ok) {
        setFeatures(data.content?.items || data.items || []);
      } else {
        message.error(`Failed to load ${sectionName} items`);
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

  const handleImageUpload = async (featureId: number, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('sectionName', sectionName);
      formData.append('key', `feature-${featureId}`);

      const uploadResponse = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.path;

        const updateResponse = await fetch(`${API_BASE_URL}/content/features/${featureId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            ...features.find(f => f.id === featureId),
            image_url: imageUrl,
          }),
        });

        if (updateResponse.ok) {
          message.success('Image uploaded successfully!');
          fetchFeatures();
        } else {
          message.error('Failed to link image to feature');
        }
      } else {
        message.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Connection error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingFeature
        ? `${API_BASE_URL}/content/features/${editingFeature.id}`
        : `${API_BASE_URL}/content/features`;

      const payload = {
        ...values,
        image_url: editingFeature?.image_url || values.image_url || null,
      };

      const response = await fetch(url, {
        method: editingFeature ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
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
        <h3>{sectionName === 'features' ? 'Feature Cards' : `${sectionName} Cards`}</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Feature
        </Button>
      </div>

      <List
        dataSource={features}
        renderItem={(feature) => (
          <List.Item>
            <Card
              title={feature.title}
              style={{ width: '100%' }}
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
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ whiteSpace: 'pre-line' }}>{feature.description}</p>
                  <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#999' }}>
                    Icon: {feature.icon}<br />
                    Color: <span style={{ color: feature.color }}>{feature.color}</span>
                  </div>
                </div>
                <div style={{ width: 160, flexShrink: 0 }}>
                  {feature.image_url ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={feature.image_url}
                        alt={feature.title}
                        style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0' }}
                      />
                      <div style={{ marginTop: 8, textAlign: 'center' }}>
                        <Upload
                          showUploadList={false}
                          beforeUpload={(file) => {
                            handleImageUpload(feature.id, file);
                            return false;
                          }}
                          accept="image/*"
                        >
                          <Button size="small" icon={<UploadOutlined />} loading={uploading}>
                            Replace
                          </Button>
                        </Upload>
                      </div>
                    </div>
                  ) : (
                    <Upload
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImageUpload(feature.id, file);
                        return false;
                      }}
                      accept="image/*"
                    >
                      <div
                        style={{
                          width: '100%',
                          height: 120,
                          borderRadius: 8,
                          border: '2px dashed #d9d9d9',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#999',
                          fontSize: 13,
                        }}
                      >
                        <UploadOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                        Upload Image
                      </div>
                    </Upload>
                  )}
                </div>
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
            <TextArea rows={6} />
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
