import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPaintBrush, faVideo, faGamepad,faCog } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from './features/settingsSlice';

const ModeSwitchButton = ({ settings,toggleSettings }) => {

  const dispatch = useDispatch();


  const modes = [
    { icon: faMusic, name: 'Track' },
    { icon: faVideo, name: 'Video' },
    { icon: faGamepad, name: 'Game' },
    { icon: faGamepad, name: 'Words' },
  ];

  const handleButtonClick = (mode) => {
    if (mode.name === 'Draw') {
      dispatch(updateSettings({drawEnabled:!settings.drawEnabled}));

    } else {
      // Change current mode for other buttons

      if(settings.currentMode==mode.name)
        dispatch(updateSettings({currentMode:""}));
      else  dispatch(updateSettings({currentMode:mode.name }));

    }
  };

  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          backgroundColor: settings.drawEnabled ? '#388E3C' : '#4CAF50', // Highlight if Draw is enabled
        }}
        onClick={() => toggleSettings()}
      >
        <div style={styles.iconContainer}>
          <FontAwesomeIcon icon={faCog} size="sm" />
          <span style={styles.label}>Setting</span>
        </div>
      </button>

      <button
        style={{
          ...styles.button,
          backgroundColor: settings.drawEnabled ? '#388E3C' : '#4CAF50', // Highlight if Draw is enabled
        }}
        onClick={() => handleButtonClick({ name: 'Draw' })}
      >
        <div style={styles.iconContainer}>
          <FontAwesomeIcon icon={faPaintBrush} size="sm" />
          <span style={styles.label}>Draw</span>
        </div>
      </button>
       
      {/* Buttons for other modes */}
      {modes.map((mode, index) => (
        <button
          key={index}
          style={{
            ...styles.button,
            backgroundColor: mode.name === settings.currentMode ? '#388E3C' : '#4CAF50', // Highlight selected mode
          }}
          onClick={() => handleButtonClick(mode)}
        >
          <div style={styles.iconContainer}>
            <FontAwesomeIcon icon={mode.icon} size="sm" />
            <span style={styles.label}>{mode.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  button: {
    width: '40px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2px 0',
    padding: '5px',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    marginTop: '2px',
    fontSize: '10px',
    color: '#fff',
  },
};

export default ModeSwitchButton;
