import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, nochange } from '@nozbe/watermelondb/decorators';

export default class Movement extends Model {
    static table = 'movements';

    @nochange @field('remote_id')   remoteId!:   string | null;
    @nochange @field('company_id')  companyId!:  string;
    @nochange @field('product_id')  productId!:  string;
    @nochange @field('type')        type!:        string; // in | out | adjust
    @nochange @field('quantity')    quantity!:    number;
    @field('note')                  note!:        string | null;
    @field('created_by')            createdBy!:   string | null;
    @readonly @date('created_at')   createdAt!:   Date;
    @field('is_deleted')            isDeleted!:   boolean;
}