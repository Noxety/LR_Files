import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

// Configure axios defaults for CSRF token
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

axios.defaults.withCredentials = true;

// Get Reverb configuration from environment
const reverbKey = import.meta.env.VITE_REVERB_APP_KEY || 'reverb-key';
const reverbHost = import.meta.env.VITE_REVERB_HOST || window.location.hostname;
const reverbPort = Number(import.meta.env.VITE_REVERB_PORT ?? 8080);
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
const useTLS = reverbScheme === 'https';

const echoConfig = {
  broadcaster: 'reverb', 
  key: reverbKey,
  wsHost: reverbHost,
  wsPort: reverbPort,
  wssPort: reverbPort,
  forceTLS: useTLS,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      'X-CSRF-TOKEN': csrfToken || '',
      'Accept': 'application/json',
    },
  },
};

export const echo = new Echo(echoConfig);

export default echo;
