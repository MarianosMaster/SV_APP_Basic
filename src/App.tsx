
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RelationshipProvider } from './context/RelationshipContext';
import { Layout } from './components/Layout';

import { Dashboard } from './pages/DashboardPage';
import { TreePage } from './pages/TreePage';
import { IdeasPage } from './pages/IdeasPage';
import { MapPage } from './pages/MapPage';
import { SpotifyPage } from './pages/SpotifyPage';
import { GamePage } from './pages/GamePage';

function App() {
  return (
    <RelationshipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tree" element={<TreePage />} />
            <Route path="ideas" element={<IdeasPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="spotify" element={<SpotifyPage />} />
            <Route path="game" element={<GamePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RelationshipProvider>
  );
}

export default App;
