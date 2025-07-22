import { loadScripts } from "./utils"

export const pdfToImage = async file => {
    console.log('pdfToImage: Iniciando conversión de PDF', file);

    if (!file) {
        throw new Error('No se proporcionó un archivo');
    }

    if (file.type !== 'application/pdf') {
        throw new Error('El archivo no es un PDF válido');
    }

    try {
        console.log('pdfToImage: Cargando PDF.js...');
        await loadScripts(['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js']);

        // Verificar que PDF.js se haya cargado
        if (!window.pdfjsLib) {
            throw new Error('PDF.js no se cargó correctamente');
        }

        // Configurar worker de PDF.js
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        console.log('pdfToImage: PDF.js cargado exitosamente');

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        return new Promise((resolve, reject) => {
            reader.onload = async function () {
                try {
                    console.log('pdfToImage: Archivo leído, procesando PDF...');
                    const pdf = await window.pdfjsLib.getDocument(new Uint8Array(reader.result)).promise;
                    const totalPages = pdf.numPages;
                    console.log(`pdfToImage: PDF tiene ${totalPages} páginas`);

                    for (let i = 1; i <= totalPages; i++) {
                        console.log(`pdfToImage: Procesando página ${i}/${totalPages}`);
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 1 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');

                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport,
                        };

                        await page.render(renderContext).promise;
                        console.log(`pdfToImage: Página ${i} renderizada exitosamente`);

                        const dataURL = canvas.toDataURL('image/jpeg');
                        const blob = await fetch(dataURL).then(r => r.blob());
                        const imageFile = new File([blob], file.name, { type: 'image/jpeg' });

                        const result = {
                            file: imageFile,
                            url: dataURL,
                            name: imageFile.name,
                            type: imageFile.type,
                            size: imageFile.size,
                            lastModified: imageFile.lastModified ?? null,
                            lastModifiedDate: imageFile.lastModifiedDate ?? null,
                        };

                        console.log('pdfToImage: Conversión completada exitosamente');
                        resolve(result);
                        return; // Solo procesamos la primera página
                    }
                } catch (error) {
                    console.error('pdfToImage: Error durante el procesamiento:', error);
                    reject(error);
                }
            };

            reader.onerror = function (error) {
                console.error('pdfToImage: Error al leer el archivo:', error);
                reject(new Error('Error al leer el archivo PDF'));
            };
        });
    } catch (error) {
        console.error('pdfToImage: Error general:', error);
        throw error;
    }
};

export const pdfUrlToImage = async url => {
    await loadScripts(['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js']);

    // Configurar worker de PDF.js
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    return new Promise(resolve => {
        window.pdfjsLib.getDocument(url).promise.then(async pdf => {
            const totalPages = pdf.numPages;

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport,
                };

                await page.render(renderContext).promise;

                const dataURL = canvas.toDataURL('image/jpeg');
                const blob = await fetch(dataURL).then(r => r.blob());
                const imageFile = new File([blob], url, { type: 'image/jpeg' });

                const result = {
                    file: imageFile,
                    url: dataURL,
                    name: imageFile.name,
                    type: imageFile.type,
                    size: imageFile.size,
                    lastModified: imageFile.lastModified ?? null,
                    lastModifiedDate: imageFile.lastModifiedDate ?? null,
                };

                resolve(result);
            }
        });
    });
};

export const fileToImage = async file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise(resolve => {
        reader.onload = function () {
            resolve(reader.result);
        };
    });
};

export const getBase64FromFile = async file => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    return new Promise(resolve => {
        reader.onload = function () {
            resolve(reader.result);
        };
    });
};

export const getBase64FromUrl = async url => {
    const reader = new FileReader();
    const blob = await fetch(url).then(r => r.blob());

    reader.readAsDataURL(blob);

    return new Promise(resolve => {
        reader.onload = function () {
            resolve(reader.result);
        };
    });
};

export const resizeImage = async (file, maxWidth = 1000, maxHeight = 1000) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise(resolve => {
        reader.onload = function () {
            const img = new Image();

            img.src = reader.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let { width } = img;
                let { height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                const dataURL = canvas.toDataURL('image/jpeg');
                const blob = fetch(dataURL).then(r => r.blob());
                const imageFile = new File([blob], file.name, { type: 'image/jpeg' });

                const result = {
                    file: imageFile,
                    url: dataURL,
                    name: imageFile.name,
                    type: imageFile.type,
                    size: imageFile.size,
                    lastModified: imageFile.lastModified ?? null,
                    lastModifiedDate: imageFile.lastModifiedDate ?? null,
                };

                resolve(result);
            };
        };
    });
};
