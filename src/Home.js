import React, { useEffect } from 'react';
import { useSettings } from './SettingsContext';

const Home = () => {
  const { updateSettings } = useSettings();

  useEffect(() => {
    updateSettings({ theme: 'light' });
  }, [updateSettings]);

  return <div>Welcome to the Home Page!</div>;
};

export default Home;
