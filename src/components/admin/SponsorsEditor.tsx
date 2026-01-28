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
  Avatar,
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  TrophyOutlined,
  LinkOutlined,
  PictureOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Title, Paragraph, Text } = Typography;

interface SponsorsEditorProps {
  auth: AuthContextType;
}

interface Sponsor {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  order_index: number;
}

interface SectionContent {
  title?: string;
  subtitle?: string;
}

const SponsorsEditor = ({ auth }: SponsorsEditorProps) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sectionContent, setSectionContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [form] = Form.useForm();
  const [sectionForm] = Form.useForm();

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/sponsors`);
      const data = await response.json();
      
      if (response.ok) {
        setSponsors(data.sponsors || []);
        setSectionContent(data.sectionContent || {});
        sectionForm.setFieldsValue(data.sectionContent || {});
      }
    } catch (error) {
      console.error('Fetch sponsors error:', error);
      message.error('Failed to load sponsors');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSectionContent = async (values: any) => {
    setSavingSection(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content/sponsors/section-content`, {
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
    setEditingSponsor(null);
    form.resetFields();
    form.setFieldsValue({
      order_index: sponsors.length,
    });
    setModalVisible(true);
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    form.setFieldsValue(sponsor);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/sponsors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Sponsor deleted successfully');
        fetchSponsors();
      } else {
        message.error('Failed to delete sponsor');
      }
    } catch (error) {
      console.error('Delete sponsor error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingSponsor
        ? `${API_BASE_URL}/content/sponsors/${editingSponsor.id}`
        : `${API_BASE_URL}/content/sponsors`;
      
      const method = editingSponsor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`Sponsor ${editingSponsor ? 'updated' : 'created'} successfully`);
        setModalVisible(false);
        fetchSponsors();
      } else {
        const data = await response.json();
        message.error(data.error || `Failed to ${editingSponsor ? 'update' : 'create'} sponsor`);
      }
    } catch (error) {
      console.error('Submit sponsor error:', error);
      message.error('Connection error');
    }
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo_url',
      key: 'logo_url',
      width: 80,
      render: (url: string | null) => (
        url ? (
          <Avatar 
            src={url} 
            size={48} 
            shape="square"
            style={{ 
              background: '#f0f0f0',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Avatar 
            icon={<PictureOutlined />} 
            size={48} 
            shape="square"
            style={{ background: '#f0f0f0', color: '#999' }}
          />
        )
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website_url',
      key: 'website_url',
      render: (url: string | null) => (
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#48abe2' }}>
            <LinkOutlined /> {url.replace(/https?:\/\//, '').slice(0, 30)}...
          </a>
        ) : (
          <Text style={{ color: '#999' }}>-</Text>
        )
      ),
    },
    {
      title: 'Order',
      dataIndex: 'order_index',
      key: 'order_index',
      width: 80,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Sponsor) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this sponsor?"
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
          <TrophyOutlined style={{ marginRight: 8 }} />
          Section Settings
        </Title>
        <Paragraph style={{ color: '#666', marginBottom: 24 }}>
          Configure the title and subtitle that appear above the sponsors logo strip.
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
            <Input placeholder="e.g., Trusted By, Our Partners" size="large" />
          </Form.Item>

          <Form.Item
            label="Section Subtitle"
            name="subtitle"
          >
            <Input placeholder="e.g., Leading mental health organizations" size="large" />
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

      {/* Sponsors List */}
      <Card>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ marginBottom: 8 }}>
              Sponsors / Partners
            </Title>
            <Paragraph style={{ color: '#666', marginBottom: 0 }}>
              Add logos of organizations that use or support ANTSA. Logos will appear in a scrolling banner.
            </Paragraph>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Sponsor
          </Button>
        </div>

        <Table
          dataSource={sponsors}
          columns={columns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'No sponsors yet. Click "Add Sponsor" to add one.' }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
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
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="e.g., Australian Psychological Society" size="large" />
          </Form.Item>

          <Form.Item
            label="Logo URL"
            name="logo_url"
            tooltip="Direct URL to the logo image. Recommended size: 150x60px"
          >
            <Input 
              prefix={<PictureOutlined />}
              placeholder="https://example.com/logo.png" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            label="Website URL"
            name="website_url"
            tooltip="Link to the sponsor's website (opens in new tab when clicked)"
          >
            <Input 
              prefix={<LinkOutlined />}
              placeholder="https://example.com" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            label="Order Index"
            name="order_index"
            tooltip="Lower numbers appear first"
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSponsor ? 'Update' : 'Create'}
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

export default SponsorsEditor;
