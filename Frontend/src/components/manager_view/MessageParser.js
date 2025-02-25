class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      // You can parse user input here and decide what action to trigger
      this.actionProvider.sendMessage(message);
    }
  }
  
  export default MessageParser;
  