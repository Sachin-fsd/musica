'use client'
import { UserContext } from '@/context';
import React, { useContext } from 'react'
import JamComponent from '.';

const JamPage = () => {
    const { isJamChecked } = useContext(UserContext);
    if (isJamChecked) {
        return <JamComponent />
    } else {
        return null;
    }
}

export default JamPage