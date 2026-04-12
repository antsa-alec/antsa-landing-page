import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Typography,
  Spin,
  Tabs,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileTextOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface HelpCentreEditorProps {
  auth: AuthContextType;
}

interface HelpCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parent_id: number | null;
  order_index: number;
}

interface HelpArticle {
  id: number;
  category_id: number;
  category_name?: string;
  title: string;
  content: string;
  order_index: number;
}

const HelpCentreEditor = ({ auth }: HelpCentreEditorProps) => {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const [catModalVisible, setCatModalVisible] = useState(false);
  const [editingCat, setEditingCat] = useState<HelpCategory | null>(null);
  const [catForm] = Form.useForm();

  const [artModalVisible, setArtModalVisible] = useState(false);
  const [editingArt, setEditingArt] = useState<HelpArticle | null>(null);
  const [artForm] = Form.useForm();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [catRes, artRes] = await Promise.all([
        fetch(`${API_BASE_URL}/content/help/categories`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
        fetch(`${API_BASE_URL}/content/help/articles`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
      ]);
      const catData = await catRes.json();
      const artData = await artRes.json();
      setCategories(catData.categories || []);
      setArticles(artData.articles || []);
    } catch (error) {
      console.error('Fetch help centre error:', error);
      message.error('Failed to load help centre data');
    } finally {
      setLoading(false);
    }
  };

  // ─── Category CRUD ──────────────────────────────────────────────────────────

  const topLevelCategories = categories.filter((c) => !c.parent_id);

  const handleAddCat = () => {
    setEditingCat(null);
    catForm.resetFields();
    catForm.setFieldsValue({ order_index: categories.length });
    setCatModalVisible(true);
  };

  const handleEditCat = (cat: HelpCategory) => {
    setEditingCat(cat);
    catForm.setFieldsValue(cat);
    setCatModalVisible(true);
  };

  const handleDeleteCat = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/help/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (res.ok) {
        message.success('Category deleted');
        fetchAll();
      } else {
        message.error('Failed to delete category');
      }
    } catch {
      message.error('Connection error');
    }
  };

  const handleSubmitCat = async (values: any) => {
    try {
      const slug =
        values.slug ||
        values.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const payload = { ...values, slug };
      const url = editingCat
        ? `${API_BASE_URL}/content/help/categories/${editingCat.id}`
        : `${API_BASE_URL}/content/help/categories`;

      const res = await fetch(url, {
        method: editingCat ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success(`Category ${editingCat ? 'updated' : 'created'}`);
        setCatModalVisible(false);
        fetchAll();
      } else {
        const data = await res.json();
        message.error(data.error || 'Failed to save category');
      }
    } catch {
      message.error('Connection error');
    }
  };

  // ─── Article CRUD ───────────────────────────────────────────────────────────

  const handleAddArt = () => {
    setEditingArt(null);
    artForm.resetFields();
    artForm.setFieldsValue({ order_index: articles.length });
    setArtModalVisible(true);
  };

  const handleEditArt = (art: HelpArticle) => {
    setEditingArt(art);
    artForm.setFieldsValue(art);
    setArtModalVisible(true);
  };

  const handleDeleteArt = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/help/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (res.ok) {
        message.success('Article deleted');
        fetchAll();
      } else {
        message.error('Failed to delete article');
      }
    } catch {
      message.error('Connection error');
    }
  };

  const handleSubmitArt = async (values: any) => {
    try {
      const url = editingArt
        ? `${API_BASE_URL}/content/help/articles/${editingArt.id}`
        : `${API_BASE_URL}/content/help/articles`;

      const res = await fetch(url, {
        method: editingArt ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success(`Article ${editingArt ? 'updated' : 'created'}`);
        setArtModalVisible(false);
        fetchAll();
      } else {
        const data = await res.json();
        message.error(data.error || 'Failed to save article');
      }
    } catch {
      message.error('Connection error');
    }
  };

  // ─── Table columns ─────────────────────────────────────────────────────────

  const catColumns = [
    {
      title: 'Order',
      dataIndex: 'order_index',
      key: 'order_index',
      width: 70,
      render: (i: number) => <Text style={{ color: '#999' }}>#{i}</Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: HelpCategory) => (
        <Space>
          <FolderOutlined style={{ color: record.parent_id ? '#94a3b8' : '#48abe2' }} />
          <Text strong={!record.parent_id}>{text}</Text>
          {record.parent_id && (
            <Tag color="default" style={{ fontSize: '11px' }}>
              sub
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Parent',
      key: 'parent',
      render: (_: any, record: HelpCategory) => {
        if (!record.parent_id) return <Text style={{ color: '#ccc' }}>—</Text>;
        const parent = categories.find((c) => c.id === record.parent_id);
        return <Text style={{ color: '#666' }}>{parent?.name || '?'}</Text>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: HelpCategory) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditCat(record)} />
          <Popconfirm
            title="Delete this category and all its contents?"
            onConfirm={() => handleDeleteCat(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const artColumns = [
    {
      title: 'Order',
      dataIndex: 'order_index',
      key: 'order_index',
      width: 70,
      render: (i: number) => <Text style={{ color: '#999' }}>#{i}</Text>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#48abe2' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <Text style={{ color: '#666' }}>
          {text ? (text.length > 80 ? `${text.slice(0, 80)}...` : text) : '(empty)'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: HelpArticle) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditArt(record)} />
          <Popconfirm
            title="Delete this article?"
            onConfirm={() => handleDeleteArt(record.id)}
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

  // Build a grouped select for article category picker
  const categoryOptions = topLevelCategories.flatMap((top) => {
    const subs = categories.filter((c) => c.parent_id === top.id);
    if (subs.length === 0) {
      return [{ label: top.name, value: top.id }];
    }
    return [
      { label: top.name, value: top.id },
      ...subs.map((s) => ({
        label: `  └ ${s.name}`,
        value: s.id,
      })),
    ];
  });

  return (
    <div>
      <Tabs
        defaultActiveKey="categories"
        items={[
          {
            key: 'categories',
            label: (
              <span>
                <FolderOutlined /> Categories ({categories.length})
              </span>
            ),
            children: (
              <Card>
                <div
                  style={{
                    marginBottom: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <Title level={4} style={{ marginBottom: 8 }}>
                      Help Categories
                    </Title>
                    <Paragraph style={{ color: '#666', marginBottom: 0 }}>
                      Organise help content into top-level categories and subcategories.
                    </Paragraph>
                  </div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCat}>
                    Add Category
                  </Button>
                </div>
                <Table
                  dataSource={categories}
                  columns={catColumns}
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: 'No categories yet.' }}
                />
              </Card>
            ),
          },
          {
            key: 'articles',
            label: (
              <span>
                <FileTextOutlined /> Articles ({articles.length})
              </span>
            ),
            children: (
              <Card>
                <div
                  style={{
                    marginBottom: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <Title level={4} style={{ marginBottom: 8 }}>
                      Help Articles
                    </Title>
                    <Paragraph style={{ color: '#666', marginBottom: 0 }}>
                      Create articles with markdown content. Articles expand as accordions in the
                      Help Centre.
                    </Paragraph>
                  </div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddArt}>
                    Add Article
                  </Button>
                </div>
                <Table
                  dataSource={articles}
                  columns={artColumns}
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: 'No articles yet.' }}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* Category Modal */}
      <Modal
        title={editingCat ? 'Edit Category' : 'Add Category'}
        open={catModalVisible}
        onCancel={() => setCatModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={catForm} layout="vertical" onFinish={handleSubmitCat}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g., For Practitioners" size="large" />
          </Form.Item>

          <Form.Item label="Slug" name="slug" tooltip="Auto-generated from name if left blank">
            <Input placeholder="e.g., for-practitioners" size="large" />
          </Form.Item>

          <Form.Item
            label="Parent Category"
            name="parent_id"
            tooltip="Leave empty for a top-level category"
          >
            <Select
              allowClear
              placeholder="None (top-level)"
              size="large"
              options={topLevelCategories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input placeholder="Short description (optional)" size="large" />
          </Form.Item>

          <Form.Item label="Order" name="order_index">
            <Input type="number" size="large" style={{ width: 120 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingCat ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setCatModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Article Modal */}
      <Modal
        title={editingArt ? 'Edit Article' : 'Add Article'}
        open={artModalVisible}
        onCancel={() => setArtModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={artForm} layout="vertical" onFinish={handleSubmitArt}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="e.g., Uploading Files to ANTSA" size="large" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category_id"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Select placeholder="Select a category" size="large" options={categoryOptions} />
          </Form.Item>

          <Form.Item
            label="Content (Markdown)"
            name="content"
            tooltip="Supports markdown formatting"
          >
            <TextArea
              rows={12}
              placeholder="Write your guide content here using markdown..."
              size="large"
            />
          </Form.Item>

          <Form.Item label="Order" name="order_index">
            <Input type="number" size="large" style={{ width: 120 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingArt ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setArtModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HelpCentreEditor;
