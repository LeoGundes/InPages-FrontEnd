import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/breakpoints';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  
  ${media.mobile} {
    top: 10px;
    right: 10px;
    left: 10px;
  }
`;

const NotificationCard = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success': return '#d4edda';
      case 'error': return '#f8d7da';
      case 'warning': return '#fff3cd';
      case 'info': return '#d1ecf1';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'warning': return '#856404';
      case 'info': return '#0c5460';
      default: return '#495057';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#c3e6cb';
      case 'error': return '#f5c6cb';
      case 'warning': return '#ffeaa7';
      case 'info': return '#bee5eb';
      default: return '#dee2e6';
    }
  }};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideInRight 0.3s ease-out;
  position: relative;

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  &.fadeOut {
    animation: slideOutRight 0.3s ease-out forwards;
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  ${media.mobile} {
    min-width: auto;
    max-width: none;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 6px;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  
  .icon {
    font-size: 1.2em;
  }
  
  .title {
    font-weight: 600;
    font-size: 0.95em;
  }
`;

const NotificationMessage = styled.div`
  font-size: 0.9em;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

function Notification({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 5000,
  onClose 
}) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success': return 'Sucesso';
      case 'error': return 'Erro';
      case 'warning': return 'Atenção';
      case 'info': return 'Informação';
      default: return 'Notificação';
    }
  };

  return (
    <NotificationCard type={type} className={isClosing ? 'fadeOut' : ''}>
      <CloseButton onClick={handleClose}>×</CloseButton>
      <NotificationHeader>
        <span className="icon">{getIcon()}</span>
        <span className="title">{getTitle()}</span>
      </NotificationHeader>
      <NotificationMessage>{message}</NotificationMessage>
    </NotificationCard>
  );
}

// Componente para gerenciar múltiplas notificações
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Disponibiliza as funções globalmente
  window.showNotification = addNotification;

  return (
    <>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </NotificationContainer>
    </>
  );
}

export default Notification;
