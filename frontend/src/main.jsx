import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';

import App from './App.jsx'
import { Toaster } from './components/ui/toaster.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toaster />
    </PersistGate>
  </Provider>
  </StrictMode>,
)
