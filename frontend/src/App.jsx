// import { Routes, Route, Navigate } from "react-router";
// import HomePage from "./pages/HomePage";
// import SingUpPage from "./pages/SingUpPage";
// import LoginPage from "./pages/LoginPage";
// import NotificationsPage from "./pages/NotificationsPage";
// import CallPage from "./pages/CallPage";
// import ChatPage from "./pages/ChatPage";
// import OnboardingPage from "./pages/OnboardingPage";

// import { Toaster } from "react-hot-toast";
// import PageLoader from "./components/PageLoader.jsx";
// import useAuthUser from "./hooks/useAuthUser.js";

// const App = () => {
//   const {isLoading, authUser} = useAuthUser();

//   const isAuthenticated = Boolean(authUser)
//   const isOnboarded = authUser?.isOnboarded

//   if (isLoading) return <PageLoader />;
//   return (
//     <div className="h-screen">
//       <Routes>
//         <Route
//           path="/"
//           element={isAuthenticated && isOnboarded ? <HomePage /> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />}
//         />
//         <Route
//           path="/signup"
//           element={!isAuthenticated ? <SingUpPage /> : <Navigate to="/onboarding" />}
//         />
//         <Route
//           path="/login"
//           element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/notifications"
//           element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/call"
//           element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/chat"
//           element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/onboarding"
//           element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />}
//         />
//       </Routes>
//       <Toaster />
//     </div>
//   );
// };

// export default App;

import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              // !isOnboarded ? (
                <OnboardingPage />
              // ) : (
                // <Navigate to="/" />
              // )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

                <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
