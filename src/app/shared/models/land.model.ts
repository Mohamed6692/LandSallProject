export interface LandDTO {
    id: string;
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    status?: string;
    areaM2: number;
    price: number;
    sellerId: string;
}