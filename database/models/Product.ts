import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, nochange } from '@nozbe/watermelondb/decorators';

export default class Product extends Model {
    static table = 'products';

    @nochange @field('remote_id')   remoteId!:    string | null;
    @nochange @field('company_id')  companyId!:   string;
    @text('name')                   name!:         string;
    @field('ean_code')              eanCode!:      string | null;
    @field('lote')                  lote!:         string | null;
    @field('quantity')              quantity!:     number;
    @field('unit')                  unit!:         string | null;
    @field('packaging')             packaging!:    string | null;
    @field('value')                 value!:        number;
    @field('expiry_date')           expiryDate!:   string | null;
    @field('category')              category!:     string | null;
    @field('type')                  type!:         string | null;
    @field('brand')                 brand!:        string | null;
    @field('supplier')              supplier!:     string | null;
    @field('images')                imagesRaw!:    string | null; // ← renomeado
    @field('created_by')            createdBy!:    string | null;
    @readonly @date('created_at')   createdAt!:    Date;
    @date('updated_at')             updatedAt!:    Date;
    @field('is_deleted')            isDeleted!:    boolean;

    // Getter para ler imagens como array
    get images(): string[] {
        try {
            return this.imagesRaw ? JSON.parse(this.imagesRaw) : [];
        } catch {
            return [];
        }
    }
}