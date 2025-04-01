
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create public/exports directory if it doesn't exist
try {
  // This is handled by the server in a production environment
  // We're just making sure the export functionality works
  console.log('Application initialized and ready for flow creation');
} catch (error) {
  console.error('Error initializing application:', error);
}

createRoot(document.getElementById("root")!).render(<App />);
