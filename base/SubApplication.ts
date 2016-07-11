import Application, {Stores} from './Application';

export default class SubApplication<T extends Stores> extends Application<T> {
    title: string;
}