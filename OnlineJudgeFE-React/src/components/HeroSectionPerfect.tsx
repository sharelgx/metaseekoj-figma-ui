import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Sparkles, Code, Brain, Zap, Rocket } from "lucide-react";
import { motion } from "motion/react";
import tokens from '../design-tokens';
import axios from 'axios';
import { FigmaContainer } from './FigmaContainer'; // 8080精确容器

interface Statistics {
  user_count?: number;
  problem_count?: number;
  submission_count?: number;
}

export function HeroSectionPerfect() {
  const [statistics, setStatistics] = useState<Statistics>({});

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await axios.get('/website/');
      if (response.data.data) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  };

  // Hero统计数据（精确匹配8080截图）
  const heroStats = [
    { 
      number: statistics.user_count ? `${(statistics.user_count / 1000).toFixed(1)}K+` : '10,000+', 
      label: '在线学员' 
    },
    { 
      number: '8+', 
      label: '岁青少年'  // 8080截图显示的是"8+"
    },
    { 
      number: '98%', 
      label: '满意度' 
    }
  ];

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '128px', // pt-32 = 8rem (8080精确值)
        paddingBottom: '80px', // pb-20 = 5rem (8080精确值)
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #F5F7FA 0%, #ffffff 50%, #F5F7FA 100%)', // 8080精确渐变
      }}
    >
      {/* 浮动背景元素 - 完整4个装饰（与8080一致） */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Float Element 1 - 左上角蓝色代码 */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '80px',
            left: '40px',
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            background: 'rgba(61, 186, 251, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Code style={{ width: '32px', height: '32px', color: tokens.colors.blue }} />
        </motion.div>

        {/* Float Element 2 - 右上角橙色星星 */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '160px',
            right: '80px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 167, 38, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles style={{ width: '24px', height: '24px', color: tokens.colors.orange }} />
        </motion.div>

        {/* Float Element 3 - 左下角紫色Brain */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '25%',
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'rgba(196, 156, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Brain style={{ width: '28px', height: '28px', color: tokens.colors.purple }} />
        </motion.div>

        {/* Float Element 4 - 右侧绿色闪电 */}
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '33.33%',
            right: '25%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(142, 209, 169, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap style={{ width: '20px', height: '20px', color: tokens.colors.green }} />
        </motion.div>
      </div>

      {/* 主内容区 - 使用FigmaContainer (8080精确容器) */}
      <FigmaContainer>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px', // gap-12 = 3rem (8080精确值)
          alignItems: 'center',
        }} className="lg:grid-cols-2">
          {/* 左侧内容 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.heroContentGap,
              gap: '24px', // 8080精确值
            }}
          >
            {/* AI徽章（8080有） */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(61, 186, 251, 0.1)',
                border: '1px solid rgba(61, 186, 251, 0.2)',
                width: 'fit-content',
              }}
            >
              <Sparkles style={{ width: '16px', height: '16px', color: tokens.colors.blue }} />
              <span style={{ fontSize: '14px', color: tokens.colors.blue }}>
                AI 智能辅助学习
              </span>
            </div>

            {/* 主标题 */}
            <h1
              style={{
                fontSize: tokens.typography.heroTitle.fontSize.lg,
                lineHeight: tokens.typography.heroTitle.lineHeight,
                fontWeight: tokens.typography.heroTitle.fontWeight,
                margin: 0,
                color: '#495060', // 🔴 8080精确颜色：iView默认文字色
              }}
              className="text-4xl md:text-5xl"
            >
              用 AI 助你
              <br />
              <span
                style={{
                  background: tokens.colors.gradients.titleMulti,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                闯编程关卡！
              </span>
            </h1>

            {/* 副标题 */}
            <p
              style={{
                fontSize: tokens.typography.heroDescription.fontSize,
                lineHeight: tokens.typography.heroDescription.lineHeight,
                color: tokens.typography.heroDescription.color,
                maxWidth: tokens.typography.heroDescription.maxWidth,
                margin: 0,
              }}
            >
              自动题库＋智能错题本，让每一次挑战都更聪明。
              为 8-15 岁青少年打造的趣味编程学习平台。
            </p>

            {/* 按钮组 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <button
                onClick={() => window.location.href = '/problem'}
                style={{
                  height: '44px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  background: 'linear-gradient(90deg, #3DBAFB, #8ED1A9)', // 🔴 8080精确渐变
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: 'auto',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(61, 186, 251, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                立即挑战
                <Sparkles style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => window.location.href = '/about'}
                style={{
                  height: '44px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  background: 'white',
                  color: '#333', // 🔴 8080精确颜色
                  border: '1px solid #e5e5e5',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  width: 'auto',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#3DBAFB';
                  e.currentTarget.style.color = '#3DBAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.color = '#333';
                }}
              >
                了解更多
              </button>
            </div>

            {/* 统计数据行 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', paddingTop: '32px' }}>
              {heroStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div
                    style={{
                      fontSize: tokens.typography.statNumber.fontSize,
                      fontWeight: tokens.typography.statNumber.fontWeight,
                      color: tokens.typography.statNumber.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.number}
                  </div>
                  <div
                    style={{
                      fontSize: tokens.typography.statLabel.fontSize,
                      color: tokens.typography.statLabel.color,
                      marginTop: '4px',
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 右侧图片 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'relative', overflow: 'visible' }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: tokens.effects.radius['3xl'],
                  overflow: 'hidden',
                  boxShadow: tokens.effects.cardShadow['2xl'],
                }}
              >
                <img
                  src="/static/images/hero-learning.jpg"
                  alt="孩子们学习编程"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  onLoad={() => console.log('✅ Hero图片加载成功')}
                  onError={(e) => {
                    console.error('❌ Hero图片加载失败，尝试降级');
                    const target = e.currentTarget;
                    if (target.src.includes('/static/')) {
                      target.src = 'http://localhost:8080/static/images/hero-learning.jpg';
                    } else if (target.src.includes('localhost:8080')) {
                      target.src = 'https://cdn.pixabay.com/photo/2017/08/06/12/52/children-2594747_1280.jpg';
                    }
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(61, 186, 251, 0.2), transparent)',
                  }}
                />
              </div>

              {/* AI助手浮动卡片 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  bottom: '-24px',
                  left: '-24px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: tokens.effects.cardShadow.xl,
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  border: '1px solid #f5f5f5',
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, ' + tokens.colors.orange + ', rgba(255, 167, 38, 0.7))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Brain style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: tokens.colors.text[500] }}>AI 智能助手</div>
                  <div style={{ fontSize: '15px', color: tokens.colors.blue, fontWeight: 500 }}>24/7 在线指导</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </FigmaContainer>
    </section>
  );
}

