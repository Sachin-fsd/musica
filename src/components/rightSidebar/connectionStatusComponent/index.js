'use client'

import { UserContext } from '@/context'
import { Speaker, Wifi, WifiHigh, WifiLow, WifiZero } from 'lucide-react'
import React, { useContext } from 'react'

const ConnectionStatus = () => {
    const { connectionStatus } = useContext(UserContext)
    return (
        <div className="flex p-3 justify-between items-center text-white bg-purple-800 rounded-lg">
            {connectionStatus === "Great" && <Wifi className='w-5 h-5' />}
            {connectionStatus === "Best" && <Wifi className='w-5 h-5' />}
            {connectionStatus === "Good" && <WifiHigh className='w-5 h-5' />}
            {connectionStatus === "Bad" && <WifiLow className='w-5 h-5' />}
            {connectionStatus === "Worst" && <WifiZero className='w-5 h-5' />}


            <p className="text-xs">Connection Status: {connectionStatus}</p>
            <Speaker className='w-5 h-5' />
        </div>
    )
}

export default ConnectionStatus