import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DatasetProvider } from './data/DatasetContext';
import { getDataset } from './data/datasets';
import Layout from './components/Layout';
import TrainerPicker from './pages/TrainerPicker';
import Home from './pages/Home';
import Overview from './pages/Overview';
import QuizPage from './pages/QuizPage';
import Stats from './pages/Stats';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Learn from './pages/Learn';
import './styles/App.css';

function DatasetApp() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const dataset = getDataset(datasetId);

  if (!dataset) {
    return <Navigate to="/" replace />;
  }

  return (
    <DatasetProvider dataset={dataset}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="overzicht" element={<Overview />} />
          <Route path="overhoren" element={<QuizPage />} />
          <Route path="leren" element={<Learn />} />
          <Route path="statistieken" element={<Stats />} />
          <Route path="winnaars" element={<Clubs />} />
          <Route path="winnaars/:slug" element={<ClubDetail />} />
          <Route path="*" element={<Navigate to={`/${dataset.id}`} replace />} />
        </Routes>
      </Layout>
    </DatasetProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TrainerPicker />} />
      <Route path="/:datasetId/*" element={<DatasetApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
