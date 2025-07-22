// Función para leer un archivo CSV
export async function readCSV(path) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.send();

    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (xhr.status === 200) {
                const rows = xhr.responseText.split('\n');
                const headers = rows[0].split(',');
                const data = rows.slice(1).map(row => {
                    const values = row.split(',');
                    return headers.reduce((object, curr, i) => {
                        object[curr] = values[i];
                        return object;
                    }, {});
                });
                resolve(data);
            } else {
                // Manejar errores si la solicitud no fue exitosa
                reject('Error al cargar el archivo CSV');
            }
        };
    });
}

export function getFileExtension(file) {
    const fileName = file.name || file;
    const parts = fileName.split('.');
    const extension = parts.length > 1 ? parts.pop().toLowerCase() : '';
    return extension;
}

// Función para convertir datos JavaScript a formato CSV
export function convertToCSV(data, columns) {
    if (!data || data.length === 0) return '';

    // Si no se proporcionan columnas, usar todas las claves del primer objeto
    const keys = columns ? columns.map(col => col.key) : Object.keys(data[0]);
    const headers = columns ? columns.map(col => col.label) : keys;

    // Crear encabezados CSV
    const csvHeaders = headers.map(header => `"${header}"`).join(',');

    // Crear filas CSV
    const csvRows = data.map(row => {
        return keys
            .map(key => {
                const value = row[key];
                // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
                if (value === null || value === undefined) return '""';
                const stringValue = String(value);
                const escapedValue = stringValue.replace(/"/g, '""');
                return `"${escapedValue}"`;
            })
            .join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
}

// Función para descargar datos como CSV (desde datos JavaScript)
export function downloadCSVFromData(data, filename, columns) {
    const csv = convertToCSV(data, columns);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Función para descargar CSV desde respuesta HTTP
export async function downloadCSV(response, filenamePrefix = 'report') {
    try {
        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const blob = new Blob(chunks, { type: 'text/csv;charset=utf-8' });

        // Get filename from Content-Disposition header or use default format
        let filename = '';
        const disposition = response.headers.get('Content-Disposition');
        if (disposition && disposition.includes('filename=')) {
            filename = disposition.split('filename=')[1].replace(/['"]/g, '');
        } else {
            const now = new Date();
            const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
            const hourStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
            filename = `${filenamePrefix}_${dateStr}_${hourStr}.csv`;
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error('Error downloading CSV file: ' + error.message);
    }
}

export function base64ToFile(base64, fileName, mimeType) {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], fileName, { type: mimeType });
}

// Función para convertir datos JavaScript a formato Excel (utilizando una aproximación simple con HTML)
export function convertToExcel(data, columns) {
    if (!data || data.length === 0) return '';

    // Si no se proporcionan columnas, usar todas las claves del primer objeto
    const keys = columns ? columns.map(col => col.key) : Object.keys(data[0]);
    const headers = columns ? columns.map(col => col.label) : keys;

    // Crear encabezados Excel
    const excelHeaders = headers.map(header => `<th>${header}</th>`).join('');

    // Crear filas Excel
    const excelRows = data.map(row => {
        const cells = keys.map(key => {
            const value = row[key];
            if (value === null || value === undefined) return '<td></td>';
            const stringValue = String(value);
            // Escapar caracteres HTML
            const escapedValue = stringValue
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            return `<td>${escapedValue}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    });

    return `
        <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>${excelHeaders}</tr>
                    </thead>
                    <tbody>
                        ${excelRows.join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;
}

// Función para descargar datos como Excel (desde datos JavaScript)
export function downloadExcelFromData(data, filename, columns) {
    const excel = convertToExcel(data, columns);
    const blob = new Blob([excel], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        // Asegurar que el archivo tenga extensión .xls
        const excelFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;
        link.setAttribute('download', excelFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}