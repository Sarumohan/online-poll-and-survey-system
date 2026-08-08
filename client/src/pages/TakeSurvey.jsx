import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { 
  CheckCircle2, 
  Star, 
  Send, 
  AlertCircle, 
  HelpCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const TakeSurvey = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Logic Branching Step Navigation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const data = await api.getSurveyById(id);
        setSurvey(data);
      } catch (err) {
        setError(err.message || 'Survey not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSurvey();
  }, [id]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNextStep = () => {
    const currentQ = survey.questions[currentQuestionIndex];
    
    // Check validation if required
    if (currentQ.isRequired && (!answers[currentQ._id] || String(answers[currentQ._id]).trim() === '')) {
      alert('Please answer this required question before continuing.');
      return;
    }

    // Logic branching check for MCQ option selection
    let nextIndex = currentQuestionIndex + 1;
    if (currentQ.questionType === 'mcq' && answers[currentQ._id]) {
      const selectedOpt = currentQ.options.find((opt) => opt.optionText === answers[currentQ._id]);
      if (selectedOpt && selectedOpt.nextQuestionIndex !== null && selectedOpt.nextQuestionIndex !== undefined) {
        nextIndex = selectedOpt.nextQuestionIndex;
      }
    }

    if (nextIndex >= survey.questions.length) {
      // Reached end of survey steps, trigger submission
      handleSubmitResponse();
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handleSubmitResponse = async () => {
    const formattedAnswers = survey.questions.map((q) => ({
      questionId: q._id,
      questionType: q.questionType,
      answerValue: answers[q._id] !== undefined ? answers[q._id] : '',
    }));

    try {
      setSubmitting(true);
      setError('');
      await api.submitResponse({
        surveyId: survey._id,
        answers: formattedAnswers,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit survey answers.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-narrow" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading survey...</p>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="container-narrow" style={{ paddingTop: '5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <AlertCircle size={48} color="#f87171" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Survey Unavailable</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {error || 'This survey does not exist or has been removed.'}
          </p>
        </div>
      </div>
    );
  }

  if (survey.status === 'closed') {
    return (
      <div className="container-narrow" style={{ paddingTop: '5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircle2 size={48} color="var(--status-closed-color)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Survey Closed</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Thank you for your interest. This survey is no longer accepting new responses.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container-narrow" style={{ paddingTop: '5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--status-active-color)',
            marginBottom: '1.25rem'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Thank You!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Your response has been recorded successfully. We appreciate your valuable feedback!
          </p>
        </div>
      </div>
    );
  }

  const currentQ = survey.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= survey.questions.length - 1;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / survey.questions.length) * 100);

  return (
    <div className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="glass-card">
        {/* Survey Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{survey.title}</h1>
          {survey.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {survey.description}
            </p>
          )}

          {/* Progress Bar */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Question {currentQuestionIndex + 1} of {survey.questions.length}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>

        {/* Current Question Rendering */}
        {currentQ && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                {currentQ.questionText}
                {currentQ.isRequired && <span style={{ color: '#f87171', marginLeft: '0.25rem' }}>*</span>}
              </h3>
            </div>

            {/* MCQ Answer Input */}
            {currentQ.questionType === 'mcq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentQ._id] === option.optionText;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleAnswerChange(currentQ._id, option.optionText)}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: isSelected ? '600' : '400' }}>
                        {option.optionText}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Rating Scale Answer Input */}
            {currentQ.questionType === 'rating' && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Array.from({ length: currentQ.maxRating || 5 }, (_, i) => i + 1).map((starNum) => {
                    const isSelected = answers[currentQ._id] === starNum;
                    return (
                      <button
                        type="button"
                        key={starNum}
                        onClick={() => handleAnswerChange(currentQ._id, starNum)}
                        style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                          background: isSelected ? 'var(--accent-gradient)' : 'var(--bg-input)',
                          color: isSelected ? '#ffffff' : 'var(--text-primary)',
                          fontWeight: '700',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.2rem',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        {starNum} <Star size={14} fill={isSelected ? '#ffffff' : 'none'} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Open Text Response Input */}
            {currentQ.questionType === 'text' && (
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <textarea
                  rows={4}
                  value={answers[currentQ._id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                  placeholder="Enter your response here"
                  className="form-textarea"
                  required={currentQ.isRequired}
                />
              </div>
            )}

            {/* Step Navigation Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {currentQuestionIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="btn btn-secondary"
                >
                  <ArrowLeft size={18} /> Previous
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? (
                  <div className="spinner" />
                ) : isLastQuestion ? (
                  <>
                    Submit Response <Send size={18} />
                  </>
                ) : (
                  <>
                    Next Question <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeSurvey;
