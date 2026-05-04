import type { ComponentType, CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import * as AntIcons from '@ant-design/icons';

type TrustItem = { label: string; icon: string };

const defaults: TrustItem[] = [
  { label: 'Australian Hosted', icon: 'GlobalOutlined' },
  { label: 'Built by Clinicians', icon: 'MedicineBoxOutlined' },
  { label: 'HIPAA & APP Aligned', icon: 'SafetyCertificateOutlined' },
  { label: 'No Lock-In', icon: 'UnlockOutlined' },
  { label: 'Unlimited Clients', icon: 'TeamOutlined' },
];

const TrustStrip = () => {
  const [items, setItems] = useState<TrustItem[]>(defaults);

  useEffect(() => {
    fetch('/api/content/section/trust_strip')
      .then((res) => res.json())
      .then((data) => {
        const raw = data.content?.items;
        if (Array.isArray(raw) && raw.length) setItems(raw);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 40px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px 32px',
      }}
      aria-label="Trust and compliance highlights"
    >
      {items.map((item, i) => {
        const Icon =
          (AntIcons as unknown as Record<string, ComponentType<{ style?: CSSProperties }>>)[item.icon] ||
          AntIcons.CheckCircleOutlined;
        return (
          <div
            key={`${item.label}-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#475569',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Icon style={{ fontSize: 20, color: '#48abe2' }} aria-hidden />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustStrip;
