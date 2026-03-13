import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '380px',
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'var(--bg-elevated)',
              border: `1px solid ${
                toast.type === 'success' ? 'rgba(16,185,129,0.4)' :
                toast.type === 'error' ? 'rgba(239,68,68,0.4)' :
                toast.type === 'warning' ? 'rgba(245,158,11,0.4)' :
                'rgba(79,70,229,0.4)'
              }`,
              boxShadow: 'var(--shadow-lg)',
              cursor: 'pointer',
              animation: 'slideIn 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: '18px' }}>
              {toast.type === 'success' ? '✅' :
               toast.type === 'error' ? '❌' :
               toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <p style={{
              color: 'var(--text-heading)',
              fontSize: '14px',
              lineHeight: '1.5',
              flex: 1,
            }}>
              {toast.message}
            </p>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
