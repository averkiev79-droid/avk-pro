import { createContext, useContext, useState } from 'react';

const BreadcrumbsContext = createContext();

export const BreadcrumbsProvider = ({ children }) => {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState({});

  const setBreadcrumb = (path, name) => {
    setCustomBreadcrumbs(prev => ({
      ...prev,
      [path]: name
    }));
  };

  const clearBreadcrumb = (path) => {
    setCustomBreadcrumbs(prev => {
      const newBreadcrumbs = { ...prev };
      delete newBreadcrumbs[path];
      return newBreadcrumbs;
    });
  };

  return (
    <BreadcrumbsContext.Provider value={{ customBreadcrumbs, setBreadcrumb, clearBreadcrumb }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within BreadcrumbsProvider');
  }
  return context;
};
