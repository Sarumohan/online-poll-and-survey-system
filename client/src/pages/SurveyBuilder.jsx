import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Sliders, 
  HelpCircle, 
  CheckSquare, 
  Star, 
  AlignLeft,
  AlertCircle
} from 'lucide-react';

const SurveyBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      questionType: 'mcq',
      options: [
        { optionText: '', nextQuestionIndex: null },
        { optionText: '', nextQuestionIndex: null },
      ],
      maxRating: 5,
      isRequired: true,
    },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Add Question
  const handleAddQuestion = (type = 'mcq') => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: type,
        options: [
          { optionText: '', nextQuestionIndex: null },
          { optionText: '', nextQuestionIndex: null },
        ],
        maxRating: 5,
        isRequired: true,
      },
    ]);
  };

  // Remove Question
  const handleRemoveQuestion = (qIndex) => {
    if (questions.length === 1) {
      alert('Survey must contain at least one question.');
      return;
    }
    const updated = questions.filter((_, idx) => idx !== qIndex);
    setQuestions(updated);
  };

  // Update Question Field
  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  // Add MCQ Option
  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ optionText: '', nextQuestionIndex: null });
    setQuestions(updated);
  };

  // Remove MCQ Option
  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) {
      alert('Multiple choice questions require at least 2 options.');
      return;
    }
    updated[qIndex].options = updated[qIndex].options.filter((_, idx) => idx !== oIndex);
    setQuestions(updated);
  };

  // Update Option Text or Logic Branching
  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex][field] = value;
    setQuestions(updated);
  };

  // Submit Survey
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a survey title.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is empty. Please enter question text.`);
        return;
      }
      if (q.questionType === 'mcq') {
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].optionText.trim()) {
            setError(`Question ${i + 1}, Option ${j + 1} text is empty. Please enter option text.`);
            return;
          }
        }
      }
    }

    try {
      setLoading(true);
      setError('');
      await api.createSurvey({
        title,
        description,
        questions,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save survey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <button
        onClick={() => navigate('/dashboard')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Survey Builder</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Build custom surveys with MCQ, Rating scales, and logic branching rules.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Survey General Info Card */}
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>General Information</h3>

          <div className="form-group">
            <label className="form-label">Survey Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter survey title"
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter survey description"
              className="form-textarea"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Questions ({questions.length})</h3>
          </div>

          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="glass-card"
              style={{ marginBottom: '1.5rem', position: 'relative', borderLeft: '4px solid var(--accent-primary)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--accent-primary)' }}>
                  Question {qIndex + 1}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={question.isRequired}
                      onChange={(e) => handleQuestionChange(qIndex, 'isRequired', e.target.checked)}
                    />
                    Required Question
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="btn btn-danger btn-sm"
                    title="Remove Question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="form-group">
                <label className="form-label">Question Text *</label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  placeholder="Enter question text"
                  className="form-input"
                  required
                />
              </div>

              {/* Question Type Selector */}
              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select
                  value={question.questionType}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                  className="form-select"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="rating">Rating Scale</option>
                  <option value="text">Open Text Response</option>
                </select>
              </div>

              {/* MCQ Options Rendering & Logic Branching */}
              {question.questionType === 'mcq' && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <label className="form-label">Multiple Choice Options & Logic Branching</label>

                  {question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.6rem',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionText', e.target.value)}
                        placeholder="Enter option text"
                        className="form-input"
                        style={{ flex: 2, minWidth: '180px' }}
                        required
                      />

                      {/* Logic Branching Dropdown */}
                      <select
                        value={option.nextQuestionIndex !== null ? option.nextQuestionIndex : ''}
                        onChange={(e) =>
                          handleOptionChange(
                            qIndex,
                            oIndex,
                            'nextQuestionIndex',
                            e.target.value !== '' ? Number(e.target.value) : null
                          )
                        }
                        className="form-select"
                        style={{ flex: 1.5, minWidth: '160px', fontSize: '0.85rem' }}
                        title="If selected, jump directly to question"
                      >
                        <option value="">Next Sequential Question</option>
                        {questions.map((_, targetIdx) => (
                          <option key={targetIdx} value={targetIdx}>
                            Jump to Q{targetIdx + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.6rem' }}
                      >
                        <Trash2 size={16} color="#f87171" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddOption(qIndex)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <PlusCircle size={16} /> Add Option
                  </button>
                </div>
              )}

              {/* Rating Scale Configuration */}
              {question.questionType === 'rating' && (
                <div style={{ marginTop: '1rem' }}>
                  <label className="form-label">Maximum Rating Scale</label>
                  <select
                    value={question.maxRating || 5}
                    onChange={(e) => handleQuestionChange(qIndex, 'maxRating', Number(e.target.value))}
                    className="form-select"
                    style={{ maxWidth: '200px' }}
                  >
                    <option value={5}>1 to 5 Stars</option>
                    <option value={10}>1 to 10 Scale</option>
                  </select>
                </div>
              )}

              {/* Open Text Information */}
              {question.questionType === 'text' && (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Respondents will provide an open text entry answer.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add Question Buttons Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <button
            type="button"
            onClick={() => handleAddQuestion('mcq')}
            className="btn btn-secondary"
          >
            <CheckSquare size={18} /> Add MCQ Question
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion('rating')}
            className="btn btn-secondary"
          >
            <Star size={18} /> Add Rating Question
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion('text')}
            className="btn btn-secondary"
          >
            <AlignLeft size={18} /> Add Text Question
          </button>
        </div>

        {/* Form Action Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
        >
          {loading ? <div className="spinner" /> : (
            <>
              <Save size={20} /> Save & Publish Survey
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SurveyBuilder;
