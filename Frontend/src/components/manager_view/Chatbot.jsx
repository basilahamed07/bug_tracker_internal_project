import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const FixedChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Error state
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      message: userInput,
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      const response = await fetch('http://localhost:5000/sample_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        type: 'bot',
        message: data.result.output,
      }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        type: 'bot',
        message: "Sorry, I couldn't process your request at the moment.",
      }]);
      // setErrorMessage('Something went wrong. Please try again.'); // Set error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#0d6efd',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="btn-primary hover-shadow"
        >
          <MessageCircle className="text-white" />
        </button>
      ) : (
        <div style={{
          width: '350px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#0d6efd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div className="d-flex align-items-center gap-2">
              <Bot className="text-white" />
              <span className="text-white fw-medium">Chat Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-link text-white p-1"
              style={{ border: 'none', background: 'none' }}
            >
              <X />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
          }}>
            {messages.length === 0 && (
              <div className="text-center text-muted my-4">
                <Bot className="mb-2" size={32} />
                <p>How can I help you today?</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: msg.type === 'user' ? '#0d6efd' : 'white',
                  color: msg.type === 'user' ? 'white' : 'black',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderBottomRightRadius: msg.type === 'user' ? '0' : '1rem',
                  borderBottomLeftRadius: msg.type === 'user' ? '1rem' : '0',
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="d-flex justify-content-start">
                <div className="bg-white p-3 rounded" style={{ borderBottomLeftRadius: 0 }}>
                  <div className="d-flex gap-1">
                    <div className="spinner-grow spinner-grow-sm text-primary" role="status" />
                    <div className="spinner-grow spinner-grow-sm text-primary" role="status" />
                    <div className="spinner-grow spinner-grow-sm text-primary" role="status" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #dee2e6',
            backgroundColor: 'white',
          }}>
            <div className="input-group">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
                placeholder="Type your message..."
                className={`form-control border-end-0 ${errorMessage ? 'border-danger' : ''}`}
                disabled={isLoading}
              />
              <button
                onClick={handleUserMessage}
                disabled={isLoading || !userInput.trim()}
                className="btn btn-primary"
              >
                <Send size={18} />
              </button>
            </div>
            {errorMessage && (
              <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedChatBot;
