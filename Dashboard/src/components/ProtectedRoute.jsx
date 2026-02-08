import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    window.location.href = 'http://localhost:3000/login';
    return null;
  }
  
  return children;
}
