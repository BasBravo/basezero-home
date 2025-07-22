//
// INTERFACES
//
export interface iApi {
    _headers: Headers;
    _config: any;
    _initialize: () => void;
    _generateHeaders: () => Promise<void>;
    request: (path: string, options: any) => Promise<any>;
}
//
// EXPORT
//
export const createApi = () => {
    const api: any = {
        _headers: new Headers(),
        _config: null,

        _initialize() {},

        async _generateHeaders() {
            api._initialize();
            api._headers.set('Content-Type', 'application/json');
            api._headers.set('Accept', 'application/json');
            let token = null;

            // if (sessionStorage.getItem('idToken')) token = sessionStorage.getItem('idToken');
            // else {
            //     token = (await auth.getToken()) || null;
            //     if (token) sessionStorage.setItem('idToken', token);
            // }

            if (token) api._headers.set('Authorization', `Bearer ${token}`);
        },

        async request(url: string, options: any): Promise<any> {
            api._initialize();

            await api._generateHeaders();

            if (options.contentType) api._headers.set('Content-Type', options.contentType);
            if (options.accept) api._headers.set('Accept', options.accept);

            const optionsFetch: any = {
                method: options.method ?? 'GET',
                headers: api._headers,
            };

            if (options.credentials) {
                optionsFetch.credentials = options.credentials;
            }

            if (options.body) {
                if (api._headers.get('Content-Type') == 'application/json') optionsFetch.body = JSON.stringify(options.body);
                else optionsFetch.body = options.body;
            }

            if (options.query) {
                url += '?';
                for (const key in options.query) {
                    url += `${key}=${options.query[key]}&`;
                }
                url = url.slice(0, -1);
            }

            return fetch(url, optionsFetch)
                .then(async response => {
                    const type = response.headers.get('content-type');

                    if (response.ok) {
                        // 204 - No Content
                        if (response.status === 204) {
                            return { success: true, data: {} };
                        }

                        // 200 - OK
                        if (response.status === 200) {
                            if (type && type.includes('application/json')) {
                                const data = await response.json();
                                return { success: true, data };
                            }

                            if (
                                type &&
                                (type.includes('application/pdf') || type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || type.includes('application/vnd.ms-excel'))
                            ) {
                                return new Response(await response.blob());
                            }

                            return { success: true, data: await response.text() };
                        }
                    } else {
                        // 401 - Unauthorized
                        if (response.status === 401) {
                            // const authStore = useAuthStore();
                            // authStore.clear();
                            // location.href = '/auth/logout';
                            return { success: false, message: response.statusText, code: 401 };
                        }

                        if (type && type.includes('application/json')) {
                            const error = await response.json();

                            return { success: false, message: error.message, code: error.statusCode };
                        }

                        if (type && type.includes('text/html')) {
                            const error = await response.text();
                            return { success: false, message: error, code: response.status };
                        }

                        //404 - Not Found, 403 - Forbidden, 400 - Bad Request, ...
                        return { success: false, message: response.statusText, code: response.status };
                    }
                })
                .catch(error => {
                    console.groupEnd();
                    return { success: false, message: error.message, code: 500 };
                });
        },
    };

    return api;
};
