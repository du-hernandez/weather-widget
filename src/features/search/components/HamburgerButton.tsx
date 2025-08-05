import React from 'react';
import { Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';

interface HamburgerButtonProps extends Omit<ButtonProps, 'icon'> {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  onClick,
  ...buttonProps
}) => {
  return (
    <Button
      type="text"
      icon={isOpen ? <CloseOutlined /> : <MenuOutlined />}
      onClick={onClick}
      className="hamburger-button"
      size="large"
      {...buttonProps}
    />
  );
};

export default HamburgerButton; 