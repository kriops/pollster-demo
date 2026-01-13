import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getPoll,
  castVote,
  hasVotedOnPoll,
  type Poll,
  ApiError,
} from '../api/client';
import './PollDetail.css';

export function PollDetail() {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    async function fetchPoll() {
      if (!id) {
        setError('Invalid poll ID');
        setLoading(false);
        return;
      }

      try {
        const data = await getPoll(id);
        setPoll(data);
        setHasVoted(hasVotedOnPoll(id));
        setError(null);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('Poll not found');
        } else {
          setError('Failed to load poll');
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchPoll();
  }, [id]);

  const handleVote = async (optionId: string) => {
    if (!id || voting || hasVoted) return;

    setVoting(true);
    try {
      const updatedPoll = await castVote(id, optionId);
      setPoll(updatedPoll);
      setHasVoted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setHasVoted(true);
        }
        setError(err.message);
      }
    } finally {
      setVoting(false);
    }
  };

  const getTotalVotes = (): number => {
    if (!poll) return 0;
    return poll.options.reduce((sum, opt) => sum + opt.vote_count, 0);
  };

  const getPercentage = (voteCount: number): number => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((voteCount / total) * 100);
  };

  if (loading) {
    return <div className="poll-detail-loading">Loading poll...</div>;
  }

  if (error === 'Poll not found') {
    return (
      <div className="poll-detail-not-found">
        <h2>Poll Not Found</h2>
        <p>The poll you're looking for doesn't exist.</p>
        <Link to="/" className="back-link">
          Back to polls
        </Link>
      </div>
    );
  }

  if (error) {
    return <div className="poll-detail-error">Error: {error}</div>;
  }

  if (!poll) {
    return null;
  }

  const totalVotes = getTotalVotes();

  return (
    <div className="poll-detail">
      <Link to="/" className="back-link">
        ← Back to polls
      </Link>

      <h2 className="poll-question">{poll.question}</h2>

      <div className="poll-stats">
        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
      </div>

      <div className="poll-options">
        {poll.options.map((option) => {
          const percentage = getPercentage(option.vote_count);
          return (
            <div key={option.id} className="poll-option">
              <div className="option-header">
                <span className="option-text">{option.text}</span>
                <span className="option-percentage">{percentage}%</span>
              </div>
              <div className="option-bar-container">
                <div
                  className="option-bar"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="option-footer">
                <span className="option-votes">
                  {option.vote_count}{' '}
                  {option.vote_count === 1 ? 'vote' : 'votes'}
                </span>
                {!hasVoted && (
                  <button
                    className="vote-button"
                    onClick={() => void handleVote(option.id)}
                    disabled={voting}
                  >
                    {voting ? 'Voting...' : 'Vote'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="voted-message">
          You have already voted on this poll.
        </div>
      )}
    </div>
  );
}
