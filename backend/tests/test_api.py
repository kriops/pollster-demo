"""Tests for the Pollster API."""

from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.main import app, polls, voted_sessions


@pytest.fixture(autouse=True)
def clear_state() -> None:
    """Clear in-memory state before each test."""
    polls.clear()
    voted_sessions.clear()


@pytest.fixture
def client() -> TestClient:
    """Create a test client."""
    return TestClient(app)


class TestCreatePoll:
    """Tests for POST /api/polls."""

    def test_create_poll_success(self, client: TestClient) -> None:
        """Test creating a poll successfully."""
        response = client.post(
            "/api/polls",
            json={
                "question": "What is your favorite color?",
                "options": ["Red", "Blue", "Green"],
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["question"] == "What is your favorite color?"
        assert len(data["options"]) == 3
        assert data["is_active"] is True
        assert all(opt["vote_count"] == 0 for opt in data["options"])

    def test_create_poll_minimum_options(self, client: TestClient) -> None:
        """Test creating a poll with exactly 2 options."""
        response = client.post(
            "/api/polls",
            json={
                "question": "Yes or No?",
                "options": ["Yes", "No"],
            },
        )
        assert response.status_code == 201
        assert len(response.json()["options"]) == 2

    def test_create_poll_too_few_options(self, client: TestClient) -> None:
        """Test that creating a poll with < 2 options fails."""
        response = client.post(
            "/api/polls",
            json={
                "question": "Only one option?",
                "options": ["Only"],
            },
        )
        assert response.status_code == 422

    def test_create_poll_empty_question(self, client: TestClient) -> None:
        """Test that empty question fails validation."""
        response = client.post(
            "/api/polls",
            json={
                "question": "",
                "options": ["Yes", "No"],
            },
        )
        assert response.status_code == 422


class TestListPolls:
    """Tests for GET /api/polls."""

    def test_list_polls_empty(self, client: TestClient) -> None:
        """Test listing polls when none exist."""
        response = client.get("/api/polls")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_polls_with_polls(self, client: TestClient) -> None:
        """Test listing polls returns created polls."""
        # Create two polls
        client.post(
            "/api/polls",
            json={"question": "Poll 1?", "options": ["A", "B"]},
        )
        client.post(
            "/api/polls",
            json={"question": "Poll 2?", "options": ["X", "Y"]},
        )

        response = client.get("/api/polls")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        questions = [p["question"] for p in data]
        assert "Poll 1?" in questions
        assert "Poll 2?" in questions


class TestGetPoll:
    """Tests for GET /api/polls/{poll_id}."""

    def test_get_poll_success(self, client: TestClient) -> None:
        """Test getting a specific poll."""
        # Create a poll
        create_response = client.post(
            "/api/polls",
            json={"question": "Test poll?", "options": ["A", "B"]},
        )
        poll_id = create_response.json()["id"]

        # Get the poll
        response = client.get(f"/api/polls/{poll_id}")
        assert response.status_code == 200
        assert response.json()["question"] == "Test poll?"

    def test_get_poll_not_found(self, client: TestClient) -> None:
        """Test getting a non-existent poll returns 404."""
        fake_id = uuid4()
        response = client.get(f"/api/polls/{fake_id}")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


class TestCastVote:
    """Tests for POST /api/polls/{poll_id}/vote."""

    def test_vote_success(self, client: TestClient) -> None:
        """Test voting on a poll successfully."""
        # Create a poll
        create_response = client.post(
            "/api/polls",
            json={"question": "Vote test?", "options": ["A", "B"]},
        )
        poll = create_response.json()
        poll_id = poll["id"]
        option_id = poll["options"][0]["id"]

        # Vote
        response = client.post(
            f"/api/polls/{poll_id}/vote",
            json={"option_id": option_id},
        )
        assert response.status_code == 200
        data = response.json()
        voted_option = next(o for o in data["options"] if o["id"] == option_id)
        assert voted_option["vote_count"] == 1

    def test_vote_poll_not_found(self, client: TestClient) -> None:
        """Test voting on a non-existent poll returns 404."""
        fake_poll_id = uuid4()
        fake_option_id = uuid4()
        response = client.post(
            f"/api/polls/{fake_poll_id}/vote",
            json={"option_id": str(fake_option_id)},
        )
        assert response.status_code == 404

    def test_vote_invalid_option(self, client: TestClient) -> None:
        """Test voting with an invalid option ID returns 400."""
        # Create a poll
        create_response = client.post(
            "/api/polls",
            json={"question": "Vote test?", "options": ["A", "B"]},
        )
        poll_id = create_response.json()["id"]
        fake_option_id = uuid4()

        # Vote with invalid option
        response = client.post(
            f"/api/polls/{poll_id}/vote",
            json={"option_id": str(fake_option_id)},
        )
        assert response.status_code == 400
        assert "invalid" in response.json()["detail"].lower()

    def test_vote_duplicate_with_session(self, client: TestClient) -> None:
        """Test that duplicate voting from same session returns 409."""
        # Create a poll
        create_response = client.post(
            "/api/polls",
            json={"question": "Vote test?", "options": ["A", "B"]},
        )
        poll = create_response.json()
        poll_id = poll["id"]
        option_id = poll["options"][0]["id"]
        session_id = "test-session-123"

        # First vote should succeed
        response1 = client.post(
            f"/api/polls/{poll_id}/vote",
            json={"option_id": option_id},
            headers={"X-Session-ID": session_id},
        )
        assert response1.status_code == 200

        # Second vote from same session should fail
        response2 = client.post(
            f"/api/polls/{poll_id}/vote",
            json={"option_id": option_id},
            headers={"X-Session-ID": session_id},
        )
        assert response2.status_code == 409
        assert "already voted" in response2.json()["detail"].lower()

    def test_vote_different_sessions_allowed(self, client: TestClient) -> None:
        """Test that different sessions can vote on same poll."""
        # Create a poll
        create_response = client.post(
            "/api/polls",
            json={"question": "Vote test?", "options": ["A", "B"]},
        )
        poll = create_response.json()
        poll_id = poll["id"]
        option_id = poll["options"][0]["id"]

        # First session votes
        response1 = client.post(
            f"/api/polls/{poll_id}/vote",
            json={"option_id": option_id},
            headers={"X-Session-ID": "session-1"},
        )
        assert response1.status_code == 200

        # Second session votes
        response2 = client.post(
            f"/api/polls/{poll_id}/vote",
            json={"option_id": option_id},
            headers={"X-Session-ID": "session-2"},
        )
        assert response2.status_code == 200

        # Vote count should be 2
        assert response2.json()["options"][0]["vote_count"] == 2


class TestHealthCheck:
    """Tests for GET /health."""

    def test_health_check(self, client: TestClient) -> None:
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
