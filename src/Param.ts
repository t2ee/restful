import {
    Metadata,
} from '@t2ee/core';

function Decorator(type: string, paramKey: string) {
    return (target: Object, key: string, index: number) => {
        const parameters = Metadata.get(`t2ee:restful:method:${paramKey}`, target) || [];
        parameters.push({
            key: paramKey,
            index,
            type
        });
        Metadata.set(`t2ee:restful:method:${paramKey}`, parameters, target);
    };
}


export default function Param(type: string) {
    return (paramKey: string) => {
        return (target: Object, key: string, index: number) => {
            const parameters = Metadata.get(`t2ee:restful:method:${key}`, target) || [];
            parameters.push({
                key: paramKey,
                index,
                type
            });
            Metadata.set(`t2ee:restful:method:${key}`, parameters, target);
        };
    }
}
