export function isNativeApp() {
    // Verificar si el navegador es una WebView en Android o iOS
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Indicadores para WebView en iOS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isIOSWebView = isIOS && userAgent.includes('Safari') === false;

    // Indicadores para WebView en Android
    const isAndroid = /android/i.test(userAgent);
    const isAndroidWebView = isAndroid && (userAgent.includes('wv') || (userAgent.includes('Android') && !userAgent.includes('Chrome')));

    // Otros indicadores posibles, como la falta de ciertas APIs o la presencia de ciertas características
    const isWebView = window.matchMedia('(display-mode: standalone)').matches || isIOSWebView || isAndroidWebView;

    return isWebView;
}
