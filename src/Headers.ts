import {
    Metadata,
} from '@t2ee/core';

function Headers(key: string, value: string)
function Headers(headers: {[key: string]: string})
function Headers(keyOrHeaders: string | {[key: string]: string}, value?: string) {
    return (target: Object, key: string) => {
        const headers = Metadata.get(`t2ee:restful:method:${key}:headers`, target) || {};
        if (typeof keyOrHeaders === 'string') {
            headers[keyOrHeaders] = value;
        } else {
            for (const key in keyOrHeaders) {
                headers[key] = keyOrHeaders[key];
            }
        }

        Metadata.set(`t2ee:restful:method:${key}:headers`, headers, target);
    }
}

export default Headers;
