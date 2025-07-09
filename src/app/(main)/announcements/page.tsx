'use client';

import React, {useState, useMemo} from 'react';
import AnnoucementsToolbar from "./components/AnnouncementsToolbar";
import AnnouncementGrid from "./components/AnnouncementGrid";
import Hero from "@/components/ui/Hero";
import EventsHero from '../../../../public/events.png'; 
import { useGetAllAnnouncements, useGetFeaturedAnnouncements } from "@/hooks/announcementHooks"; 
import { Spin, Alert } from 'antd';
import { GetPublicacionesFilters } from "@/interfaces/announcementInterface";
import CreateAnnouncementModal from './components/CreateAnnouncementModal';
import { motion } from 'framer-motion';
import FeaturedAnnouncementsCarousel from './components/FeaturedAnnouncementsCarousel';

const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const AnnouncementPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); 


    const queryFilters: GetPublicacionesFilters = useMemo(() => ({
        visible: true,
        searchTerm: searchTerm,
        cat_pub_id: selectedCategoryId,
    }), [searchTerm, selectedCategoryId]); 

    const {
        data: announcements,
        isLoading,
        error: announcementError,
        refetch
    } = useGetAllAnnouncements(queryFilters); 

    const {
        data: featuredAnnouncements,
        isLoading: isLoadingFeatured,
        error: featuredError
    } = useGetFeaturedAnnouncements();

     const handleAddAnnouncementClick = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
    };

    const handleCreateModalSuccess = () => {
        refetch();
    };


    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (announcementError) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Error al cargar anuncios"
                    description={`No pudimos cargar los eventos. Por favor, intenta de nuevo. Detalles: ${announcementError.message}`}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <>
            <Hero title="Anuncios y eventos proximos" subTitle="Acompañanos y se parte de nuestros eventos" imageSrc={EventsHero}/>
            <FeaturedAnnouncementsCarousel
                announcements={featuredAnnouncements || []}
                isLoading={isLoadingFeatured}
                error={featuredError}
            />
             <AnnoucementsToolbar
                onSearchChange={setSearchTerm}
                onCategoryChange={setSelectedCategoryId}
                onAddAnnouncementClick={handleAddAnnouncementClick}
            />
            <motion.div
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnnouncementGrid announcements={announcements || []}/> 
            </motion.div>
             <CreateAnnouncementModal
                visible={isCreateModalVisible}
                onClose={handleCreateModalClose}
                onSuccess={handleCreateModalSuccess}
            />
        </>
    );
}

export default AnnouncementPage;