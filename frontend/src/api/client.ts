/**
 * Type-safe API client for the Pollster API.
 */

import type { components } from './types';

// Type aliases for convenience
export type Poll = components['schemas']['Poll'];
export type Option = components['schemas']['Option'];
export type CreatePollRequest = components['schemas']['CreatePollRequest'];
export type VoteRequest = components['schemas']['VoteRequest'];
export type ErrorResponse = components['schemas']['ErrorResponse'];

const API_BASE = '/api';

/**
 * Get or create a session ID for vote tracking.
 */
export function getSessionId(): string {
  const key = 'pollster_session_id';
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

/**
 * Check if user has voted on a poll.
 */
export function hasVotedOnPoll(pollId: string): boolean {
  const votedPolls = JSON.parse(
    localStorage.getItem('pollster_voted_polls') || '[]'
  ) as string[];
  return votedPolls.includes(pollId);
}

/**
 * Mark a poll as voted.
 */
export function markPollAsVoted(pollId: string): void {
  const votedPolls = JSON.parse(
    localStorage.getItem('pollster_voted_polls') || '[]'
  ) as string[];
  if (!votedPolls.includes(pollId)) {
    votedPolls.push(pollId);
    localStorage.setItem('pollster_voted_polls', JSON.stringify(votedPolls));
  }
}

/**
 * API error with status code.
 */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * List all active polls.
 */
export async function listPolls(): Promise<Poll[]> {
  const response = await fetch(`${API_BASE}/polls`);
  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to fetch polls');
  }
  return response.json() as Promise<Poll[]>;
}

/**
 * Get a specific poll by ID.
 */
export async function getPoll(pollId: string): Promise<Poll> {
  const response = await fetch(`${API_BASE}/polls/${pollId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError(404, 'Poll not found');
    }
    throw new ApiError(response.status, 'Failed to fetch poll');
  }
  return response.json() as Promise<Poll>;
}

/**
 * Create a new poll.
 */
export async function createPoll(request: CreatePollRequest): Promise<Poll> {
  const response = await fetch(`${API_BASE}/polls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw new ApiError(
      response.status,
      error.detail || 'Failed to create poll'
    );
  }
  return response.json() as Promise<Poll>;
}

/**
 * Cast a vote on a poll.
 */
export async function castVote(
  pollId: string,
  optionId: string
): Promise<Poll> {
  const response = await fetch(`${API_BASE}/polls/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': getSessionId(),
    },
    body: JSON.stringify({ option_id: optionId }),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError(404, 'Poll not found');
    }
    if (response.status === 400) {
      throw new ApiError(400, 'Invalid option');
    }
    if (response.status === 409) {
      throw new ApiError(409, 'Already voted on this poll');
    }
    throw new ApiError(response.status, 'Failed to cast vote');
  }
  markPollAsVoted(pollId);
  return response.json() as Promise<Poll>;
}
