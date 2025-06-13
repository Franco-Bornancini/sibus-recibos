module.exports = {
    globDirectory: 'build/',
    globPatterns: ['**/*.{html,js,css,png,svg,ico,json}'],
    swDest: 'build/service-worker.js',
    clientsClaim: true,
    skipWaiting: true
};