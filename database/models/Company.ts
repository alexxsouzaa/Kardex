import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, nochange } from '@nozbe/watermelondb/decorators';

export default class Company extends Model {
    static table = 'companies';

    @nochange @field('remote_id')   remoteId!:   string | null;
    @text('name')                   name!:        string;
    @field('plan')                  plan!:        string; // free | pro
    @nochange @field('owner_id')    ownerId!:     string;
    @readonly @date('created_at')   createdAt!:   Date;
    @date('updated_at')             updatedAt!:   Date;
    @field('is_deleted')            isDeleted!:   boolean;
}