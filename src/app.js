// Application entry point
import './styles/main.css';
import './styles/components.css';
import './components/fuel-calculator.js';

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    const fuelCalculator = document.createElement('fuel-calculator');
    app.appendChild(fuelCalculator);
  }
});

