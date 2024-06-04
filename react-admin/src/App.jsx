import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { appRoutes } from './routes'
import { default as Navbar } from './components/Navbar'
import { useState } from 'react'
import Error from './components/Error'

function App() {
  const [loggedIn, setLoggedIn] = useState((sessionStorage.admin ? true : false))
  const [email, setEmail] = useState((sessionStorage.admin ? JSON.parse(sessionStorage.admin).email : ""))
  const location = useLocation();
  const token = sessionStorage.admin ? JSON.parse(sessionStorage.admin).token : "";
  return (
    <>
      <Navbar />
      <Routes location={location}>{
        appRoutes.map(
          (route) => {
            if (route.requireAuth && !loggedIn) {
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
                      token={token}
                      baseUrl={'http://localhost:8080/api/v1/admin/'}
                    />
                  }
                  errorElement=<Error/>
                />
              );
            }
          }
        )
      }
      </Routes>
    </>
  )
}

export default App
