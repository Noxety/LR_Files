import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import OfflinePage from './pages/OfflinePage';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch((err) => console.error('SW error', err));
    });
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
(function () {
    const theme = localStorage.getItem('theme') || 'default';
    const dark = localStorage.getItem('dark') === 'true';

    // Always reset first
    document.documentElement.classList.remove('theme-blue', 'theme-green', 'theme-red', 'dark');

    if (theme !== 'default') {
        document.documentElement.classList.add('theme-' + theme);
    }

    if (dark) {
        document.documentElement.classList.add('dark');
    }

    // Force default vars when theme=default & light mode
    if (theme === 'default' && !dark) {
        document.documentElement.classList.add('theme-default');
    }
})();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const Root = () => {
            const [online, setOnline] = useState(navigator.onLine);

            useEffect(() => {
                const goOnline = () => setOnline(true);
                const goOffline = () => setOnline(false);

                window.addEventListener('online', goOnline);
                window.addEventListener('offline', goOffline);

                return () => {
                    window.removeEventListener('online', goOnline);
                    window.removeEventListener('offline', goOffline);
                };
            }, []);

            if (!online) {
                return <OfflinePage />;
            }

            return <App {...props} />;
        };

        root.render(<Root />);
    },

    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
