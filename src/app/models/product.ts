import {Variacion} from './variacion'

export class Product {
    id?: string;
    name: string;
    price: number;
    department: string;
    description: string;
    photoUrl: string;
    variaciones?: Variacion[];   
    sold: number;     
}