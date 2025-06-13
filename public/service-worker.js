// En tu src/index.js o src/service-worker.js
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('SW registrado:', registration);
        })
        .catch(error => {
            console.log('Error al registrar SW:', error);
        });
    });
}