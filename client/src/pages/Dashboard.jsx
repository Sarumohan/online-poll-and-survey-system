import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import EmbedModal from '../components/EmbedModal';
import { 
  PlusCircle, 
  BarChart2, 
  Share2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink, 
  FileText, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Embed Modal State
  const [activeEmbedModal, setActiveEmbedModal] = useState({ isOpen: false, surveyId: '', title: '' });

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const data = await api.getMySurveys();
      setSurveys(data);
    } catch (err) {
      setError(err.message || 'Failed to load surveys.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleToggleStatus = async (surveyId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await api.updateSurveyStatus(surveyId, nextStatus);
      fetchSurveys();
    } catch (err) {
      alert(err.message || 'Failed to update survey status.');
    }
  };

  const handleDeleteSurvey = async (surveyId, surveyTitle) => {
    if (window.confirm(`Are you sure you want to delete "${surveyTitle}"? All responses will be deleted permanently.`)) {
      try {
        await api.deleteSurvey(surveyId);
        fetchSurveys();
      } catch (err) {
        alert(err.message || 'Failed to delete survey.');
      }
    }
  };

  const totalSurveys = surveys.length;
  const activeSurveys = surveys.filter((s) => s.status === 'active').length;
  const totalResponses = surveys.reduce((acc, curr) => acc + (curr.responseCount || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Survey Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your polls, share embedded forms, and view real-time response analytics.
          </p>
        </div>
        <Link to="/builder" className="btn btn-primary btn-lg">
          <PlusCircle size={20} /> Create New Survey
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--accent-primary)'
          }}>
            <FileText size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Surveys Created</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{totalSurveys}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--status-active-color)'
          }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Surveys</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{activeSurveys}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(236, 72, 153, 0.15)',
            color: 'var(--accent-secondary)'
          }}>
            <Users size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Responses Collected</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{totalResponses}</div>
          </div>
        </div>
      </div>

      {/* Survey List Section */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Created Surveys</h2>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading your surveys...</p>
        </div>
      ) : surveys.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Surveys Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You haven't created any polls or surveys yet. Click below to build your first one!
          </p>
          <Link to="/builder" className="btn btn-primary">
            <PlusCircle size={18} /> Create First Survey
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {surveys.map((survey) => (
            <div
              key={survey._id}
              className="glass-card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                padding: '1.5rem 2rem'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{survey.title}</h3>
                  <span className={`badge ${survey.status === 'active' ? 'badge-active' : 'badge-closed'}`}>
                    {survey.status}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                  {survey.description || 'No description provided.'}
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Users size={14} /> {survey.responseCount} response{survey.responseCount !== 1 ? 's' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={14} /> {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} /> Created {new Date(survey.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <Link to={`/analytics/${survey._id}`} className="btn btn-primary btn-sm">
                  <BarChart2 size={16} /> Analytics
                </Link>

                <button
                  onClick={() => setActiveEmbedModal({ isOpen: true, surveyId: survey._id, title: survey.title })}
                  className="btn btn-secondary btn-sm"
                  title="Share Link & Embed Code"
                >
                  <Share2 size={16} /> Share & Embed
                </button>

                <Link
                  to={`/survey/${survey._id}`}
                  target="_blank"
                  className="btn btn-secondary btn-sm"
                  title="Open Public Survey Page"
                >
                  <ExternalLink size={16} /> View Form
                </Link>

                <button
                  onClick={() => handleToggleStatus(survey._id, survey.status)}
                  className="btn btn-secondary btn-sm"
                  title="Toggle Survey Active/Closed Status"
                >
                  {survey.status === 'active' ? <ToggleRight size={16} color="var(--status-active-color)" /> : <ToggleLeft size={16} color="var(--status-closed-color)" />}
                  {survey.status === 'active' ? 'Active' : 'Closed'}
                </button>

                <button
                  onClick={() => handleDeleteSurvey(survey._id, survey.title)}
                  className="btn btn-danger btn-sm"
                  title="Delete Survey"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share & Embed Code Modal */}
      <EmbedModal
        surveyId={activeEmbedModal.surveyId}
        surveyTitle={activeEmbedModal.title}
        isOpen={activeEmbedModal.isOpen}
        onClose={() => setActiveEmbedModal({ isOpen: false, surveyId: '', title: '' })}
      />
    </div>
  );
};

export default Dashboard;
