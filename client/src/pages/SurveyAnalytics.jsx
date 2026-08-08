import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  BarChart2, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  ArrowLeft, 
  Users, 
  Star, 
  MessageSquare, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// Chart.js imports & registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SurveyAnalytics = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportingPdf, setExportingPdf] = useState(false);

  const reportRef = useRef(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getSurveyAnalytics(surveyId);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to load survey analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (surveyId) fetchAnalytics();
  }, [surveyId]);

  // Export to CSV Functionality
  const exportToCSV = async () => {
    try {
      const responseData = await api.getSurveyResponses(surveyId);
      const { survey, responses } = responseData;

      if (!responses || responses.length === 0) {
        alert('No response data available to export.');
        return;
      }

      // Build CSV Headers
      const headers = ['Response ID', 'Submitted At', ...survey.questions.map((q) => `"${q.questionText.replace(/"/g, '""')}"`)];
      
      const rows = responses.map((resp) => {
        const row = [
          resp._id,
          new Date(resp.submittedAt).toISOString(),
          ...survey.questions.map((q) => {
            const ans = resp.answers.find((a) => a.questionId.toString() === q._id.toString());
            const val = ans ? ans.answerValue : '';
            return `"${String(val).replace(/"/g, '""')}"`;
          }),
        ];
        return row.join(',');
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${survey.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message || 'Failed to export CSV.');
    }
  };

  // Export to PDF Functionality
  const exportToPDF = async () => {
    if (!reportRef.current) return;
    try {
      setExportingPdf(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0b0f19',
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${analytics.survey.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analytics.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF report.');
    } finally {
      setExportingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="container-narrow" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Aggregating real-time response analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="container-narrow" style={{ paddingTop: '5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <AlertCircle size={48} color="#f87171" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Analytics Unavailable</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Top Header Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={fetchAnalytics} className="btn btn-secondary btn-sm" title="Refresh Data">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={exportToCSV} className="btn btn-secondary btn-sm" style={{ color: '#34d399' }}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button onClick={exportToPDF} disabled={exportingPdf} className="btn btn-primary btn-sm">
            {exportingPdf ? <div className="spinner" /> : <Download size={16} />}
            {exportingPdf ? 'Exporting PDF...' : 'Export PDF Report'}
          </button>
        </div>
      </div>

      {/* Analytics Printable Report Container */}
      <div ref={reportRef} style={{ padding: '0.5rem' }}>
        {/* Survey Banner Summary */}
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <h1 style={{ fontSize: '2rem' }}>{analytics.survey.title}</h1>
                <span className={`badge ${analytics.survey.status === 'active' ? 'badge-active' : 'badge-closed'}`}>
                  {analytics.survey.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {analytics.survey.description || 'No description provided.'}
              </p>
            </div>

            <div style={{
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} color="var(--accent-primary)" /> Total Responses
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                {analytics.totalResponses}
              </div>
            </div>
          </div>
        </div>

        {/* Question by Question Visual Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {analytics.questionAnalytics.map((q, index) => (
            <div key={q.questionId} className="glass-card">
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Question {index + 1} &bull; {q.questionType.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.3rem', marginTop: '0.2rem' }}>{q.questionText}</h3>
              </div>

              {/* MCQ Chart */}
              {q.questionType === 'mcq' && (
                <div>
                  <div style={{ maxHeight: '320px', marginBottom: '1.5rem' }}>
                    <Bar
                      data={{
                        labels: q.breakdown.map((b) => b.optionText),
                        datasets: [
                          {
                            label: 'Response Count',
                            data: q.breakdown.map((b) => b.count),
                            backgroundColor: 'rgba(99, 102, 241, 0.65)',
                            borderColor: '#6366f1',
                            borderWidth: 1,
                            borderRadius: 6,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: { precision: 0, color: '#9ca3af' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                          },
                          x: {
                            ticks: { color: '#9ca3af' },
                            grid: { display: false },
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="grid-2">
                    {q.breakdown.map((b, idx) => (
                      <div key={idx} style={{
                        background: 'var(--bg-input)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: '500' }}>{b.optionText}</span>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>
                          {b.count} ({b.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Chart */}
              {q.questionType === 'rating' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      background: 'rgba(236, 72, 153, 0.15)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}>
                      <Star size={24} color="var(--accent-secondary)" fill="var(--accent-secondary)" />
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Average Score</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>
                          {q.averageRating} / {q.maxRating}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ maxHeight: '300px', marginBottom: '1.5rem' }}>
                    <Bar
                      data={{
                        labels: q.breakdown.map((b) => `${b.ratingScore} Star`),
                        datasets: [
                          {
                            label: 'Votes',
                            data: q.breakdown.map((b) => b.count),
                            backgroundColor: 'rgba(236, 72, 153, 0.65)',
                            borderColor: '#ec4899',
                            borderWidth: 1,
                            borderRadius: 6,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: { precision: 0, color: '#9ca3af' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                          },
                          x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Open Text Responses List */}
              {q.questionType === 'text' && (
                <div>
                  {q.responses.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No text responses submitted yet for this question.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {q.responses.map((respItem, rIdx) => (
                        <div key={rIdx} style={{
                          background: 'var(--bg-input)',
                          padding: '1rem',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '3px solid var(--accent-secondary)'
                        }}>
                          <p style={{ fontSize: '0.95rem', marginBottom: '0.4rem', fontStyle: 'italic' }}>
                            "{respItem.text}"
                          </p>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Submitted {new Date(respItem.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalytics;
