import React, { useEffect } from 'react';
import { useSettings } from './SettingsContext';

const About = () => {
  const { updateSettings } = useSettings();

  useEffect(() => {
    updateSettings({ theme: 'dark' });
  }, [updateSettings]);

  return <div>About Us</div>;
};

export default About;
