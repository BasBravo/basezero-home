export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function loadScripts(scripts: string[], callback: any) {
    const promises: any[] = [];
    scripts.forEach((script: string) => {
        promises.push(
            new Promise((resolve, reject) => {
                // Verificar si el script ya está cargado
                const existingScript = document.querySelector(`script[src="${script}"]`);
                if (existingScript) {
                    resolve(existingScript);
                    return;
                }

                const el = document.createElement('script');
                el.src = script;
                el.onload = () => {
                    console.log(`Script cargado exitosamente: ${script}`);
                    resolve(el);
                };
                el.onerror = error => {
                    console.error(`Error al cargar script: ${script}`, error);
                    reject(new Error(`Failed to load script: ${script}`));
                };
                document.body.appendChild(el);
            }),
        );
    });
    return Promise.all(promises).then(callback);
}

export function sortProvider(data: any[], key: string) {
    if (!data) return [];
    if (!key) return data;
    if (data.length === 0) return data;
    if (!Array.isArray(data)) return data;

    data = data.sort((a: any, b: any) => {
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
        return 0;
    });
    return data;
}

export function delayConection() {
    const delay = navigator.connection?.downlink > 10 ? 3000 : 6000;
    return delay;
}

export function filterToUrl(data: any) {
    if (!data) return '';

    // if is array
    if (Array.isArray(data)) {
        return data.join(',');
    }

    // if is object
    if (typeof data === 'object') {
        return Object.keys(data)
            .map(key => `${data[key]}`)
            .join(',');
    }

    // if is string
    return data;
}
