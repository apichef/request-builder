import { SortDirection } from "./SortDirection";

export class SortField {
    private readonly _name: string;
    private readonly _direction: SortDirection;

    constructor (name: string, direction = SortDirection.ASC) {
        this._name = name;
        this._direction = direction;
    }

    get name(): string {
        return this._name;
    }

    get direction(): SortDirection {
        return this._direction;
    }
}