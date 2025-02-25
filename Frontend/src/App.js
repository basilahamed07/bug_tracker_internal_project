// // App.js
// import Layout from "./components/Layout/Layout";
// function App() {
  
//   return <Layout />;
  
// }

// export default App;



// src/App.js
import React from 'react';
import { Provider } from 'react-redux'; // Import the Provider from react-redux
import store from '../src/components/validation/store'; // Import your configured Redux store
import Layout from './components/Layout/Layout'; // Import your Layout component

function App() {
  return (
    <Provider store={store}> {/* Wrap Layout in Provider */}
      <Layout /> {/* Layout now has access to Redux store */}
    </Provider>
  );
}

export default App;
