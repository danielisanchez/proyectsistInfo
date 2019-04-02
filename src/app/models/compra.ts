import {Product} from "./product"
export class Compra {
    id: string;
    uid: string;
    product: Product[] = [];
    amount: number;
    created_at: string;
}