import { Navigate } from 'react-router-dom';

// Cambiar esto:
{
  path: '/favorites',
  element: <FavoritesList />
}

// Por esto:
{
  path: '/favorites',
  element: <Navigate to="/profile" replace />
} 