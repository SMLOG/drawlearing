import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from './features/settingsSlice';

const Settings = ({ onClose ,settings}) => {

  const contentRef = useRef(null);
  const maskRef = useRef(null);
  useEffect(()=>{
    const handleOutSide = (event)=>{
      if(!contentRef.current?.contains(event.target) && maskRef.current.contains(event.target)){
        onClose();
      }
    }
    document.addEventListener('click',handleOutSide);
    return ()=>{
      document.removeEventListener('click',handleOutSide)
    }
  },[]);
  const categories = [
    { name: 'Draw', component: <DrawSettings /> },
    { name: 'Video', component: <VideoSettings /> },
    { name: 'Track', component: <TrackSettings /> },
    { name: 'Game', component: <GameSettings /> },
    { name: 'Word', component: <WordSettings /> },
  ];


  return (
    <div ref={maskRef} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2000,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div  ref={contentRef}
        style={{
        maxWidth: '80%',
        margin: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        maxHeight: "100%",
        overflow: "auto",
      }}>
        {/* Sticky header with title and close button */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#f9f9f9',
          padding: '10px 0',
          zIndex: 10,
          textAlign: 'left',
        }}>
          <h2 style={{ display: 'inline', margin: '0' }}>Settings</h2>
          <button 
            onClick={onClose}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#aaa',
            }}
          >
            &times; {/* Close icon */}
          </button>
        </div>

        <div style={{ textAlign: 'left' }}>
          {categories.map((category) => (
            <div key={category.name}>
              <div style={{display:'flex'}}>
                <h3>{category.name}</h3>
                <input type="checkbox" defaultChecked={settings[category.name]?.enabled} />
              </div>
              {category.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// DrawSettings Component
const DrawSettings = () => {
  const settings = useSelector((state) => state.settings);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const handleUpdateSettings = () => {
    dispatch(updateSettings({Draw:{isShowGrid:!settings.Draw.isShowGrid}}));
    };
  const items = [
    { name: 'Pencil', enabled: true },
    { name: 'Brush', enabled: true },
    { name: 'Eraser', enabled: true },
  ];

  return (
    <div style={{ marginLeft: '20px' }}>
      <div>
        Show Lines:<input type="checkbox" defaultChecked={settings.Draw.isShowGrid} onChange={handleUpdateSettings}/>
        {settings.Draw.isShowGrid&&<div style={{display:'flex'}}><div>3 Lines <input type="radio" name="linetype" value={settings.Draw.lineType} /></div><div>4 Lines <input type="radio" name="linetype" value={settings.Draw.lineType}/></div></div>}
      </div>
      {items.map((item) => (
        <div key={item.name}>
          <label>
            <input type="checkbox" defaultChecked={item.enabled}  />
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );
};

// VideoSettings Component
const VideoSettings = () => {
  const items = [
    { name: 'Playback', enabled: true },
    { name: 'Resolution', enabled: true },
    { name: 'Volume', enabled: true },
  ];

  return (
    <div style={{ marginLeft: '20px' }}>
      {items.map((item) => (
        <div key={item.name}>
          <label>
            <input type="checkbox" defaultChecked={item.enabled} />
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );
};

// TrackSettings Component
const TrackSettings = () => {
  const items = [
    { name: 'GPS', enabled: true },
    { name: 'Speed', enabled: true },
    { name: 'Distance', enabled: true },
  ];

  return (
    <div style={{ marginLeft: '20px' }}>
      {items.map((item) => (
        <div key={item.name}>
          <label>
            <input type="checkbox" defaultChecked={item.enabled} />
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );
};

// GameSettings Component
const GameSettings = () => {
  const items = [
    { name: 'Level', enabled: true },
    { name: 'Score', enabled: true },
    { name: 'Achievements', enabled: true },
  ];

  return (
    <div style={{ marginLeft: '20px' }}>
      {items.map((item) => (
        <div key={item.name}>
          <label>
            <input type="checkbox" defaultChecked={item.enabled} />
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );
};

// WordSettings Component
const WordSettings = () => {
  const items = [
    { name: 'Font', enabled: true },
    { name: 'Size', enabled: true },
    { name: 'Style', enabled: true },
  ];

  return (
    <div style={{ marginLeft: '20px' }}>
      {items.map((item) => (
        <div key={item.name}>
          <label>
            <input type="checkbox" defaultChecked={item.enabled} />
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Settings;
