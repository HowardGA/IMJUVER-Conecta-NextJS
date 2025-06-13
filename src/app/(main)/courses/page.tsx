'use client';
import Hero from "@/components/ui/Hero";
import CourseHeroImg from '../../../../public/courses-hero.png';
import CoursesGrid from './components/CoursesGrid';
import React, {useEffect, useState, useMemo} from 'react';
import { useGetCourses } from '@/hooks/useCourses';
import CourseToolbar from "./components/CourseToolbar";
import { useRouter } from 'next/navigation';

const Courses: React.FC = () => {
    const {data: courses, isLoading, isError, error} = useGetCourses();
    const [searchText, setSearchText] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isError) {
            console.error("Error fetching courses:", error);
        }
    }, [isError, error]);

    const filteredCourses = useMemo(() => {
        if (!courses) return [];
        let currentCourses = courses;
        if (searchText) {
            currentCourses = currentCourses.filter(course =>
                course.titulo.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (selectedCategory !== null) {
            currentCourses = currentCourses.filter(course =>
                course.categoria?.cat_cursos_id === selectedCategory
            );
        }
        return currentCourses;
    }, [courses, searchText, selectedCategory]);

    const handleSearch = (text: string) => {
        setSearchText(text);
    };

    const handleCategoryChange = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
    };

    const handleAddCourse = () => {
        router.push('courses/create')
    };

if (isLoading) {
        return (
            <>
                <Hero
                    title="Descubre todos los cursos que se tienen preparados para ti"
                    subTitle="Puedes cursar tantos cursos como desees."
                    imageSrc={CourseHeroImg}
                />
                <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    Cargando cursos...
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <Hero
                    title="Descubre todos los cursos que se tienen preparados para ti"
                    subTitle="Puedes cursar tantos cursos como desees."
                    imageSrc={CourseHeroImg}
                />
                <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: 'red' }}>
                    Ocurrió un error al cargar los cursos: {error?.message || 'Error desconocido'}
                </div>
            </>
        );
    }

    return (
        <>
            <Hero
                title="Descubre todos los cursos que se tienen preparados para ti"
                subTitle="Puedes cursar tantos cursos como desees."
                imageSrc={CourseHeroImg}
            />
            <CourseToolbar
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                onAddCourse={handleAddCourse}
            />
            <CoursesGrid courses={filteredCourses || []} pageSize={8} />
        </>
    );
}


export default Courses;