import apiClient from "@/lib/apiClient";
import { CreateOfertaDto, UpdateOfertaDto } from "@/interfaces/ofertaInterface";

export const getAllOffers = async() => {
    const response = await apiClient.get('/ofertas/');
    return response.data;
}

export const getOffer = async(offerId:number) => {
    const response = await apiClient.get(`/ofertas/single/${offerId}`);
    return response.data;
}

export const createOffer = async(offer:CreateOfertaDto) => {
    const response = await apiClient.post('/ofertas/', offer);
    return response.data;
}

export const updateOffer = async(offer:UpdateOfertaDto) => {
    const response = await apiClient.put(`/ofertas/${offer.of_id}`, offer);
    return response.data;
}

export const deleteOffer = async(offerId:number) => {
    const response = await apiClient.delete(`/ofertas/${offerId}`);
    return response.data;
}


