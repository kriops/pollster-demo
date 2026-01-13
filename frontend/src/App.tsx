import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { PollList } from './components/PollList';
import { PollDetail } from './components/PollDetail';
import { CreatePoll } from './components/CreatePoll';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <Link to="/" className="app-title">
            Pollster
          </Link>
          <nav className="app-nav">
            <Link to="/" className="nav-link">
              Polls
            </Link>
            <Link to="/create" className="nav-link nav-link-primary">
              Create Poll
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/polls/:id" element={<PollDetail />} />
            <Route path="/create" element={<CreatePoll />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
