import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode as jwt } from 'jwt-decode';

// Stores
import { setPreferedTheme, setUserInformation, logUserIn, logUserOut } from './stores/userStore';
import { setIsLoading } from './stores/coreStore';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import BannerEnv from './components/BannerEnv';
import Loading from './components/Loading';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/404';

// Utils
import themeHelper from './utils/themeHelper';
import { identifyUserByToken, refreshToken } from './api/users';

const Root = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.core.isLoading);
  
  const refreshTokenHandle = async (refresh, access) => {
    refreshToken(refresh, access)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error);
        }
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
      })
      .catch((error) => {
        if (!error.response) {
          return;
        }
        if (error.response.data.error === 'Refresh token is not valid') {
          dispatch(logUserOut());
          dispatch(setIsLoading(false));
        }
      });
  }
  const identifyUser = async (token) => {
    return identifyUserByToken(token)
      .then((response) => {
        if (response.error) {
          throw new Error(response);
        }
        dispatch(logUserIn({username: response.username}));
        dispatch(setUserInformation(response));
        return true;
      })
      .catch((error) => {
        if (error.response.data.error === 'Token expired') {
          return false;
        }
      });
  };

  useEffect(() => {

    let theme = localStorage.getItem('theme');
    let access = localStorage.getItem('access');
    let refresh = localStorage.getItem('refresh');
    let shouldRefresh = false;

    if (!access && !refresh) {
      // TODO: just make sure the global state is updated
      dispatch(logUserOut());
      dispatch(setIsLoading(false));

    } else {
      // let decoded = jwt(accessToken);
      
      identifyUser(access)
        .then((result) => {
          console.log("Response: ", result)
          shouldRefresh = result;
        })
      
      if (shouldRefresh) {
        refreshTokenHandle(refresh, access)
          .then(() => {
            shouldRefresh = identifyUser()
          })
          .catch((error) => {
            console.log("Error: ", error)
          })
      } else {
        // dispatch(setIsLoading(false));
        
      }
    }
    const p = new Promise((resolve, reject) => {
      if (theme) {
        dispatch(setPreferedTheme(theme));
      } else {
        dispatch(setPreferedTheme(themeHelper.getUserPreferedSchema()));
      }
      resolve();
    })
    
    p.finally(() => {
      dispatch(setIsLoading(false));
    });
  }, [dispatch]);

  return (
    <>
      {
          process.env.NODE_ENV !== 'production' && <BannerEnv />
      }
      {
        isLoading ? 
        (
          <Loading />
        )
        : 
        (
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
        )
      }
    </>
  );
};

export default Root;