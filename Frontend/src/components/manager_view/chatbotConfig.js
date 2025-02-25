const config = {
    botName: 'ChatBot',
    initialMessages: [
      {
        type: 'bot',
        message: 'Hello! How can I assist you today?',
      },
    ],
    handleUserMessage: async (message) => {
      // API call logic goes here, as described
    },
  };
  
  export default config;
  