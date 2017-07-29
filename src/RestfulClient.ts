import MethodDescription from './MethodDescription';
import * as http from 'superagent';

export default class RestfulClient<T extends Object> implements ProxyHandler<T> {
    public constructor(
        private descriptions: {[key: string]: MethodDescription},
        private url: string,
        private headers: {[key: string]: string},
        private params: {[key: string]: string},
        private query: {[key: string]: string},
        private json: {[key: string]: any},
        private fields: {[key: string]: string},
    ) {
        if (url[url.length - 1] === '/') {
            this.url = url.substr(0, url.length - 1);
        }
    }

    get(target: any, key: PropertyKey, receiver: any) {
        const description = this.descriptions[key];
        return async (...params) => {
            const method : 'get' | 'post' | 'put' | 'del' = description.method as any;
            let url = description.url;
            if (url[0] === '/') {
                url = url.substr(1);
            }
            const query: {[key: string]: string } = this.query;
            const headers: {[key: string]: string } = this.headers;
            const fields: {[key: string]: string } = this.fields;
            const body = this.json || {};
            const parts: {[key: string]: string} = {};

            for (const key in this.params) {
                url = url.replace(`{${key}}`, this.params[key]);
            }

            for (const key in description.headers) {
                headers[key] = description.headers[key];
            }

            for (const param of description.parameter) {
                switch (param.type) {
                    case 'path':
                        url = url.replace(`{${param.key}}`, params[param.index]);
                        break;
                    case 'query':
                        query[param.key] = params[param.index];
                        break;
                    case 'query-map': {
                        const map = params[param.index] || {};
                        for (const key in map) {
                            query[key] = map[key];
                        }
                        break;
                    }
                    case 'body':{
                        const map = params[param.index] || {};
                        for (const key in map) {
                            body[key] = map[key];
                        }
                        break;
                    }
                    case 'header':
                        headers[param.key] = params[param.index];
                        break;
                    case 'header-map': {
                        const map = params[param.index] || {};
                        for (const key in map) {
                            headers[key] = map[key];
                        }
                        break;
                    }
                    case 'field':
                        fields[param.key] = params[param.index];
                        break;
                    case 'field-map': {
                        const map = params[param.index] || {};
                        for (const key in map) {
                            fields[key] = map[key];
                        }
                        break;
                    }
                    case 'part':
                        parts[param.key] = params[param.index];
                        break;
                }
            }

            let req = http[method](this.url + '/' + url);
            req = req.query(query);
            req = req.set(headers);

            switch (description.type) {
                case 'json':
                case 'form':
                    req = req.type(description.type).send(body);
                    break;
                case 'part':
                    for (const key in fields) {
                        req = req.field(key, fields[key]);
                    }
                    for (const key in parts) {
                        req = req.attach(key, parts[key]);
                    }
                    break;
            }

            return new Promise((resolve, reject) => {
                req.end((err, res) => {
                    if (err) return reject(err);
                    return resolve(res.body);
                });
            });
        }
    }
}
