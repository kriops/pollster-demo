"""Pollster Backend API."""

from datetime import UTC, datetime
from uuid import UUID, uuid4

from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    CreatePollRequest,
    Option,
    Poll,
    VoteRequest,
)

app = FastAPI(
    title="Pollster API",
    description="Real-time poll application backend",
    version="0.1.0",
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
polls: dict[UUID, Poll] = {}
voted_sessions: set[tuple[UUID, str]] = set()


@app.get("/health")
def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/api/polls")
def list_polls() -> list[Poll]:
    """List all active polls."""
    return [poll for poll in polls.values() if poll.is_active]


@app.post("/api/polls", status_code=status.HTTP_201_CREATED)
def create_poll(request: CreatePollRequest) -> Poll:
    """Create a new poll."""
    poll_id = uuid4()
    options = [Option(id=uuid4(), text=text, vote_count=0) for text in request.options]
    poll = Poll(
        id=poll_id,
        question=request.question,
        options=options,
        created_at=datetime.now(UTC),
        is_active=True,
    )
    polls[poll_id] = poll
    return poll


@app.get("/api/polls/{poll_id}")
def get_poll(poll_id: UUID) -> Poll:
    """Get a specific poll by ID."""
    poll = polls.get(poll_id)
    if poll is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found",
        )
    return poll


@app.post("/api/polls/{poll_id}/vote")
def cast_vote(
    poll_id: UUID,
    request: VoteRequest,
    x_session_id: str | None = Header(default=None),
) -> Poll:
    """Cast a vote on a poll."""
    poll = polls.get(poll_id)
    if poll is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found",
        )

    # Check if already voted from this session
    if x_session_id:
        vote_key = (poll_id, x_session_id)
        if vote_key in voted_sessions:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Already voted on this poll",
            )

    # Find the option and increment vote count
    option_found = False
    updated_options: list[Option] = []
    for option in poll.options:
        if option.id == request.option_id:
            option_found = True
            updated_options.append(
                Option(
                    id=option.id,
                    text=option.text,
                    vote_count=option.vote_count + 1,
                )
            )
        else:
            updated_options.append(option)

    if not option_found:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid option ID",
        )

    # Update the poll
    updated_poll = Poll(
        id=poll.id,
        question=poll.question,
        options=updated_options,
        created_at=poll.created_at,
        is_active=poll.is_active,
    )
    polls[poll_id] = updated_poll

    # Record the vote
    if x_session_id:
        voted_sessions.add((poll_id, x_session_id))

    return updated_poll


@app.get("/api/stats")
def get_stats() -> dict[str, int]:
    """Get poll statistics."""
    total_polls = len(polls)
    active_polls = len([p for p in polls.values() if p.is_active])
    total_votes = sum(
        sum(opt.vote_count for opt in poll.options) for poll in polls.values()
    )
    return {
        "total_polls": total_polls,
        "active_polls": active_polls,
        "total_votes": total_votes,
    }
