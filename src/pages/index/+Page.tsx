import { Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function Page() {
  return (
    <main style={{ padding: 40 }}>
      <Title level={1}>ANTSA SSR scaffold</Title>
      <Paragraph>Vike is rendering this server-side with AntD styles inlined.</Paragraph>
      <Button type="primary">Sample button</Button>
    </main>
  );
}
