import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="secondary"
      onClick={() => navigate(-1)}
      style={{
        marginBottom: '20px',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#000D6B',
        borderColor: '#6c757d',
      }}
    >
      Back
    </Button>
  );
};

export default BackButton;
