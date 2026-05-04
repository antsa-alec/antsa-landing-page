import { Button, Input, Space, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { API_BASE_URL } from '../../pages/Admin';

type Props = {
  /** Current URL value (controlled). */
  value?: string;
  /** Set new URL (controlled). */
  onChange?: (url: string) => void;
  /** Section name for backend bookkeeping. */
  sectionName: string;
  /** Stable key for backend (e.g. "hero_desktop_image"). */
  imageKey: string;
  /** Auth bearer token. */
  token: string | null;
  placeholder?: string;
};

/**
 * Editable image URL with an inline file-upload button.
 * Lets admins either paste a URL or upload a fresh file (saved under
 * /api/images/<filename> and persisted in the images table). Inline preview is
 * shown when a value is present.
 */
const ImageUploadField = ({
  value,
  onChange,
  sectionName,
  imageKey,
  token,
  placeholder,
}: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!token) {
      message.error('Not authenticated');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('sectionName', sectionName);
      fd.append('key', imageKey);
      const r = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      onChange?.(data.path);
      message.success('Image uploaded');
    } catch (e: any) {
      message.error(`Upload failed: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          size="large"
        />
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
          accept="image/*"
        >
          <Button size="large" icon={<UploadOutlined />} loading={uploading}>
            Upload
          </Button>
        </Upload>
      </Space.Compact>
      {value ? (
        <div
          style={{
            marginTop: 8,
            padding: 8,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            background: '#f8fafc',
            maxWidth: 320,
          }}
        >
          <img
            alt="preview"
            src={value}
            style={{ width: '100%', height: 'auto', borderRadius: 6, display: 'block' }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ImageUploadField;
