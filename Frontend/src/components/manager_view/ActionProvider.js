class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setStateFunc = setStateFunc;
    }
  
    // Define actions like sending messages
    sendMessage = (message) => {
      const botMessage = this.createChatBotMessage(message);
      this.setStateFunc((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, botMessage],
      }));
    };
  }
  
  export default ActionProvider;
  