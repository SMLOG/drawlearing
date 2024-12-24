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
            stopScanning(); // Stop scanning when a QR code is successfully decoded
        };

        const config = { fps: 10, qrbox: 250 };

        const startScanning = () => {
            if (!isScanning) {
                setIsScanning(true);
                html5QrCodeRef.current.start(
                    { facingMode: 'environment' },
                    config,
                    qrCodeSuccessCallback
                ).catch(err => {
                    console.error(`Unable to start scanning: ${err}`);
                    setIsScanning(false); // Reset scanning state on error
                });
            }
        };

        const stopScanning = () => {
            if (isScanning) {
                html5QrCodeRef.current.stop().then(() => {
                    setIsScanning(false);
                }).catch(err => {
                    console.warn(`Failed to stop scanning: ${err}`);
                });
            }
        };

        // Clean up on component unmount or when scanning stops
        return () => {
            stopScanning();
        };
    }, [isScanning]);

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>QR Code Scanner</h1>
            <button
                onClick={() => setIsScanning(true)}
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
