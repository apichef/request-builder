import { Builder, RequestConfig } from "../src";

export default class Api extends Builder {
    request(config: RequestConfig): Promise<any> {
        return Promise.resolve({
            url: config.url,
            method: config.method,
            data: config.data
        });
    }
}