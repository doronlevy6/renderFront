import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import React from 'react';

function ProtectedRoute({ element, ...rest }) {
  const { isAuthenticated } = React.useContext(AuthContext);

  return isAuthenticated ? (
    <Route element={element} {...rest} />
  ) : (
    <Navigate to='/' />
  );
}

export default ProtectedRoute;
