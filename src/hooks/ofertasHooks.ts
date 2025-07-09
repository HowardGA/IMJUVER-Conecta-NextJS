import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOffers, getOffer, createOffer, deleteOffer, updateOffer } from '@/services/ofertasServices';
import { CreateOfertaDto, UpdateOfertaDto } from '@/interfaces/ofertaInterface';

export const useGetAllOffers = () => {
  return useQuery({
    queryKey: ['ofertas'],
    queryFn: getAllOffers, 
    staleTime: 1000 * 60 * 5, 
  });
};

export const useGetOffer = (offerId: number) => {
  return useQuery({
    queryKey: ['oferta', offerId], 
    queryFn: () => getOffer(offerId), 
    enabled: !!offerId, 
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedOferta: UpdateOfertaDto) => updateOffer(updatedOferta), 
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
      queryClient.invalidateQueries({ queryKey: ['oferta', variables.of_id] });
    },
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:  (newOferta: CreateOfertaDto) => createOffer(newOferta), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
    },
  });
};