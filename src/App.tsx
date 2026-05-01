
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { OAuthCallback } from './pages/OAuthCallback';

import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors closeButton theme="dark" expand={false} />
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Routes>
      </AppShell>
    </>
  );
}

export default App;
