import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrCodeScanner = () => {
    const [result, setResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const readerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
        // Initialize the QR code scanner
        html5QrCodeRef.current = new Html5Qrcode(readerRef.current.id);

        const qrCodeSuccessCallback = (decodedText) => {
            setResult(decodedText);
            stopScanning();
        };

        const config = { fps: 10, qrbox: 250 };

        const startScanning = () => {
            html5QrCodeRef.current.start(
                { facingMode: 'environment' },
                config,
                qrCodeSuccessCallback
            ).catch(err => {
                console.error(`Unable to start scanning: ${err}`);
                setIsScanning(false); // Reset scanning state on error
            });
        };

        // Start scanning if isScanning is true
        if (isScanning) {
            startScanning();
        }

        // Cleanup function to stop scanning
        return () => {
            stopScanning();
        };
    }, [isScanning]); // Effect depends on isScanning

    const stopScanning = () => {
        if (html5QrCodeRef.current && isScanning) {
            html5QrCodeRef.current.stop().then(() => {
                setIsScanning(false);
            }).catch(err => {
                console.warn(`Failed to stop scanning: ${err}`);
            });
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>QR Code Scanner</h1>
            <button
                onClick={() => setIsScanning(true)} // Set to true to start scanning
                disabled={isScanning}
                style={{ margin: '20px', padding: '10px 20px' }}
            >
                {isScanning ? 'Scanning...' : 'Start QR Code Scan'}
            </button>
            <div id="reader" ref={readerRef} style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}></div>
            {result && (
                <div style={{ marginTop: '20px', fontSize: '1.5em' }}>
                    Scanned Result: {result}
                </div>
            )}
        </div>
    );
};

export default QrCodeScanner;
