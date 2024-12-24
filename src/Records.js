import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

const AudioRecorder = () => {
    const wavesurferRef = useRef(null);
    const [wavesurfer, setWavesurfer] = useState(null);
    const [record, setRecord] = useState(null);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [micDevices, setMicDevices] = useState([]);
    const [selectedMic, setSelectedMic] = useState('');

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
                scrollingWaveform: false,
                continuousWaveform: true,
                continuousWaveformDuration: 30,
            })
        );
        setRecord(recordPlugin);

        recordPlugin.on('record-end', (blob) => {
            setRecordedBlob(blob);
            const recordedUrl = URL.createObjectURL(blob);
            ws.load(recordedUrl);
        });

        // Add click event to play from clicked position after loading audio
        ws.on('ready', () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.addEventListener('click', (event) => {
                    const relativeX = event.clientX - wavesurferRef.current.getBoundingClientRect().left;
                    const duration = ws.getDuration();
                    const position = (relativeX / wavesurferRef.current.clientWidth) * duration;
                    ws.seekTo(position / duration); // Seek to the clicked position
                    ws.play(); // Play the audio
                });
            }
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

    return (
        <div>
            <h1>Audio Recorder with Wavesurfer.js</h1>
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
            <div id="mic" ref={wavesurferRef} style={{ width: '100%', height: '200px' }}></div>
            <div id="progress">00:00</div>
        </div>
    );
};

export default AudioRecorder;
