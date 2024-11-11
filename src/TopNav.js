import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { updateSettings } from './features/settingsSlice';
import SearchDropdown from './SearchDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook,faBars  } from '@fortawesome/free-solid-svg-icons';
const TopNave = () => {
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

 

    return (
        <div style={{ position: 'relative',display:'flex',justifyContent: "space-between",margin:'5px' }}>
            <div style={{minWidth:'20px'}}><FontAwesomeIcon icon={faBars}  size="1x" /></div>
            <div style={{flexGrow:1}}><SearchDropdown/></div>
            <div style={{minWidth:'20px'}}> <FontAwesomeIcon icon={faBook} size="1x" /></div>
        </div>
    );
};

export default TopNave;
