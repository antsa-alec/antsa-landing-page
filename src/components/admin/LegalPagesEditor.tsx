import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Spin,
  Tag,
  List,
} from 'antd';
import {
  EditOutlined,
  FileTextOutlined,
  SaveOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface LegalPagesEditorProps {
  auth: AuthContextType;
}

interface LegalPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  last_updated: string;
  updated_at: string;
}

const LegalPagesEditor = ({ auth }: LegalPagesEditorProps) => {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [editingPage, setEditingPage] = useState<LegalPage | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchPages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/legal`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await response.json();
      if (data.pages) setPages(data.pages);
    } catch (error) {
      console.error('Failed to load legal pages:', error);
      message.error('Failed to load legal pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page: LegalPage) => {
    setEditingPage(page);
    form.setFieldsValue({
      title: page.title,
      content: page.content,
      last_updated: page.last_updated || '',
    });
    setEditModal(true);
  };

  const handlePreview = (page: LegalPage) => {
    setEditingPage(page);
    setPreviewModal(true);
  };

  const handleSave = async () => {
    if (!editingPage) return;

    try {
      const values = await form.validateFields();
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/content/legal/${editingPage.slug}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        message.success('Legal page updated successfully');
        setEditModal(false);
        fetchPages();
      } else {
        message.error('Failed to update legal page');
      }
    } catch (error) {
      console.error('Save error:', error);
      message.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          <FileTextOutlined /> Legal Pages
        </Title>
        <Paragraph type="secondary" style={{ marginTop: 8 }}>
          Manage your Privacy Policy and Terms & Conditions pages. Content is
          written in Markdown.
        </Paragraph>
      </div>

      <List
        dataSource={pages}
        renderItem={(page) => (
          <Card
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <Space>
                  <Text strong style={{ fontSize: '16px' }}>
                    {page.title}
                  </Text>
                  <Tag color={page.content ? 'green' : 'orange'}>
                    {page.content ? 'Published' : 'Placeholder'}
                  </Tag>
                </Space>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Route: /{page.slug}
                    {page.last_updated && ` · Last updated: ${page.last_updated}`}
                  </Text>
                </div>
              </div>
              <Space>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview(page)}
                >
                  Preview
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(page)}
                >
                  Edit
                </Button>
              </Space>
            </div>
          </Card>
        )}
      />

      {/* Edit Modal */}
      <Modal
        title={`Edit ${editingPage?.title || 'Legal Page'}`}
        open={editModal}
        onCancel={() => setEditModal(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setEditModal(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Page Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="e.g. Privacy Policy" />
          </Form.Item>

          <Form.Item
            name="last_updated"
            label="Last Updated Label"
          >
            <Input placeholder="e.g. February 2026" />
          </Form.Item>

          <Form.Item
            name="content"
            label={
              <Space direction="vertical" size={0}>
                <span>Page Content (Markdown)</span>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 400 }}>
                  # Heading 1 &nbsp; ## Heading 2 &nbsp; **bold** &nbsp; *italic* &nbsp; - bullet list &nbsp; 1. numbered list &nbsp; [link text](url) &nbsp; --- horizontal rule
                </Text>
              </Space>
            }
            rules={[{ required: true, message: 'Content is required' }]}
          >
            <TextArea
              rows={20}
              placeholder={`## 1. Introduction\n\nYour content here...\n\n## 2. Information We Collect\n\nWe collect the following types of information:\n\n- **Personal details** such as name and email\n- Usage data and analytics\n- Device and browser information\n\n## 3. Contact Us\n\nEmail us at [admin@antsa.com.au](mailto:admin@antsa.com.au).`}
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title={`Preview: ${editingPage?.title || ''}`}
        open={previewModal}
        onCancel={() => setPreviewModal(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setPreviewModal(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setPreviewModal(false);
              if (editingPage) handleEdit(editingPage);
            }}
          >
            Edit
          </Button>,
        ]}
      >
        {editingPage?.content ? (
          <div
            className="legal-content"
            style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.8,
              maxHeight: '60vh',
              overflow: 'auto',
              padding: '16px',
            }}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{editingPage.content}</Markdown>
          </div>
        ) : (
          <Paragraph type="secondary" style={{ textAlign: 'center', padding: '40px 0' }}>
            No content yet. Click Edit to add content.
          </Paragraph>
        )}
      </Modal>
    </div>
  );
};

export default LegalPagesEditor;
