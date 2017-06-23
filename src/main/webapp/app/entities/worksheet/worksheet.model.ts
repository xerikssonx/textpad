import { BaseEntity, User } from './../../shared';

export class Worksheet implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public user?: User,
    ) {
    }
}
