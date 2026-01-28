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
  Switch, 
  message, 
  Popconfirm, 
  Typography,
  Tag,
  Spin,
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MenuOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface NavigationEditorProps {
  auth: AuthContextType;
}

interface NavItem {
  id: number;
  label: string;
  url: string | null;
  order_index: number;
  parent_id: number | null;
  is_cta: number;
  cta_style: string;
  children?: NavItem[];
}

const NavigationEditor = ({ auth }: NavigationEditorProps) => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/nav-items`);
      const data = await response.json();
      
      if (response.ok && data.items) {
        setNavItems(data.items);
      }
    } catch (error) {
      console.error('Fetch nav items error:', error);
      message.error('Failed to load navigation items');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      is_cta: false,
      cta_style: 'default',
      order_index: navItems.length,
    });
    setModalVisible(true);
  };

  const handleEdit = (item: NavItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      is_cta: item.is_cta === 1,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/nav-items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success('Navigation item deleted successfully');
        fetchNavItems();
      } else {
        message.error('Failed to delete navigation item');
      }
    } catch (error) {
      console.error('Delete nav item error:', error);
      message.error('Connection error');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingItem
        ? `${API_BASE_URL}/content/nav-items/${editingItem.id}`
        : `${API_BASE_URL}/content/nav-items`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...values,
          is_cta: values.is_cta ? 1 : 0,
        }),
      });

      if (response.ok) {
        message.success(`Navigation item ${editingItem ? 'updated' : 'created'} successfully`);
        setModalVisible(false);
        fetchNavItems();
      } else {
        const data = await response.json();
        message.error(data.error || `Failed to ${editingItem ? 'update' : 'create'} navigation item`);
      }
    } catch (error) {
      console.error('Submit nav item error:', error);
      message.error('Connection error');
    }
  };

  // Flatten items for table display
  const flattenItems = (items: NavItem[]): NavItem[] => {
    const result: NavItem[] = [];
    items.forEach(item => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          result.push({ ...child, label: `  └ ${child.label}` });
        });
      }
    });
    return result;
  };

  const columns = [
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (text: string, record: NavItem) => (
        <Space>
          <MenuOutlined style={{ color: '#999' }} />
          <span>{text}</span>
          {record.is_cta === 1 && (
            <Tag color={record.cta_style === 'primary' ? 'blue' : 'default'}>
              CTA
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url: string | null) => (
        <span style={{ color: '#666', fontSize: '0.9rem' }}>
          {url || '-'}
        </span>
      ),
    },
    {
      title: 'Style',
      dataIndex: 'cta_style',
      key: 'cta_style',
      render: (style: string, record: NavItem) => (
        record.is_cta === 1 ? (
          <Tag color={style === 'primary' ? 'blue' : style === 'ghost' ? 'default' : 'cyan'}>
            {style}
          </Tag>
        ) : '-'
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
      width: 150,
      render: (_: any, record: NavItem) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this navigation item?"
            description="This will also delete any child items."
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
      <Card>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ marginBottom: 8 }}>
              <MenuOutlined style={{ marginRight: 8 }} />
              Header Navigation
            </Title>
            <Paragraph style={{ color: '#666', marginBottom: 0 }}>
              Manage the navigation items that appear in the header. Items marked as CTA will appear as buttons on the right side.
            </Paragraph>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Item
          </Button>
        </div>

        <Table
          dataSource={flattenItems(navItems)}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
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
            is_cta: false,
            cta_style: 'default',
            order_index: 0,
          }}
        >
          <Form.Item
            label="Label"
            name="label"
            rules={[{ required: true, message: 'Please enter a label' }]}
          >
            <Input placeholder="e.g., Features, Pricing, Contact" size="large" />
          </Form.Item>

          <Form.Item
            label="URL"
            name="url"
            tooltip="Use # followed by section ID for in-page navigation (e.g., #features)"
          >
            <Input 
              prefix={<LinkOutlined />}
              placeholder="e.g., #features or https://app.antsa.ai/signup" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            label="Parent Item"
            name="parent_id"
            tooltip="Select a parent to create a dropdown menu"
          >
            <Select placeholder="None (top-level)" size="large" allowClear>
              {navItems
                .filter(item => !item.is_cta && !item.parent_id)
                .map(item => (
                  <Option key={item.id} value={item.id} disabled={editingItem?.id === item.id}>
                    {item.label}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="Is CTA Button"
            name="is_cta"
            valuePropName="checked"
            tooltip="CTA buttons appear on the right side of the header"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.is_cta !== currentValues.is_cta}
          >
            {({ getFieldValue }) => 
              getFieldValue('is_cta') && (
                <Form.Item
                  label="Button Style"
                  name="cta_style"
                >
                  <Select size="large">
                    <Option value="primary">Primary (Filled)</Option>
                    <Option value="ghost">Ghost (Outline)</Option>
                    <Option value="default">Default</Option>
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item
            label="Order Index"
            name="order_index"
            tooltip="Lower numbers appear first"
          >
            <Input type="number" size="large" />
          </Form.Item>

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

export default NavigationEditor;
