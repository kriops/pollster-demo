"""Pydantic models for the Pollster API."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class Option(BaseModel):
    """A poll option with vote count."""

    id: UUID
    text: str = Field(min_length=1, max_length=200)
    vote_count: int = Field(ge=0, default=0)


class Poll(BaseModel):
    """A poll with question and options."""

    id: UUID
    question: str = Field(min_length=1, max_length=500)
    options: list[Option] = Field(min_length=2, max_length=10)
    created_at: datetime
    is_active: bool = True


class CreatePollRequest(BaseModel):
    """Request body for creating a new poll."""

    question: str = Field(min_length=1, max_length=500)
    options: list[str] = Field(min_length=2, max_length=10)


class VoteRequest(BaseModel):
    """Request body for casting a vote."""

    option_id: UUID


class OptionResult(BaseModel):
    """An option with its vote percentage."""

    id: UUID
    text: str
    vote_count: int
    percentage: float = Field(ge=0, le=100)


class PollResults(BaseModel):
    """Poll results with percentages."""

    poll_id: UUID
    total_votes: int = Field(ge=0)
    options: list[OptionResult]


class ErrorResponse(BaseModel):
    """Error response model."""

    detail: str
