import React, { useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { appRoutes } from "./routes";
import { default as Navbar } from './components/Navbar';
import Login from "./components/Login";
import WithoutNav from "./components/WithoutNav";
import WithNav from "./components/WithNav";
const App = () => {

  const [loggedIn, setLoggedIn] = useState((sessionStorage.user ? true : false))
  const [email, setEmail] = useState((sessionStorage.user ? JSON.parse(sessionStorage.user).email : ""))
  const [token, setToken] = useState((sessionStorage.user ? JSON.parse(sessionStorage.user).token : ""))
  const [user, setUser] = useState({})
  const location = useLocation();
  return (<>

    {/* <Navbar loggedIn={loggedIn}
      setLoggedIn={setLoggedIn}
      setEmail={setEmail}
      email={email} /> */}
    <Routes location={location}>
      <Route element={<WithoutNav
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        setEmail={setEmail}
        email={email}
        user={user}
        setUser={setUser}
        token={token}
        baseUrl={'http://localhost:8080/api/v1/'} />}>
        <Route path="/login" element={<Login loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          setEmail={setEmail}
          email={email}
          user={user}
          setUser={setUser}
          token={token}
          baseUrl={'http://localhost:8080/api/v1/'} />} />
      </Route>

      <Route element={<WithNav
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        setEmail={setEmail}
        email={email}
        user={user}
        setUser={setUser}
        token={token}
        baseUrl={'http://localhost:8080/api/v1/'} />}>

        {appRoutes.map((route) => {
          if (route.requiresAuth && !loggedIn) {
            return (
              <Route
                key={route.path}
                exact
                path={route.path}
                element={<Navigate replace to={"/login"} />}
              />
            );
          } else {
            return (
              <Route
                key={route.path}
                exact
                path={route.path}
                element={
                  <route.component
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    setEmail={setEmail}
                    email={email}
                    user={user}
                    setUser={setUser}
                    token={token}
                    baseUrl={'http://localhost:8080/api/v1/'}
                  />
                }
              />
            );
          }
        })}
      </Route>
    </Routes>
  </>
  )
};
export default App;