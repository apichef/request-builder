import {RequestConfig} from './RequestConfig'
import {HttpMethod} from "./HttpMethod";
import {IncludeField} from "./IncludeField";
import {FilterField} from "./FilterField";
import {SortField} from "./SortField";
import {ExcludeField} from "./ExcludeField";
import {QueryConfig} from "./QueryConfig";
import {SortDirection} from "./SortDirection";

export abstract class Builder {
    private readonly _resource: string;
    private _config: QueryConfig;
    private _includes: IncludeField[];
    private _excludes: ExcludeField[];
    private _filters: FilterField[];
    private _sorts: SortField[];

    constructor(resource: string, config?: QueryConfig) {
        this._resource = resource;
        this._config = config === undefined ? new QueryConfig() : config;
        this._includes = [];
        this._excludes = [];
        this._filters = [];
        this._sorts = [];
    }

    abstract request (config: RequestConfig): Promise<any>;

    // query api

    public all (): Promise<any> {
        const url = this.appendQueryString(`/${this._resource}`);

        return  this.request(new RequestConfig(url, HttpMethod.GET));
    }

    public get (): Promise<any> {
        return  this.all();
    }

    public find (id?: string): Promise<any> {
        const url = id === undefined ? `/${this._resource}` : `/${this._resource}/${id}`;

        return this.request(new RequestConfig(this.appendQueryString(url), HttpMethod.GET));
    }

    // mutate

    public store (data: any): Promise<any> {
        return this.request(new RequestConfig(`/${this._resource}`, HttpMethod.POST, data))
    }

    // build query

    private appendQueryString (url: string): string {
        const queryParams = new URLSearchParams();

        if (this._includes.length) {
            queryParams.append(this._config.include, this._includes.map((field: IncludeField) => {
                return field.name;
            }).join(','));
        }

        if (this._excludes.length) {
            queryParams.append(this._config.exclude, this._excludes.map((field: ExcludeField) => {
                return field.name;
            }).join(','));
        }

        if (this._filters.length) {
            this._filters.forEach((field: FilterField) => {
                let value = ''

                if (field.value !== undefined) {
                    value = field.value
                }

                queryParams.append(`${this._config.filter}[${field.name}]`, value)
            })
        }

        if (this._sorts.length) {
            const sorts = this._sorts.map((field: SortField) => {
                return field.direction === SortDirection.DESC ? `-${field.name}` : field.name
            }).join(',');

            queryParams.append(this._config.sort, sorts)
        }

        const queryString = queryParams.toString()

        if (queryString.length) {
            return `${url}?${queryString}`
        }

        return url
    }

    public with (relations: string | string[]) {
        if (Array.isArray(relations)) {
            this._includes = this._includes.concat(relations.map(include => {
                return new IncludeField(include);
            }))

            return this;
        }

        this._includes.push(new IncludeField(relations))

        return this
    }

    public without (relations: string | string[]) {
        if (Array.isArray(relations)) {

            this._excludes = this._excludes.concat(relations.map(include => {
                return new ExcludeField(include);
            }))

            return this;
        }

        this._excludes.push(new ExcludeField(relations))

        return this
    }

    public where (field: string, value?: any) {
        this._filters.push(new FilterField(field, value));

        return this
    }

    public orderBy (field: string, direction = SortDirection.ASC) {
        this._sorts.push(new SortField(field, direction))

        return this
    }

    public orderByDesc (field: string) {
        return this.orderBy(field, SortDirection.DESC)
    }
}
