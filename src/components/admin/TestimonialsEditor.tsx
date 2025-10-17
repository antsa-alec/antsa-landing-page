import { useState, useEffect } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Spin, Space, Popconfirm, Rate } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { TextArea } = Input;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  order_index: number;
}

interface TestimonialsEditorProps {
  auth: AuthContextType;
}

const TestimonialsEditor = ({ auth }: TestimonialsEditorProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/section/testimonials`);
      const data = await response.json();

      if (response.ok) {
        setTestimonials(data.content.items || []);
      } else {
        message.error('Failed to load testimonials');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    form.setFieldsValue(testimonial);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Testimonial deleted successfully!');
        fetchTestimonials();
      } else {
        message.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingTestimonial
        ? `${API_BASE_URL}/content/testimonials/${editingTestimonial.id}`
        : `${API_BASE_URL}/content/testimonials`;

      const response = await fetch(url, {
        method: editingTestimonial ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully!`);
        setModalVisible(false);
        fetchTestimonials();
      } else {
        message.error('Failed to save testimonial');
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
        <h3>Client Testimonials</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Testimonial
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2 }}
        dataSource={testimonials}
        renderItem={(testimonial) => (
          <List.Item>
            <Card
              actions={[
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(testimonial)}
                >
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete this testimonial?"
                  onConfirm={() => handleDelete(testimonial.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Rate disabled value={testimonial.rating} style={{ marginBottom: 8 }} />
              <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>"{testimonial.content}"</p>
              <div style={{ marginTop: 12 }}>
                <strong>{testimonial.name}</strong>
                {testimonial.role && <div style={{ color: '#999' }}>{testimonial.role}</div>}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ rating: 5, order_index: 0 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="John Smith" />
          </Form.Item>

          <Form.Item
            label="Role/Title"
            name="role"
          >
            <Input placeholder="Clinical Psychologist" />
          </Form.Item>

          <Form.Item
            label="Testimonial"
            name="content"
            rules={[{ required: true, message: 'Please enter the testimonial' }]}
          >
            <TextArea rows={4} placeholder="ANTSA has transformed how I..." />
          </Form.Item>

          <Form.Item
            label="Rating"
            name="rating"
          >
            <Rate />
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
                {editingTestimonial ? 'Update' : 'Create'}
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

export default TestimonialsEditor;

