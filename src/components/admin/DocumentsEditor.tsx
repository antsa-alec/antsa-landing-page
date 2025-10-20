import { useState, useEffect } from 'react';
import { Card, Button, Upload, message, Space, Typography, Alert, Spin } from 'antd';
import { UploadOutlined, FilePdfOutlined, FileWordOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { AuthContextType, API_BASE_URL } from '../../pages/Admin';

const { Text, Paragraph } = Typography;

interface DocumentInfo {
  exists: boolean;
  id?: number;
  type?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  updatedAt?: string;
  url?: string;
}

interface DocumentsEditorProps {
  auth: AuthContextType;
}

const DocumentsEditor = ({ auth }: DocumentsEditorProps) => {
  const [privacyDoc, setPrivacyDoc] = useState<DocumentInfo | null>(null);
  const [termsDoc, setTermsDoc] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ privacy: boolean; terms: boolean }>({
    privacy: false,
    terms: false,
  });

  useEffect(() => {
    fetchDocumentInfo();
  }, []);

  const fetchDocumentInfo = async () => {
    setLoading(true);
    try {
      const [privacyRes, termsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/documents/privacy/info`),
        fetch(`${API_BASE_URL}/documents/terms/info`),
      ]);

      if (privacyRes.ok) {
        const privacyData = await privacyRes.json();
        setPrivacyDoc(privacyData);
      }

      if (termsRes.ok) {
        const termsData = await termsRes.json();
        setTermsDoc(termsData);
      }
    } catch (error) {
      console.error('Error fetching document info:', error);
      message.error('Failed to load document information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File, type: 'privacy' | 'terms') => {
    setUploading({ ...uploading, [type]: true });

    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success(`${type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} uploaded successfully!`);
        fetchDocumentInfo();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Connection error');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleDelete = async (type: 'privacy' | 'terms') => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.ok) {
        message.success(`${type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} deleted successfully!`);
        fetchDocumentInfo();
      } else {
        message.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Connection error');
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileTextOutlined />;
    if (mimeType.includes('pdf')) return <FilePdfOutlined />;
    if (mimeType.includes('word')) return <FileWordOutlined />;
    return <FileTextOutlined />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const uploadProps = (type: 'privacy' | 'terms'): UploadProps => ({
    accept: '.pdf,.doc,.docx,.txt',
    beforeUpload: (file) => {
      handleUpload(file, type);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Alert
        message="Legal Documents"
        description="Upload PDF, DOC, DOCX, or TXT files for your Privacy Policy and Terms of Service. These documents will be displayed to users when they click the respective links in the footer."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Privacy Policy */}
        <Card
          title={
            <Space>
              <FilePdfOutlined />
              Privacy Policy
            </Space>
          }
        >
          {privacyDoc?.exists ? (
            <div>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: '2rem' }}>
                    {getFileIcon(privacyDoc.mimeType)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong>{privacyDoc.originalName}</Text>
                    <br />
                    <Text type="secondary">
                      {formatFileSize(privacyDoc.size)} • Updated {new Date(privacyDoc.updatedAt || '').toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                <Space>
                  <Button
                    type="link"
                    href={`${API_BASE_URL}/documents/privacy`}
                    target="_blank"
                  >
                    View Document
                  </Button>
                  <Upload {...uploadProps('privacy')}>
                    <Button loading={uploading.privacy}>
                      Replace Document
                    </Button>
                  </Upload>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete('privacy')}
                  >
                    Delete
                  </Button>
                </Space>
              </Space>
            </div>
          ) : (
            <div>
              <Paragraph>No privacy policy document uploaded yet.</Paragraph>
              <Upload {...uploadProps('privacy')}>
                <Button type="primary" icon={<UploadOutlined />} loading={uploading.privacy}>
                  Upload Privacy Policy
                </Button>
              </Upload>
            </div>
          )}
        </Card>

        {/* Terms of Service */}
        <Card
          title={
            <Space>
              <FileTextOutlined />
              Terms of Service
            </Space>
          }
        >
          {termsDoc?.exists ? (
            <div>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: '2rem' }}>
                    {getFileIcon(termsDoc.mimeType)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong>{termsDoc.originalName}</Text>
                    <br />
                    <Text type="secondary">
                      {formatFileSize(termsDoc.size)} • Updated {new Date(termsDoc.updatedAt || '').toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                <Space>
                  <Button
                    type="link"
                    href={`${API_BASE_URL}/documents/terms`}
                    target="_blank"
                  >
                    View Document
                  </Button>
                  <Upload {...uploadProps('terms')}>
                    <Button loading={uploading.terms}>
                      Replace Document
                    </Button>
                  </Upload>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete('terms')}
                  >
                    Delete
                  </Button>
                </Space>
              </Space>
            </div>
          ) : (
            <div>
              <Paragraph>No terms of service document uploaded yet.</Paragraph>
              <Upload {...uploadProps('terms')}>
                <Button type="primary" icon={<UploadOutlined />} loading={uploading.terms}>
                  Upload Terms of Service
                </Button>
              </Upload>
            </div>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default DocumentsEditor;

