import {
    Metadata,
} from '@t2ee/core';

export default function Method(method: string) {
    return (url: string) => {
        return (target: Object, key: string) => {
            const methods = Metadata.get('t2ee:restful:method', target) || {};
            methods[key] = { method, url};
            Metadata.set('t2ee:restful:method', methods, target);
        };
    };
}
