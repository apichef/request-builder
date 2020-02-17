import { HttpMethod } from './HttpMethod'

export class RequestConfig {
    private readonly _url: string;
    private readonly _method: HttpMethod;
    private readonly _data: any;

    constructor(url: string, method = HttpMethod.GET, data?: any) {
        this._url = url;
        this._method = method;
        this._data = data;
    }

    get url(): string {
        return this._url;
    }

    get method(): HttpMethod {
        return this._method;
    }

    get data(): any {
        return this._data;
    }
}