import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import styled from 'styled-components';

// Styled components
const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 400px; /* Set a fixed height for the modal */
`;

const Button = styled.button`
    margin: 20px 0;
    padding: 10px 20px;
    cursor: pointer;
`;

const ReaderContainer = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    flex-grow: 1; /* Allow this to grow and take available space */
`;

const Result = styled.div`
    margin-top: 20px;
    font-size: 1.5em;
`;

const FileInput = styled.input`
    margin-top: 20px;
`;

const QrCodeScannerModal = ({ onClose, onScanResult }) => {
    const [result, setResult] = useState('');
    const readerRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const modalRef = useRef(null);
    const isScanningRef = useRef(false); // Using ref to track scanning state

    useEffect(() => {
        // Initialize the QR code scanner
        html5QrCodeRef.current = new Html5Qrcode(readerRef.current.id);

        const qrCodeSuccessCallback = (decodedText) => {
            setResult(decodedText);
            onScanResult(decodedText); // Call the parent with the scan result
            stopScanning(); // Stop scanning on successful scan
        };

        const config = { fps: 10, qrbox: 250 };

        const startScanning = () => {
            if (!isScanningRef.current) {
                isScanningRef.current = true; // Set scanning to true
                html5QrCodeRef.current.start(
                    { facingMode: 'environment' },
                    config,
                    qrCodeSuccessCallback
                ).catch(err => {
                    console.error(`Unable to start scanning: ${err}`);
                    isScanningRef.current = false; // Reset scanning state on error
                });
            }
        };

        // Start scanning when the modal opens
        startScanning();

        return () => {
            // Cleanup function does not call stopScanning
        };
    }, []); // Run once on mount

    const stopScanning = async () => {
        try {
            if (html5QrCodeRef.current && isScanningRef.current) {
                await html5QrCodeRef.current.stop();
                isScanningRef.current = false; // Reset scanning state
            }
        } catch (err) {
            console.warn(`Failed to stop scanning: ${err.message}`);
        } finally {
            onClose(); // Ensure modal closes
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const imgUrl = reader.result;
                // Decode the QR code from the image URL
                Html5Qrcode.scanFile(imgUrl, true)
                    .then(decodedText => {
                        setResult(decodedText);
                        onScanResult(decodedText); // Call the parent with the scan result
                    })
                    .catch(err => {
                        console.error(`Failed to decode QR code from image: ${err}`);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle click outside the modal
    const handleClickOutside = (event) => {
        if (
            modalRef.current && 
            !modalRef.current.contains(event.target) && 
            event.target.closest('.open-scanner-button') === null // Check if not the button
        ) {
            stopScanning(); // Stop scanning and close modal
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Modal>
            <ModalContent ref={modalRef}>
                <h1>QR Code Scanner</h1>
                <ReaderContainer id="reader" ref={readerRef}></ReaderContainer>
                {result && <Result>Scanned Result: {result}</Result>}
                <FileInput type="file" accept="image/*" onChange={handleImageUpload} />
                <Button onClick={stopScanning}>Cancel</Button>
            </ModalContent>
        </Modal>
    );
};

const QrCodeScannerApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scanResult, setScanResult] = useState('');

    const openScanner = () => {
        setIsModalOpen(true);
    };

    const handleScanResult = (result) => {
        setScanResult(result); // Update the state with the scan result
        console.log(`Scanned Result: ${result}`); // Handle the result as needed
        setIsModalOpen(false); // Optionally close the modal after a scan
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>QR Code Scanner App</h1>
            <Button className="open-scanner-button" onClick={openScanner}>Open QR Code Scanner</Button>
            {isModalOpen && (
                <QrCodeScannerModal 
                    onClose={() => setIsModalOpen(false)} 
                    onScanResult={handleScanResult} // Pass the callback to the modal
                />
            )}
            {scanResult && <div>Last Scanned Result: {scanResult}</div>} {/* Display the last scanned result */}
        </div>
    );
};

export default QrCodeScannerApp;
