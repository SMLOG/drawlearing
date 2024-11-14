import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { updateSettings } from './features/settingsSlice';
import SearchDropdown from './SearchDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook,faBars  } from '@fortawesome/free-solid-svg-icons';
const TopNave = ({toggleSettings}) => {
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

 
    const toggleBooks = ()=>{
        dispatch(updateSettings({showBooks:!settings.showBooks}));
    }
    return (
        <div style={{ position: 'relative',display:'flex',justifyContent: "space-between",margin:'0' }}>
            <div style={{flexGrow:1}}><SearchDropdown/></div>
            <div style={{minWidth:'20px',margin:'5px'}}> <FontAwesomeIcon icon={faBook} size="1x" onClick={toggleBooks} /></div>
        </div>
    );
};

export default TopNave;
