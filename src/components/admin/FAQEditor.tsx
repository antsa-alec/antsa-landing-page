import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message, 
  Popconfirm, 
  Typography,
  Spin,
  Divider,
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface FAQEditorProps {
  auth: AuthContextType;
}

interface FAQItem {
  id: number;
  section_id: number;
  question: string;
  answer: string;
  order_index: number;
}

interface SectionContent {
  title?: string;
  subtitle?: string;
}

const FAQEditor = ({ auth }: FAQEditorProps) => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [sectionContent, setSectionContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [form] = Form.useForm();
  const [sectionForm] = Form.useForm();

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/faq`);
      const data = await response.json();
      
      if (response.ok) {
        setFaqItems(data.items || []);
        setSectionContent(data.sectionContent || {});
        sectionForm.setFieldsValue(data.sectionContent || {});
      }
    } catch (error) {
      console.error('Fetch FAQ error:', error);
      message.error('Failed to load FAQ items');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSectionContent = async (values: any) => {
    setSavingSection(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content/faq/section-content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Section content updated successfully');
        setSectionContent(values);
      } else {
        message.error('Failed to update section content');
      }
    } catch (error) {
      console.error('Save section content error:', error);
      message.error('Connection error');
    } finally {
      setSavingSection(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      order_index: faqItems.length + 1,
    });
    setModalVisible(true);
  };

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/faq/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('FAQ item deleted successfully');
        fetchFAQ();
      } else {
        message.error('Failed to delete FAQ item');
      }
    } catch (error) {
      console.error('Delete FAQ item error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingItem
        ? `${API_BASE_URL}/content/faq/${editingItem.id}`
        : `${API_BASE_URL}/content/faq`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`FAQ item ${editingItem ? 'updated' : 'created'} successfully`);
        setModalVisible(false);
        fetchFAQ();
      } else {
        const data = await response.json();
        message.error(data.error || `Failed to ${editingItem ? 'update' : 'create'} FAQ item`);
      }
    } catch (error) {
      console.error('Submit FAQ item error:', error);
      message.error('Connection error');
    }
  };

  const columns = [
    {
      title: 'Order',
      dataIndex: 'order_index',
      key: 'order_index',
      width: 80,
      render: (index: number) => (
        <Text style={{ color: '#999' }}>#{index}</Text>
      ),
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: (text: string) => (
        <Space>
          <QuestionCircleOutlined style={{ color: '#48abe2' }} />
          <Text strong style={{ maxWidth: 400, display: 'inline-block' }}>
            {text.length > 80 ? `${text.slice(0, 80)}...` : text}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Answer Preview',
      dataIndex: 'answer',
      key: 'answer',
      render: (text: string) => (
        <Text style={{ color: '#666', maxWidth: 300, display: 'inline-block' }}>
          {text.length > 100 ? `${text.slice(0, 100)}...` : text}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: FAQItem) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this FAQ item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Section Settings */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          <QuestionCircleOutlined style={{ marginRight: 8 }} />
          Section Settings
        </Title>
        <Paragraph style={{ color: '#666', marginBottom: 24 }}>
          Configure the title and subtitle that appear at the top of the FAQ section.
        </Paragraph>

        <Form
          form={sectionForm}
          layout="vertical"
          onFinish={handleSaveSectionContent}
          initialValues={sectionContent}
        >
          <Form.Item
            label="Section Title"
            name="title"
          >
            <Input placeholder="e.g., Frequently Asked Questions" size="large" />
          </Form.Item>

          <Form.Item
            label="Section Subtitle"
            name="subtitle"
          >
            <Input placeholder="e.g., Everything you need to know about ANTSA" size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={savingSection}
            >
              Save Section Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* FAQ Items List */}
      <Card>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ marginBottom: 8 }}>
              FAQ Items
            </Title>
            <Paragraph style={{ color: '#666', marginBottom: 0 }}>
              Add frequently asked questions and their answers. Questions will be displayed in an accordion format.
            </Paragraph>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Question
          </Button>
        </div>

        <Table
          dataSource={faqItems}
          columns={columns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'No FAQ items yet. Click "Add Question" to add one.' }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? 'Edit FAQ Item' : 'Add FAQ Item'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            order_index: 0,
          }}
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: 'Please enter a question' }]}
          >
            <Input 
              placeholder="e.g., What is ANTSA?" 
              size="large" 
              prefix={<QuestionCircleOutlined style={{ color: '#999' }} />}
            />
          </Form.Item>

          <Form.Item
            label="Answer"
            name="answer"
            rules={[{ required: true, message: 'Please enter an answer' }]}
          >
            <TextArea 
              rows={6}
              placeholder="Enter a detailed answer to the question..."
              size="large"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            label="Order Index"
            name="order_index"
            tooltip="Lower numbers appear first. Questions are displayed in two columns."
          >
            <Input type="number" size="large" style={{ width: 150 }} />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
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

export default FAQEditor;
