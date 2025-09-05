import React from 'react';
import styled from 'styled-components';
import { media } from '../../styles/breakpoints';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
  padding: 20px;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  ${media.mobile} {
    padding: 10px;
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  ${media.tablet} {
    padding: 20px;
    max-width: 90%;
  }
  
  ${media.mobile} {
    padding: 16px;
    max-width: 95%;
    border-radius: 8px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .icon {
    font-size: 1.5em;
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2em;
`;

const ModalContent = styled.p`
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  ${media.mobile} {
    flex-direction: column;
    gap: 8px;
  }
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #666;
    border: 1px solid #dee2e6;
    
    &:hover {
      background: #e9ecef;
      color: #495057;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${media.mobile} {
    padding: 12px 16px;
    font-size: 1em;
  }
`;

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  onConfirm,
  type = 'danger' // 'danger', 'success', 'warning', 'info'
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger': return '⚠️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '⚠️';
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <span className="icon">{getIcon()}</span>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        
        <ModalContent>{message}</ModalContent>
        
        <ModalActions>
          <ModalButton className="secondary" onClick={onClose}>
            {cancelText}
          </ModalButton>
          <ModalButton className="primary" onClick={onConfirm}>
            {confirmText}
          </ModalButton>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default Modal;
