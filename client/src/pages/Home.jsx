import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Sparkles, 
  Sliders, 
  Share2, 
  PieChart, 
  FileSpreadsheet, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Vote,
  Layers,
  Code
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  // Interactive Live Demo Poll State
  const [demoVotes, setDemoVotes] = useState({
    'Customer Feedback': 42,
    'Market Research': 28,
    'Academic & Team Polls': 19,
    'Event RSVPs': 11,
  });
  const [selectedDemoOption, setSelectedDemoOption] = useState(null);
  const [hasVotedDemo, setHasVotedDemo] = useState(false);

  const handleDemoVote = (option) => {
    if (hasVotedDemo) return;
    setDemoVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
    setSelectedDemoOption(option);
    setHasVotedDemo(true);
  };

  const totalDemoVotes = Object.values(demoVotes).reduce((a, b) => a + b, 0);

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 4rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 1.1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: 'var(--accent-primary)',
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> Next-Gen Survey & Polling Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
          fontWeight: '800',
          marginBottom: '1.25rem',
          lineHeight: '1.15'
        }}>
          Create Beautiful Polls & Gather{' '}
          <span style={{
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Real-Time Insights
          </span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          Build interactive multi-question surveys with logic branching, rating scales, and open text. Distribute via shareable links or embedded forms, and export live response analytics in CSV and PDF.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In to Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Interactive Live Demo Poll Card */}
      <section style={{ maxWidth: '750px', margin: '0 auto 5rem' }}>
        <div className="glass-card" style={{ border: '1px solid rgba(99, 102, 241, 0.3)', position: 'relative' }}>
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Vote size={20} color="var(--accent-primary)" />
              <span style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                Live Interactive Demo Poll
              </span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {totalDemoVotes} responses collected
            </span>
          </div>

          <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>
            What is your primary goal for creating online polls & surveys?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.keys(demoVotes).map((option) => {
              const count = demoVotes[option];
              const percentage = Math.round((count / totalDemoVotes) * 100);
              const isSelected = selectedDemoOption === option;

              return (
                <div
                  key={option}
                  onClick={() => handleDemoVote(option)}
                  style={{
                    position: 'relative',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    background: 'var(--bg-input)',
                    cursor: hasVotedDemo ? 'default' : 'pointer',
                    overflow: 'hidden',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {/* Result Fill Bar */}
                  {hasVotedDemo && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: `${percentage}%`,
                      background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      transition: 'width 0.6s ease-out'
                    }} />
                  )}

                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: isSelected ? '600' : '400', fontSize: '0.98rem' }}>
                      {option} {isSelected && '✓'}
                    </span>
                    {hasVotedDemo && (
                      <span style={{ fontWeight: '700', color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                        {percentage}% ({count})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!hasVotedDemo && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              💡 Click an option above to cast a sample vote and see real-time chart updating!
            </p>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>How Pollify Works</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Three simple steps to collect actionable data from your audience
          </p>
        </div>

        <div className="grid-3">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Layers size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>1. Build Your Survey</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
              Add MCQ choices, 1-10 rating scales, and open text questions with custom logic branching.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(236, 72, 153, 0.15)',
              color: 'var(--accent-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Share2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>2. Share or Embed</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
              Distribute direct links or paste our ready-to-use HTML iframe snippet into your website.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <PieChart size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>3. Analyze & Export</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
              Watch live charts update in real-time and export complete datasets to CSV or PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Platform Features</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Built with modern web technologies for performance and scale</p>
        </div>

        <div className="grid-3">
          <div className="glass-card">
            <Sliders size={32} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Logic Branching</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Route respondents to specific questions based on their previous choices for dynamic survey paths.
            </p>
          </div>

          <div className="glass-card">
            <Code size={32} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1-Click Embed Snippet</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Generate ready-to-copy HTML `&lt;iframe&gt;` code to embed polls inside blogs or web apps.
            </p>
          </div>

          <div className="glass-card">
            <PieChart size={32} color="#38bdf8" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Interactive Visualizations</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Dynamic Chart.js bar and pie charts break down response percentages and rating averages.
            </p>
          </div>

          <div className="glass-card">
            <FileSpreadsheet size={32} color="#34d399" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>CSV & PDF Downloads</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Export full survey response tables to CSV or generate clean printable PDF analytics reports.
            </p>
          </div>

          <div className="glass-card">
            <BarChart3 size={32} color="#a855f7" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Multiple Question Formats</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Support Multiple Choice (MCQ), 1-5 or 1-10 Rating Scales, and open-ended Text entries.
            </p>
          </div>

          <div className="glass-card">
            <ShieldCheck size={32} color="#f43f5e" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>MongoDB Atlas Backend</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Cloud Mongoose database integration with JWT user auth and bcrypt password protection.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '3.5rem 2rem'
        }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Ready to Start Polling Your Audience?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Create your account today and launch your first survey with real-time response analytics.
          </p>
          <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary btn-lg">
            {user ? "Go to Dashboard" : "Create Free Account Now"} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
