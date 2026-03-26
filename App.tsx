import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { Home } from './pages/Home';
import { QSN } from './pages/QSN';
import { Actions } from './pages/Actions';
import { Galerie } from './pages/Galerie';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const [isDonationOpen, setIsDonationOpen] = React.useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      {!isAdminPath && <Navbar onOpenDonation={() => setIsDonationOpen(true)} />}
      <main>
        <Routes>
          <Route path="/" element={<Home onOpenDonation={() => setIsDonationOpen(true)} />} />
          <Route path="/qsn" element={<QSN />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer onOpenDonation={() => setIsDonationOpen(true)} />}

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ContentProvider>
      <Router>
        <AppContent />
      </Router>
    </ContentProvider>
  );
}

export default App;