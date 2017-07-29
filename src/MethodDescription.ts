interface MethodDescription {
    url: string;
    method: string;
    parameter: [{
        key: string,
        index: number,
        type: string,
    }];
    headers: {[key: string]: string };
    type: string;
}

export default MethodDescription;
