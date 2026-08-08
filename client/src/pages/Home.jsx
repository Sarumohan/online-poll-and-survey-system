import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Share2, 
  PieChart, 
  FileSpreadsheet, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: 'var(--accent-primary)',
          fontSize: '0.88rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> Online Poll & Survey System
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
          fontWeight: '800',
          marginBottom: '1.25rem',
          lineHeight: '1.15'
        }}>
          Create, Distribute & Analyze Surveys with{' '}
          <span style={{
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Real-Time Intelligence
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          Build multi-question surveys with logic branching, rating scales, multiple-choice polls, and open text. Distribute instantly via shareable links or embedded forms, and export response analytics in CSV or PDF formats.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Objectives & Deliverables Overview Grid */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Project Deliverables & Objectives</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Everything you need for full-stack polling and survey management
          </p>
        </div>

        <div className="grid-2">
          {/* Objectives Card */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)'
              }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Platform Objectives</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Develop a web platform for creating, distributing, and analyzing polls and surveys online.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Support multiple question types including MCQ, rating scales, and open text.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Provide real-time result visualization and detailed response analytics.</span>
              </li>
            </ul>
          </div>

          {/* Deliverables Card */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(236, 72, 153, 0.15)',
                color: 'var(--accent-secondary)'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Core Deliverables</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Survey builder with multiple question types and logic branching.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Shareable survey links and embedded HTML form option.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Response collection dashboard with real-time charts and export options (CSV & PDF).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Powerful Survey Features</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Built for modern data collection and decision making</p>
        </div>

        <div className="grid-3">
          <div className="glass-card">
            <Sliders size={32} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Logic Branching Builder</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Customize question paths based on user answers for tailored, intelligent surveys.
            </p>
          </div>

          <div className="glass-card">
            <Share2 size={32} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant Distribution</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Share direct links or embed the survey iframe into your website seamlessly.
            </p>
          </div>

          <div className="glass-card">
            <PieChart size={32} color="#38bdf8" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Real-time Charts</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Visualize MCQ responses and rating scale distributions instantly with dynamic charts.
            </p>
          </div>

          <div className="glass-card">
            <FileSpreadsheet size={32} color="#34d399" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>CSV & PDF Export</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Download complete survey response data in CSV format or formatted PDF reports.
            </p>
          </div>

          <div className="glass-card">
            <BarChart3 size={32} color="#a855f7" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Multiple Question Types</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Mix MCQ options, 1-5 or 1-10 rating scales, and open-ended text questions.
            </p>
          </div>

          <div className="glass-card">
            <ShieldCheck size={32} color="#f43f5e" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>MongoDB Atlas Backend</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Secure JWT authentication, password hashing, and scalable cloud database integration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
