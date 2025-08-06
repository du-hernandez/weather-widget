import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';

interface HamburgerButtonProps {
  onToggle: () => void;
  isOpen: boolean;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  onToggle,
  isOpen,
}) => {
  return (
    <button
      className="hamburger-button"
      onClick={onToggle}
      aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      title={isOpen ? 'Cerrar menú' : 'Abrir menú'}
    >
      <ClockCircleOutlined className="hamburger-button-icon" />
    </button>
  );
};

export default HamburgerButton; 