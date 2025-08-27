"use client"
import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
import { useSearchStore } from '@/store/useSearchStore'

const SearchInput = () => {
    const { searchQuery, setIsLoading, setSearchQuery, isLoading } = useSearchStore();
    return (
        <div className='mt-[10%] mb-10 w-[50%] mx-auto flex items-center relative'>
            <div
                className="absolute inset-y-0 left-0 flex items-center pl-4 cursor-pointer z-10"
                aria-label="Search"
            >
                <Search className="text-white dark:text-white hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200" />
            </div>
            <Input onInput={(e)=>setSearchQuery(e.target.value)} className="pl-12 h-20 py-4 text-xl" placeholder="Search for songs, artists or albums..." />
        </div>
    )
}

export default SearchInput