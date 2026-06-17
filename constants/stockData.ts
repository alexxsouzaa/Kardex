import { Bag, Heart, Milk, Drop } from "iconsax-react-native";

export type StockItem = {
    id: string;
    name: string;
    eanCode: string;
    quantity: number;
    value: number;
    unit: string;
    category?: string;
    type?: string;
    icon?: any;
    brand?: string;
    supplier?: string;
    images?: string[];
};

export const CATEGORY_ICONS: Record<string, any> = {
    'Alimento': Bag,
    'Bebida':   Milk,
    'Limpeza':  Drop,
    'Higiene':  Heart,
};

export const LOW_STOCK_THRESHOLD = 5;

export const STOCK_DATA: StockItem[] = [
    {
        id: '1', name: 'Arroz Branco', eanCode: '3800065711135', quantity: 874, value: 125.99, unit: 'Quilos',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            'https://images.unsplash.com/photo-1536304993881-ff86e0c9b589?w=400',
        ],
    },
    {
        id: '2', name: 'Feijão Preto', eanCode: '5000112529043', quantity: 3, value: 18.50, unit: 'Quilos',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        ],
    },
    {
        id: '3', name: 'Azeite', eanCode: '11223344', quantity: 0, value: 45.00, unit: 'Litros',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        ],
    },
    {
        id: '4', name: 'Macarrão', eanCode: '55667788', quantity: 2, value: 8.90, unit: 'Pacotes',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400',
            'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        ],
    },
    {
        id: '5', name: 'Pão', eanCode: '55667799', quantity: 2, value: 8.90, unit: 'Pacotes',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
            'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400',
        ],
    },
    {
        id: '6', name: 'Biscoito', eanCode: '55667800', quantity: 2, value: 8.90, unit: 'Pacotes',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
            'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
        ],
    },
    {
        id: '7', name: 'Leite Integral', eanCode: '78912345', quantity: 15, value: 6.50, unit: 'Litros',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        ],
    },
    {
        id: '8', name: 'Açúcar Refinado', eanCode: '78954321', quantity: 10, value: 4.20, unit: 'Quilos',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400',
            'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400',
        ],
    },
    {
        id: '9', name: 'Café em Pó', eanCode: '78961234', quantity: 5, value: 12.90, unit: 'Pacotes',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        ],
    },
    {
        id: '10', name: 'Óleo de Soja', eanCode: '78971234', quantity: 20, value: 7.80, unit: 'Litros',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
            'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400',
        ],
    },
    {
        id: '11', name: 'Sal Refinado', eanCode: '78981234', quantity: 8, value: 2.50, unit: 'Quilos',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=400',
            'https://images.unsplash.com/photo-1571680322279-a226e6a4cc0a?w=400',
        ],
    },
    {
        id: '12', name: 'Farinha de Trigo', eanCode: '78991234', quantity: 12, value: 5.50, unit: 'Quilos',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
            'https://images.unsplash.com/photo-1600398138360-2f2c90a37e1a?w=400',
        ],
    },
    {
        id: '13', name: 'Detergente', eanCode: '78901235', quantity: 4, value: 3.80, unit: 'Frascos',
        icon: CATEGORY_ICONS['Limpeza'], category: 'Limpeza', type: 'Químico',
        images: [
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
            'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
        ],
    },
    {
        id: '14', name: 'Sabão em Pó', eanCode: '78901236', quantity: 7, value: 25.00, unit: 'Caixas',
        icon: CATEGORY_ICONS['Limpeza'], category: 'Limpeza', type: 'Químico',
        images: [
            'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        ],
    },
    {
        id: '15', name: 'Amaciante', eanCode: '78901237', quantity: 2, value: 15.90, unit: 'Litros',
        icon: CATEGORY_ICONS['Limpeza'], category: 'Limpeza', type: 'Químico',
        images: [
            'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
        ],
    },
    {
        id: '16', name: 'Papel Higiênico', eanCode: '78901238', quantity: 1, value: 18.00, unit: 'Pacotes',
        icon: CATEGORY_ICONS['Higiene'], category: 'Higiene', type: 'Descartável',
        images: [
            'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400',
            'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400',
        ],
    },
    {
        id: '17', name: 'Creme Dental', eanCode: '78901239', quantity: 6, value: 4.50, unit: 'Tubos',
        icon: CATEGORY_ICONS['Higiene'], category: 'Higiene', type: 'Cosmético',
        images: [
            'https://images.unsplash.com/photo-1559591937-5a0452d90748?w=400',
            'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400',
        ],
    },
    {
        id: '18', name: 'Sabonete', eanCode: '78901240', quantity: 25, value: 2.20, unit: 'Unidades',
        icon: CATEGORY_ICONS['Higiene'], category: 'Higiene', type: 'Cosmético',
        images: [
            'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400',
            'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400',
        ],
    },
    {
        id: '19', name: 'Shampoo', eanCode: '78901241', quantity: 3, value: 14.50, unit: 'Frascos',
        icon: CATEGORY_ICONS['Higiene'], category: 'Higiene', type: 'Cosmético',
        images: [
            'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400',
            'https://images.unsplash.com/photo-1526758097130-bab247274f58?w=400',
        ],
    },
    {
        id: '20', name: 'Condicionador', eanCode: '78901242', quantity: 3, value: 16.50, unit: 'Frascos',
        icon: CATEGORY_ICONS['Higiene'], category: 'Higiene', type: 'Cosmético',
        images: [
            'https://images.unsplash.com/photo-1526758097130-bab247274f58?w=400',
            'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400',
        ],
    },
    {
        id: '21', name: 'Esponja de Aço', eanCode: '78901243', quantity: 10, value: 5.90, unit: 'Pacotes',
        icon: CATEGORY_ICONS['Limpeza'], category: 'Limpeza', type: 'Utensílio',
        images: [
            'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        ],
    },
    {
        id: '22', name: 'Pano de Prato', eanCode: '78901244', quantity: 5, value: 8.00, unit: 'Unidades',
        icon: CATEGORY_ICONS['Limpeza'], category: 'Limpeza', type: 'Utensílio',
        images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400',
        ],
    },
    {
        id: '23', name: 'Bolacha Recheada', eanCode: '78901245', quantity: 0, value: 3.50, unit: 'Pacotes',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
            'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
        ],
    },
    {
        id: '24', name: 'Refrigerante 2L', eanCode: '78901246', quantity: 15, value: 9.90, unit: 'Garrafas',
        icon: CATEGORY_ICONS['Bebida'], category: 'Bebida', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
            'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=400',
        ],
    },
    {
        id: '25', name: 'Suco de Caixa', eanCode: '78901247', quantity: 8, value: 5.50, unit: 'Litros',
        icon: CATEGORY_ICONS['Bebida'], category: 'Bebida', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
            'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400',
        ],
    },
    {
        id: '26', name: 'Água Mineral', eanCode: '78901248', quantity: 50, value: 2.50, unit: 'Garrafas',
        icon: CATEGORY_ICONS['Bebida'], category: 'Bebida', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
            'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400',
        ],
    },
    {
        id: '27', name: 'Chocolate em Barra', eanCode: '78901249', quantity: 12, value: 6.90, unit: 'Unidades',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Não Perecível',
        images: [
            'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
            'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',
        ],
    },
    {
        id: '28', name: 'Iogurte Natural', eanCode: '78901250', quantity: 4, value: 3.20, unit: 'Potes',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
            'https://images.unsplash.com/photo-1571212515416-fca325698e79?w=400',
        ],
    },
    {
        id: '29', name: 'Manteiga', eanCode: '78901251', quantity: 2, value: 12.50, unit: 'Potes',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
            'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
        ],
    },
    {
        id: '30', name: 'Queijo Mussarela', eanCode: '78901252', quantity: 1, value: 45.90, unit: 'Quilos',
        icon: CATEGORY_ICONS['Alimento'], category: 'Alimento', type: 'Perecível',
        images: [
            'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
            'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400',
        ],
    },
];