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
`;

const Result = styled.div`
    margin-top: 20px;
    font-size: 1.5em;
`;

const QrCodeScannerModal = ({ onClose }) => {
    const [result, setResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const readerRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        // Initialize the QR code scanner
        html5QrCodeRef.current = new Html5Qrcode(readerRef.current.id);
        
        const qrCodeSuccessCallback = (decodedText) => {
            setResult(decodedText);
            stopScanning(); // Stop scanning on successful scan
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

        // Start scanning when the modal opens
        startScanning();

        return () => {
            // Cleanup function does not call stopScanning
        };
    }, []); // Run once on mount

    const stopScanning = () => {
        if (html5QrCodeRef.current && isScanning) {
            html5QrCodeRef.current.stop().then(() => {
                setIsScanning(false);
                onClose(); // Close the modal after stopping
            }).catch(err => {
                console.warn(`Failed to stop scanning: ${err}`);
            });
        } else {
            onClose(); // Ensure modal closes even if not scanning
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
                <Button onClick={stopScanning}>Cancel</Button>
                <ReaderContainer id="reader" ref={readerRef}></ReaderContainer>
                {result && <Result>Scanned Result: {result}</Result>}
            </ModalContent>
        </Modal>
    );
};

const QrCodeScannerApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openScanner = () => {
        setIsModalOpen(true);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>QR Code Scanner App</h1>
            <Button className="open-scanner-button" onClick={openScanner}>Open QR Code Scanner</Button>
            {isModalOpen && (
                <QrCodeScannerModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default QrCodeScannerApp;
