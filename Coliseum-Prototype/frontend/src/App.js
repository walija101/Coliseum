import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Messages from "./views/Messages";
import Chat from "./views/Chat";
import Notifications from "./views/notifications/Notifications";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./views/Login";
import Registration from "./views/Registration";
import AddFriends from "./views/AddFriends";
import CreateProfile from "./views/CreateProfile";
import ProfileForm from "./views/profile/ProfileForm";
import { useMediaQuery } from "react-responsive";
import {UserProvider, useUser} from "./contexts/UserContext";

import AdminSidebar from "./views/admin/adminComponents/AdminSidebar";
// import AdminHome from "./views/admin/AdminHome";
// import AdminBanRequests from "./views/admin/AdminBanRequests";
// import AdminModsOverview from "./views/admin/AdminModsOverview";
import AdminDBOverview from "./views/admin/AdminDBOverview";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isAuthenticated = !!localStorage.getItem('token');
  
  const isLoginPage = location.pathname === "/login";
  const isRegistrationPage = location.pathname === "/registration";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const shouldShowNavigation = !isLoginPage && !isRegistrationPage && isAuthenticated && !isAdminRoute;

  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarCollapsed(false);
    }
  }, [isDesktop]);

  const renderSidebar = () => {
    if (!isAuthenticated) return null;
    
    if (isDesktop) {
      if (isAdminRoute) {
        return (
          <div className="fixed left-0 top-0 h-full">
            <AdminSidebar 
              isCollapsed={isSidebarCollapsed}
              toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>
        );
      }
      if (shouldShowNavigation) {
        return (
          <div className="fixed left-0 top-0 h-full">
            <Sidebar 
              isCollapsed={isSidebarCollapsed}
              toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNavigation && !isDesktop && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
      )}
      
      <div 
        className={`
          fixed inset-0 bg-sand transition-all duration-300
          ${shouldShowNavigation && !isDesktop ? 'top-16 bottom-16' : ''} 
          ${(shouldShowNavigation || isAdminRoute) && isDesktop ? (isSidebarCollapsed ? 'ml-20' : 'ml-64') : ''} 
        `}
      >
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/messages/chat/:chatId" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/create-profile" element={isAuthenticated ? <CreateProfile /> : <Navigate to="/login" />} />
          <Route path="/update-profile" element={isAuthenticated ? <ProfileForm isUpdate={true} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/add-friends" element={isAuthenticated ? <AddFriends /> : <Navigate to="/login" />} />
          
          {/* Admin */}
          <Route path="/admin/home" element={<AdminDBOverview />} />
          {/* <Route path="/admin/banRequests" element={<AdminBanRequests />} /> */}
          {/* <Route path="/admin/modsOverview" element={<AdminModsOverview />} /> */}
          {/* <Route path="/admin/dbOverview" element={<AdminDBOverview />} /> */}

        </Routes>
      </div>

      {renderSidebar()}

      {shouldShowNavigation && !isDesktop && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}
    </div>
  );
};

// const Routes = () => {
//   const {user} = useUser();

//   if (user.bannedUntil){
//     if (user.bannedUntil > new Date()){
//       localStorage.setItem('token', null);  // clear token
//       alert('You are banned until ' + user.bannedUntil + ". Reason: " + user.banRequest.reason);
//       return <Navigate to="/" />
      
//     }
//     else{
//       //do a navigate to clear ban, which should redirect to home
//     }
//   }
// }

export default App;