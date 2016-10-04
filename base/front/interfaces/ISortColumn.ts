export enum SortDirection {
    DESC = -1,
    NONE = 0,
    ASC = 1
}

export interface ISortColumn {
    name: string;
    direction: SortDirection;
}
