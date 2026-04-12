import { useEffect, useState, useRef } from 'react';
import { Typography, Layout, Spin, Collapse, ConfigProvider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppHeader from '../components/AppHeader';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface Article {
  id: number;
  title: string;
  content: string;
  order_index: number;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  articles: Article[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  articles: Article[];
  subcategories: SubCategory[];
}

const HelpCentre = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch('/api/content/help')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setActiveCategory(data.categories[0].slug);
          }
        }
      })
      .catch((err) => console.error('Failed to load help centre:', err))
      .finally(() => setLoading(false));
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories]);

  const scrollToSection = (slug: string) => {
    const el = sectionRefs.current[slug];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Check if a category (or any of its subcategories) has articles
  const hasContent = (cat: Category) =>
    cat.articles.length > 0 ||
    cat.subcategories.some((s) => s.articles.length > 0);

  const theme = {
    token: {
      colorPrimary: '#48abe2',
      colorTextBase: '#0f172a',
      colorBgBase: '#ffffff',
      borderRadius: 12,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 16,
      lineHeight: 1.6,
    },
    components: {
      Layout: { headerBg: '#ffffff', bodyBg: '#ffffff' },
      Button: { borderRadius: 8, controlHeight: 48, fontWeight: 600 },
    },
  };

  return (
    <ConfigProvider theme={theme}>
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <AppHeader />

      <Content
        style={{
          paddingTop: '110px',
          paddingBottom: '80px',
          maxWidth: '960px',
          margin: '0 auto',
          width: '100%',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Page header — matches landing page section style */}
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Title
                level={5}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#48abe2',
                  marginBottom: '16px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                }}
              >
                HELP CENTRE
              </Title>
              <Title
                level={1}
                style={{
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '24px',
                  letterSpacing: '-0.02em',
                }}
              >
                Guides, resources, and support for{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  practitioners and clients.
                </span>
              </Title>
              <Paragraph
                style={{
                  fontSize: '18px',
                  color: '#64748b',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                Access how-to guides for the practitioner platform and client app, download clinical forms and onboarding documents, and find answers to common technical and platform questions.
              </Paragraph>
            </div>

            {/* Two-column layout: content + sidebar */}
            <div style={{ display: 'flex', gap: '64px', position: 'relative' }}>
              {/* Main content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    id={cat.slug}
                    ref={(el) => { sectionRefs.current[cat.slug] = el; }}
                    style={{ marginBottom: '56px' }}
                  >
                    <Title
                      level={2}
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '24px',
                      }}
                    >
                      {cat.name}
                    </Title>

                    {/* Direct articles under this category */}
                    {cat.articles.length > 0 && (
                      <ArticleList articles={cat.articles} />
                    )}

                    {/* Subcategories */}
                    {cat.subcategories.map((sub) => (
                      <div key={sub.id} style={{ marginBottom: '36px' }}>
                        <Title
                          level={4}
                          style={{
                            fontSize: '17px',
                            fontWeight: 600,
                            color: '#334155',
                            marginBottom: '16px',
                          }}
                        >
                          {sub.name}
                        </Title>
                        {sub.articles.length > 0 ? (
                          <ArticleList articles={sub.articles} />
                        ) : (
                          <Paragraph
                            style={{
                              fontSize: '15px',
                              color: '#94a3b8',
                              fontStyle: 'italic',
                            }}
                          >
                            Articles coming soon.
                          </Paragraph>
                        )}
                      </div>
                    ))}

                    {!hasContent(cat) && cat.subcategories.length === 0 && (
                      <Paragraph
                        style={{
                          fontSize: '15px',
                          color: '#94a3b8',
                          fontStyle: 'italic',
                        }}
                      >
                        Articles coming soon.
                      </Paragraph>
                    )}
                  </div>
                ))}
              </div>

              {/* Sidebar navigation */}
              <nav
                className="help-sidebar"
                style={{
                  width: '200px',
                  flexShrink: 0,
                  position: 'sticky',
                  top: '110px',
                  alignSelf: 'flex-start',
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    onClick={() => scrollToSection(cat.slug)}
                    style={{
                      padding: '8px 0',
                      fontSize: '15px',
                      fontWeight: activeCategory === cat.slug ? 600 : 400,
                      color: activeCategory === cat.slug ? '#48abe2' : '#64748b',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      borderLeft: activeCategory === cat.slug
                        ? '2px solid #48abe2'
                        : '2px solid transparent',
                      paddingLeft: '12px',
                    }}
                  >
                    {cat.name}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}
      </Content>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .help-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
    </ConfigProvider>
  );
};

/** Accordion list of articles — Flighty-style with + icon and dotted separators */
const ArticleList = ({ articles }: { articles: Article[] }) => (
  <Collapse
    bordered={false}
    expandIconPosition="start"
    expandIcon={({ isActive }) =>
      isActive ? (
        <MinusOutlined style={{ color: '#48abe2', fontSize: '14px' }} />
      ) : (
        <PlusOutlined style={{ color: '#48abe2', fontSize: '14px' }} />
      )
    }
    style={{ background: 'transparent' }}
  >
    {articles.map((article) => (
      <Collapse.Panel
        header={
          <span
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#0f172a',
            }}
          >
            {article.title}
          </span>
        }
        key={article.id}
        style={{
          border: 'none',
          borderBottom: '1px dashed #e2e8f0',
          borderRadius: 0,
          background: 'transparent',
        }}
      >
        {article.content ? (
          <div
            className="legal-content"
            style={{
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.8,
              paddingBottom: '8px',
            }}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
          </div>
        ) : (
          <Paragraph
            style={{
              fontSize: '15px',
              color: '#94a3b8',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            Guide content coming soon.
          </Paragraph>
        )}
      </Collapse.Panel>
    ))}
  </Collapse>
);

export default HelpCentre;
