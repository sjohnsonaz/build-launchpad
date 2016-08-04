import {observable, computed} from 'mobx';

import CrudApplication, {CrudStores} from '../base/front/CrudApplication';

import UserStore from '../stores/UserStore';
import User from '../models/User';

export interface UserStores extends CrudStores<UserStore> { }

export default class UserState extends CrudApplication<UserStores, UserStore, User> {
}
