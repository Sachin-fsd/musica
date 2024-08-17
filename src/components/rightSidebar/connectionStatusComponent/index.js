'use client'

import { UserContext } from '@/context'
import { Speaker, Wifi } from 'lucide-react'
import React, { useContext } from 'react'

const ConnectionStatus = () => {
    const {connectionStatus} = useContext(UserContext)
    return (
        <div className="flex p-3 justify-between items-center text-white bg-purple-800 rounded-lg">
            <Wifi className='w-5 h-5' />
            <p className="text-xs">Connection Status: {connectionStatus}</p>
            <Speaker className='w-5 h-5' />
        </div>
    )
}

export default ConnectionStatus