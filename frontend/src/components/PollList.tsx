import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPolls, type Poll, ApiError } from '../api/client';
import './PollList.css';

export function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const data = await listPolls();
        setPolls(data);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load polls');
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchPolls();
  }, []);

  if (loading) {
    return <div className="poll-list-loading">Loading polls...</div>;
  }

  if (error) {
    return <div className="poll-list-error">Error: {error}</div>;
  }

  if (polls.length === 0) {
    return (
      <div className="poll-list-empty">
        <p>No polls yet.</p>
        <Link to="/create" className="create-poll-link">
          Create the first poll
        </Link>
      </div>
    );
  }

  return (
    <div className="poll-list">
      <h2>Active Polls</h2>
      <ul className="poll-items">
        {polls.map((poll) => (
          <li key={poll.id} className="poll-item">
            <Link to={`/polls/${poll.id}`} className="poll-link">
              <h3 className="poll-question">{poll.question}</h3>
              <span className="poll-option-count">
                {poll.options.length} options
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
