import React, { useEffect } from 'react';
import styled from 'styled-components';

const Notification = ({ message, setNotification }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, setNotification]);

  return (
    <NotificationStyled>
      {message}
    </NotificationStyled>
  );
};

const NotificationStyled = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #444;
  color: white;
  padding: 10px;
  border-radius: 5px;
`;

export default Notification;
