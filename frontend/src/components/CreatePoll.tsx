import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPoll, ApiError } from '../api/client';
import './CreatePoll.css';

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;

export function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    setError(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setError(null);
  };

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > MIN_OPTIONS) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const validateForm = (): string | null => {
    if (!question.trim()) {
      return 'Please enter a question';
    }
    if (question.length > 500) {
      return 'Question must be 500 characters or less';
    }

    const filledOptions = options.filter((opt) => opt.trim());
    if (filledOptions.length < MIN_OPTIONS) {
      return `Please enter at least ${MIN_OPTIONS} options`;
    }

    for (const opt of options) {
      if (opt.trim() && opt.length > 200) {
        return 'Each option must be 200 characters or less';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const filledOptions = options.filter((opt) => opt.trim());
      const poll = await createPoll({
        question: question.trim(),
        options: filledOptions.map((opt) => opt.trim()),
      });
      navigate(`/polls/${poll.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create poll');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-poll">
      <Link to="/" className="back-link">
        ← Back to polls
      </Link>

      <h2>Create a New Poll</h2>

      <form onSubmit={(e) => void handleSubmit(e)} className="poll-form">
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={handleQuestionChange}
            placeholder="What would you like to ask?"
            maxLength={500}
          />
          <span className="char-count">{question.length}/500</span>
        </div>

        <div className="form-group">
          <label>Options</label>
          <div className="options-list">
            {options.map((option, index) => (
              <div key={index} className="option-input-row">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  maxLength={200}
                />
                {options.length > MIN_OPTIONS && (
                  <button
                    type="button"
                    className="remove-option-btn"
                    onClick={() => removeOption(index)}
                    aria-label={`Remove option ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              className="add-option-btn"
              onClick={addOption}
            >
              + Add Option
            </button>
          )}

          <span className="option-count">
            {options.length}/{MAX_OPTIONS} options
          </span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}
