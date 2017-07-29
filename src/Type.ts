import {
    Metadata,
} from '@t2ee/core';

export default function Param(type: string) {
    return (target: Object, key: string) => {
        Metadata.set(`t2ee:restful:method:${key}:type`, type, target);
    };
}
