import { PaginationConfig } from "./PaginationConfig";

export class QueryConfig {
    private readonly _include: string;
    private readonly _exclude: string;
    private readonly _filter: string;
    private readonly _sort: string;
    private readonly _fields: string;
    private readonly _pagination: PaginationConfig;

    public constructor(include = "include", exclude = "exclude", filter = "filter", sort = "sort", fields = "fields", pagination?: PaginationConfig) {
        this._include = include;
        this._exclude = exclude;
        this._filter = filter;
        this._sort = sort;
        this._fields = fields;
        this._pagination = pagination === undefined ? new PaginationConfig() : pagination;
    }

    get fields(): string {
        return this._fields;
    }

    get sort(): string {
        return this._sort;
    }

    get filter(): string {
        return this._filter;
    }

    get exclude(): string {
        return this._exclude;
    }

    get include(): string {
        return this._include;
    }

    get pagination(): PaginationConfig {
        return this._pagination;
    }
}