import {
    Metadata,
} from '@t2ee/core';
import RestfulClient from './RestfulClient';
import MethodDescription from './MethodDescription';

export default class RestfulService {
    private _baseUrl: string = '';
    private _headers: {[key: string]: string} = {};
    private _params: {[key: string]: string} = {};
    private _query: {[key: string]: string} = {};
    private _json: {[key: string]: any} = {};
    private _fields: {[key: string]: string} = {};

    public baseUrl(url: string): RestfulService {
        this._baseUrl = url;
        return this;
    }

    public header(key: string, value: string): RestfulService {
        this._headers[key] = value;
        return this;
    }

    public headers(headers: {[key: string]: string}): RestfulService {
        for (const key in headers) {
            this._headers[key] = headers[key];
        }
        return this;
    }

    public param(key: string, value: string): RestfulService {
        this._params[key] = value;
        return this;
    }

    public params(params: {[key: string]: string}): RestfulService {
        for (const key in params) {
            this._params[key] = params[key];
        }
        return this;
    }

    public field(key: string, value: string): RestfulService {
        this._fields[key] = value;
        return this;
    }

    public fields(fields: {[key: string]: string}): RestfulService {
        for (const key in fields) {
            this._fields[key] = fields[key];
        }
        return this;
    }

    public query(key: string, value: string): RestfulService
    public query(query: {[key: string]: string}): RestfulService
    public query(keyOrQuery: string | {[key: string]: string}, value?: string): RestfulService {
        if (typeof keyOrQuery === 'string') {
            this._query[keyOrQuery] = value;
        } else {
            for (const key in keyOrQuery) {
                this._query[key] = keyOrQuery[key];
            }
        }
        return this;
    }

    public json(key: string, value: any): RestfulService
    public json(query: {[key: string]: any}): RestfulService
    public json(keyOrQuery: string | {[key: string]: any}, value?: any): RestfulService {
        if (typeof keyOrQuery === 'string') {
            this._query[keyOrQuery] = value;
        } else {
            for (const key in keyOrQuery) {
                this._query[key] = keyOrQuery[key];
            }
        }
        return this;
    }

    public create<T>(service: new (...args) => T): T {
        const description = this.extract(service);
        return new Proxy({} as any, new RestfulClient(
            description,
            this._baseUrl,
            this._headers,
            this._params,
            this._query,
            this._json,
            this._fields,
        ));
    }

    public extract<T>(service: new (...args) => T): {[key: string]: MethodDescription}  {
        const description: {[key: string]: MethodDescription} = {};
        const methods = Metadata.get('t2ee:restful:method', service.prototype);
        for (const key in methods) {
            const parameter = Metadata.get(`t2ee:restful:method:${key}`, service.prototype) || [];
            const headers = Metadata.get(`t2ee:restful:method:${key}:headers`, service.prototype) || {};
            description[key] = {
                method: methods[key].method.toLowerCase(),
                url: methods[key].url,
                parameter,
                headers,
                type: Metadata.get(`t2ee:restful:method:${key}:type`, service.prototype) || 'json',
            };
        }
        return description;
    }
}
