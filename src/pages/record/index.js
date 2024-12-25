import React, { useEffect, useRef, useState } from 'react';
import QrCodeScanner from './QrCodeScanner';
import AudioRecords from './AudioRecords'; 
import URLInputButton from './URLInputButton';
import AudioRecorder from './AudioRecorder';
const Recorder = () => {
  const audioRecordsRef = useRef(null);
    return (
        <div>
            <AudioRecorder></AudioRecorder>
            <AudioRecords ref={audioRecordsRef}  />
            <URLInputButton onSubmit ={(urls)=>{urls.forEach((url)=>{
                console.error(url)
                audioRecordsRef.current.addAudio(url,true);
                });}}/>
            <QrCodeScanner onScanResult={(url)=>{ console.error(url);audioRecordsRef.current.addAudio(url,true);}}/>
        </div>
    );
};

export default Recorder;
