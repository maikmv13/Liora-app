import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Buscar el contenedor con scroll (#root en nuestro caso)
    const root = document.getElementById('root');
    if (root) {
      root.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
} 