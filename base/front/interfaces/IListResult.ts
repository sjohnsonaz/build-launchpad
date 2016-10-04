import {IData} from './IData';

export interface IListResult<T extends IData<any>> {
    DataList: T[];
    TotalCount: number
}
