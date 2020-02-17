export class PaginationConfig {
    private readonly _name: string;
    private readonly _page: string;
    private readonly _size: string;

    public constructor(name = "page", page = "number", size = "size") {
        this._name = name;
        this._page = page;
        this._size = size;
    }

    get size(): string {
        return this._size;
    }

    get page(): string {
        return this._page;
    }

    get name(): string {
        return this._name;
    }
}