/**
 * HERO SECTION - WITH DEVICE MOCKUPS
 * Features: Phone with jAImee chat, Laptop with transcription, Video call screen
 */

import { Row, Col, Button, Typography, Space } from 'antd';
import { RocketOutlined, HeartOutlined, PlayCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // Phone chat animation states
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  // Laptop transcription animation states
  const [visibleTranscript, setVisibleTranscript] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Video call animation states
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Master animation timeline - staggered so nothing overlaps
  useEffect(() => {
    const animateAll = () => {
      // Reset everything
      setVisibleMessages(0);
      setIsTyping(false);
      setVisibleTranscript(0);
      setIsTranscribing(false);
      setVideoCallActive(false);
      setCallTime(0);

      const timeline = [
        // PHASE 1: Phone Chat (0-6s)
        { delay: 800, action: () => setVisibleMessages(1) },           // jAImee greeting
        { delay: 2500, action: () => setIsTyping(true) },              // User typing
        { delay: 3800, action: () => { setIsTyping(false); setVisibleMessages(2); } }, // User message
        { delay: 4800, action: () => setIsTyping(true) },              // jAImee typing
        { delay: 6200, action: () => { setIsTyping(false); setVisibleMessages(3); } }, // jAImee response
        
        // PHASE 2: Laptop Transcription (7-12s)
        { delay: 7500, action: () => setIsTranscribing(true) },        // Start transcribing
        { delay: 8000, action: () => setVisibleTranscript(1) },        // First line appears
        { delay: 9200, action: () => setVisibleTranscript(2) },        // Second line
        { delay: 10500, action: () => setVisibleTranscript(3) },       // Third line
        { delay: 11800, action: () => { setIsTranscribing(false); setVisibleTranscript(4); } }, // AI Summary
        
        // PHASE 3: Video Call (13-16s)
        { delay: 13000, action: () => setVideoCallActive(true) },      // Call starts
        { delay: 13000, action: () => {
          // Animate call timer
          let time = 0;
          const interval = setInterval(() => {
            time += 1;
            setCallTime(time);
            if (time >= 15) clearInterval(interval);
          }, 200);
        }},
        
        // Loop restart
        { delay: 18000, action: animateAll },
      ];

      timeline.forEach(({ delay, action }) => {
        setTimeout(action, delay);
      });
    };

    animateAll();
  }, []);

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient-shift 15s ease infinite',
      padding: '80px 20px 100px',
      color: '#ffffff',
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Floating Shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '2s',
      }} />

      <Row gutter={[48, 48]} align="middle" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Left Side - Content */}
        <Col xs={24} lg={11} style={{ order: 1 }}>
          <div className="reveal" style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            padding: '8px 20px',
            marginBottom: '25px',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeInUp 0.8s ease-out',
          }}>
            <HeartOutlined style={{ marginRight: '8px' }} />
            AI-Powered Mental Health Platform
          </div>

          <Title 
            level={1} 
            className="reveal"
            style={{ 
              color: '#ffffff', 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              marginBottom: '25px',
              lineHeight: 1.2,
              animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
            }}
          >
            Transform Mental Healthcare
            <br />
            <span style={{ opacity: 0.9 }}>
              With ANTSA
            </span>
          </Title>

          <Paragraph 
            className="reveal"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '30px',
              lineHeight: 1.8,
              animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
            }}
          >
            24/7 AI therapy support, automated transcription, and seamless video sessions. 
            Reduce admin time by 80% while enhancing client care.
          </Paragraph>

          <Space 
            className="reveal"
            size="large" 
            wrap
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.6s backwards',
            }}
          >
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              style={{
                height: '60px',
                padding: '0 40px',
                fontSize: '1.1rem',
                background: '#ffffff',
                color: '#48abe2',
                border: 'none',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              }}
            >
              Start Free Trial <ArrowRightOutlined />
            </Button>
            
            <Button
              size="large"
              icon={<PlayCircleOutlined />}
              style={{
                height: '60px',
                padding: '0 40px',
                fontSize: '1.1rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 600,
                borderRadius: '12px',
              }}
            >
              Watch Demo
            </Button>
          </Space>

          <div 
            className="reveal"
            style={{
              marginTop: '40px',
              display: 'flex',
              gap: '30px',
              flexWrap: 'wrap',
              animation: 'fadeInUp 0.8s ease-out 0.8s backwards',
            }}
          >
            {[
              { value: '500+', label: 'Clinicians' },
              { value: '10K+', label: 'Clients' },
              { value: '80%', label: 'Time Saved' },
            ].map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* Right Side - Device Mockups */}
        <Col xs={24} lg={13} style={{ order: 2 }}>
          <div className="reveal-right" style={{
            position: 'relative',
            animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
          }}>
            {/* Phone Mockup - jAImee Chat */}
            <div style={{
              position: 'absolute',
              left: '0',
              top: '20%',
              width: '280px',
              height: '550px',
              background: '#1a202c',
              borderRadius: '35px',
              padding: '12px',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
              transform: 'rotate(-5deg)',
              zIndex: 3,
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '25px',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Phone Notch */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '120px',
                  height: '25px',
                  background: '#1a202c',
                  borderRadius: '0 0 20px 20px',
                  zIndex: 10,
                }} />
                
                {/* Chat Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
                  padding: '35px 15px 15px',
                  color: '#ffffff',
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>jAImee</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>Your AI Therapist • Online</div>
                </div>

                {/* Chat Messages */}
                <div style={{
                  padding: '15px',
                  height: 'calc(100% - 140px)',
                  overflowY: 'auto',
                  background: '#f7fafc',
                }}>
                  {/* jAImee first message */}
                  {visibleMessages >= 1 && (
                    <div style={{ 
                      marginBottom: '15px',
                      animation: 'fadeInUp 0.5s ease-out',
                    }}>
                      <div style={{
                        background: '#ffffff',
                        padding: '10px 12px',
                        borderRadius: '12px 12px 12px 2px',
                        fontSize: '0.75rem',
                        maxWidth: '80%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        lineHeight: 1.4,
                      }}>
                        Hi! How are you feeling today? 😊
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096', marginTop: '4px' }}>
                        jAImee • 2:34 PM
                      </div>
                    </div>
                  )}

                  {/* User message */}
                  {visibleMessages >= 2 && (
                    <div style={{ 
                      marginBottom: '15px', 
                      textAlign: 'right',
                      animation: 'fadeInUp 0.5s ease-out',
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
                        padding: '10px 12px',
                        borderRadius: '12px 12px 2px 12px',
                        fontSize: '0.75rem',
                        maxWidth: '80%',
                        display: 'inline-block',
                        color: '#ffffff',
                        lineHeight: 1.4,
                      }}>
                        I've been practicing the breathing exercises you taught me!
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096', marginTop: '4px' }}>
                        You • 2:35 PM
                      </div>
                    </div>
                  )}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div style={{ 
                      marginBottom: '15px',
                      animation: 'fadeIn 0.3s ease-out',
                      textAlign: visibleMessages === 1 ? 'right' : 'left',
                    }}>
                      <div style={{
                        background: visibleMessages === 1 ? 'rgba(72, 171, 226, 0.1)' : '#ffffff',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        width: '60px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        display: 'inline-flex',
                        gap: '4px',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#48abe2',
                          animation: 'pulse 1.4s ease-in-out infinite',
                        }} />
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#48abe2',
                          animation: 'pulse 1.4s ease-in-out 0.2s infinite',
                        }} />
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#48abe2',
                          animation: 'pulse 1.4s ease-in-out 0.4s infinite',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* jAImee response */}
                  {visibleMessages >= 3 && (
                    <div style={{ 
                      marginBottom: '10px',
                      animation: 'fadeInUp 0.5s ease-out',
                    }}>
                      <div style={{
                        background: '#ffffff',
                        padding: '10px 12px',
                        borderRadius: '12px 12px 12px 2px',
                        fontSize: '0.75rem',
                        maxWidth: '80%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        lineHeight: 1.4,
                      }}>
                        That's wonderful! Building healthy habits takes time. How have they been helping you? 💪
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096', marginTop: '4px' }}>
                        jAImee • 2:35 PM
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  padding: '10px',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                }}>
                  <div style={{
                    background: '#f7fafc',
                    borderRadius: '20px',
                    padding: '8px 15px',
                    fontSize: '0.75rem',
                    color: '#718096',
                  }}>
                    Type a message...
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Mockup - AI Scribe Transcription */}
            <div style={{
              position: 'relative',
              marginLeft: 'auto',
              width: '550px',
              maxWidth: '100%',
            }}>
              {/* Screen */}
              <div style={{
                background: '#1a202c',
                borderRadius: '12px 12px 0 0',
                padding: '10px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  height: '350px',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {/* Transcription Header */}
                  <div style={{
                    background: '#f7fafc',
                    padding: '12px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a202c' }}>
                      AI Scribe • Session Transcript
                    </div>
                    <div style={{
                      background: isTranscribing ? '#10b981' : '#94a3b8',
                      color: '#ffffff',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}>
                      ● {isTranscribing ? 'Recording' : 'Ready'}
                    </div>
                  </div>

                  {/* Transcription Content */}
                  <div style={{
                    padding: '20px',
                    fontSize: '0.8rem',
                    lineHeight: 1.8,
                    color: '#4a5568',
                  }}>
                    {visibleTranscript >= 1 && (
                      <div style={{ 
                        marginBottom: '15px',
                        animation: 'fadeInUp 0.5s ease-out',
                      }}>
                        <strong style={{ color: '#48abe2' }}>[00:02:15]</strong> Client expresses feeling overwhelmed with work responsibilities. Reports difficulty sleeping for the past two weeks.
                      </div>
                    )}
                    {visibleTranscript >= 2 && (
                      <div style={{ 
                        marginBottom: '15px',
                        animation: 'fadeInUp 0.5s ease-out',
                      }}>
                        <strong style={{ color: '#2196f3' }}>[00:04:32]</strong> Discussed coping strategies including time management techniques and establishing a bedtime routine.
                      </div>
                    )}
                    {visibleTranscript >= 3 && (
                      <div style={{ 
                        marginBottom: '15px',
                        animation: 'fadeInUp 0.5s ease-out',
                      }}>
                        <strong style={{ color: '#48abe2' }}>[00:07:18]</strong> Client reports improvement in anxiety levels since implementing breathing exercises from last session.
                      </div>
                    )}
                    {isTranscribing && visibleTranscript < 3 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#48abe2',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}>
                        <span>●</span> Transcribing...
                      </div>
                    )}
                    {visibleTranscript >= 4 && (
                      <div style={{
                        marginTop: '20px',
                        padding: '12px',
                        background: '#f0fdf4',
                        borderRadius: '8px',
                        border: '1px solid #86efac',
                        animation: 'scaleIn 0.5s ease-out',
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', marginBottom: '5px' }}>
                          📝 AI Summary
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#4a5568' }}>
                          Session focused on work-related stress and sleep disturbances. Client showing positive response to previously assigned homework...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Laptop Base */}
              <div style={{
                height: '15px',
                background: 'linear-gradient(to bottom, #2d3748, #1a202c)',
                borderRadius: '0 0 12px 12px / 0 0 4px 4px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '5px',
                  background: '#1a202c',
                  borderRadius: '0 0 8px 8px',
                }} />
              </div>

              {/* Video Call Badge - Animated */}
              <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '-50px',
                width: '200px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '15px',
                boxShadow: videoCallActive 
                  ? '0 15px 40px rgba(72, 171, 226, 0.3), 0 0 0 3px rgba(72, 171, 226, 0.2)' 
                  : '0 15px 40px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.5s ease',
                opacity: videoCallActive ? 1 : 0.7,
              }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  color: '#1a202c', 
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  🎥 Video Session
                  {videoCallActive && (
                    <span style={{
                      fontSize: '0.6rem',
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}>
                      LIVE
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    flex: 1,
                    height: '60px',
                    background: videoCallActive 
                      ? 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)'
                      : '#e2e8f0',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.5s ease',
                  }}>
                    {videoCallActive && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        animation: 'shimmer 2s infinite',
                      }} />
                    )}
                    <div style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '5px',
                      fontSize: '0.6rem',
                      color: videoCallActive ? '#ffffff' : '#4a5568',
                      fontWeight: 600,
                      background: 'rgba(0,0,0,0.3)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>
                      You
                    </div>
                  </div>
                  <div style={{
                    width: '50px',
                    height: '60px',
                    background: videoCallActive ? '#94a3b8' : '#e2e8f0',
                    borderRadius: '8px',
                    position: 'relative',
                    transition: 'all 0.5s ease',
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '5px',
                      fontSize: '0.5rem',
                      color: '#4a5568',
                      fontWeight: 600,
                      background: 'rgba(255,255,255,0.9)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                    }}>
                      Client
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: videoCallActive ? '#10b981' : '#94a3b8',
                  fontWeight: 600,
                  transition: 'color 0.5s ease',
                }}>
                  ● {videoCallActive ? `${Math.floor(callTime / 60)}:${(callTime % 60).toString().padStart(2, '0')}` : '0:00'} elapsed
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSection;
