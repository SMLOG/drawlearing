import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import QrCodeScanner from './QrCodeScanner';
import AudioRecords from './AudioRecords'; 
import TextRecording from './TextRecording';
import URLInputButton from './URLInputButton';
const AudioRecorder = () => {
    const wavesurferRef = useRef(null);
    const [wavesurfer, setWavesurfer] = useState(null);
    const [record, setRecord] = useState(null);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [micDevices, setMicDevices] = useState([]);
    const [selectedMic, setSelectedMic] = useState('');
    const [progress, setProgress] = useState(0); // Single progress state
    const [recordingDuration, setRecordingDuration] = useState(0); // For recording duration
  const audioRecordsRef = useRef(null);
    useEffect(() => {
        const ws = WaveSurfer.create({
            container: wavesurferRef.current,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
        });
        setWavesurfer(ws);

        const recordPlugin = ws.registerPlugin(
            RecordPlugin.create({
                renderRecordedAudio: false,
                scrollingWaveform: true,
                continuousWaveform: false,
                continuousWaveformDuration: 30,
            })
        );
        setRecord(recordPlugin);

        recordPlugin.on('record-end', async (blob) => {
            setRecordedBlob(blob);
            const recordedUrl = URL.createObjectURL(blob);
            if (audioRecordsRef.current) {
                audioRecordsRef.current.addAudio(recordedUrl);
              }
            ws.load(recordedUrl);
        });

        // Add click and touch event to play from clicked position after loading audio
        const playAudioFromClick = (event) => {
            const relativeX = event.touches ? event.touches[0].clientX : event.clientX;
            const relativePosition = relativeX - wavesurferRef.current.getBoundingClientRect().left;
            const duration = ws.getDuration();
            const position = (relativePosition / wavesurferRef.current.clientWidth) * duration;
            ws.seekTo(position / duration); // Seek to the clicked position
            ws.play(); // Play the audio
        };

        ws.on('ready', () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.addEventListener('click', playAudioFromClick);
                wavesurferRef.current.addEventListener('touchstart', playAudioFromClick);
            }
        });

        // Update progress while playing
        ws.on('audioprocess', (currentTime) => {
            setProgress(currentTime);
        });

        // Cleanup on component unmount
        return () => {
            ws.destroy();
        };
    }, []);

    useEffect(() => {
        // Get available audio devices
        const getAudioDevices = async () => {
            const devices = await RecordPlugin.getAvailableAudioDevices();
            setMicDevices(devices);
            if (devices.length > 0) {
                setSelectedMic(devices[0].deviceId);
            }
        };
        getAudioDevices();
    }, []);

    const handleRecord = async () => {
        if (isRecording) {
            await record.stopRecording();
            setIsRecording(false);
        } else {
            await record.startRecording({ deviceId: selectedMic });
            setIsRecording(true);
            setRecordingDuration(0); // Reset recording duration

            // Update recording duration every second
            const interval = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000);

            // Clear interval when recording stops
            return () => clearInterval(interval);
        }
    };

    const handleSave = async () => {
        if (recordedBlob) {
            const formData = new FormData();
            formData.append('audio', recordedBlob, 'recording.webm');

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                console.log('Upload successful:', data);
                alert('Recording saved to backend!');
            } catch (error) {
                console.error('Error uploading the recording:', error);
            }
        }
    };

    // Helper function to format time
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    // Determine the displayed time
    const displayedTime = isRecording ? recordingDuration : progress;
    const totalDuration = isRecording ? recordingDuration : (wavesurfer ? wavesurfer.getDuration() : 0);
    const handleFinish = (clicks) => {
        console.log('Finished! Clicks:', clicks);
        // Additional actions can be performed here
    };
    return (
        <div>
            <h1>Audio Recorder</h1>
            <select value={selectedMic} onChange={(e) => setSelectedMic(e.target.value)}>
                {micDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || device.deviceId}
                    </option>
                ))}
            </select>
            <button onClick={handleRecord}>
                {isRecording ? 'Stop' : 'Record'}
            </button>
            <button onClick={handleSave} disabled={!recordedBlob}>
                Save to Backend
            </button>
            <div id="mic" ref={wavesurferRef} style={{  height: '200px' }}></div>
            <div id="progress">
                Current Time: {formatTime(displayedTime)} / {formatTime(totalDuration)}
            </div>
            <TextRecording onFinish={handleFinish} />
            <AudioRecords ref={audioRecordsRef}  />
            <URLInputButton />
            <QrCodeScanner onScanResult={(url)=>{ console.error(url);audioRecordsRef.current.addAudio(url,true);}}/>
        </div>
    );
};

export default AudioRecorder;
