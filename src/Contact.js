import React, { useEffect } from 'react';
import { useSettings } from './SettingsContext';

const Contact = () => {
  const { updateSettings } = useSettings();

  useEffect(() => {
    updateSettings({ theme: 'blue' });
  }, [updateSettings]);

  return <div>Contact Us</div>;
};

export default Contact;
