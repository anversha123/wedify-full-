import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { QuoteProvider } from './context/QuoteContext';
import Home from './pages/Home';
import Login from './pages/Login';
import PlannerLogin from './pages/PlannerLogin';
import SignUp from './pages/SignUp';
import UserDashboard from './pages/UserDashboard';
import GroupDetails from './pages/GroupDetails';
import WeddingPoster from './pages/WeddingPoster';
import Placeholder from './pages/Placeholder';

import AdminDashboard from './pages/AdminDashboard';

import { VendorProvider } from './context/VendorContext';
import PlannerDashboard from './pages/PlannerDashboard';
import Planners from './pages/Planners';
import PlannerDetails from './pages/PlannerDetails';

function App() {
  return (
    <AuthProvider>
      <VendorProvider>
        <QuoteProvider>
          <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/planner-login" element={<PlannerLogin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/planner/dashboard" element={<PlannerDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/planners" element={<Planners />} />
              <Route path="/planner/:id" element={<PlannerDetails />} />
              <Route path="/wedding-poster/:id" element={<WeddingPoster />} />
              <Route path="/group/:id" element={<GroupDetails />} />

              <Route path="/vendors" element={<UserDashboard />} />
              <Route path="/planning" element={<Placeholder title="Wedding Planning Tools" />} />
              <Route path="/inspiration" element={<Placeholder title="Wedding Inspiration" />} />
            </Routes>
          </BrowserRouter>
        </QuoteProvider>
      </VendorProvider>
    </AuthProvider>
  )
}

export default App
