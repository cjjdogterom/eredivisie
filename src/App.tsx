import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Overview from './pages/Overview';
import QuizPage from './pages/QuizPage';
import Stats from './pages/Stats';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import './styles/App.css';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/overzicht" element={<Overview />} />
        <Route path="/overhoren" element={<QuizPage />} />
        <Route path="/statistieken" element={<Stats />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/clubs/:slug" element={<ClubDetail />} />
      </Routes>
    </Layout>
  );
}
