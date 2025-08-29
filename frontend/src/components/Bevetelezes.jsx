import React, { useState, useRef } from 'react';
import { useZxing } from 'react-zxing';

function Bevetelezes({ onSubmit, onNavigate }) {
    const [scannedCode, setScannedCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [feedback, setFeedback] = useState({ message: '', error: false });
    const [isScanning, setIsScanning] = useState(true);
    const [cameraError, setCameraError] = useState(''); // Új állapot a kamera hibájának

    const ref = useRef(null);

    useZxing({
        ref,
        paused: !isScanning,
        // Kifejezetten a hátlapi kamerát kérjük
        constraints: { video: { facingMode: 'environment' } },
        onResult(result) {
            if (isScanning) {
                const codeText = result.getText();
                setScannedCode(codeText);
                setIsScanning(false);
                setFeedback({ message: `Kód beolvasva: ${codeText}. Add meg a mennyiséget!`, error: false });
            }
        },
        // Ha hiba történik a kamera indításakor
        onError(error) {
            console.error("Kamera hiba:", error);
            if (error.name === 'NotAllowedError') {
                setCameraError("Nincs engedély a kamera használatához. Kérlek, engedélyezd a böngésző beállításaiban.");
            } else {
                setCameraError("Kamera nem elérhető vagy hiba történt.");
            }
        }
    });

    const handleSubmit = async () => {
        if (!scannedCode) {
            setFeedback({ message: 'Előbb olvass be egy vonalkódot!', error: true });
            return;
        }
        await onSubmit(scannedCode, Number(quantity));
        
        setScannedCode('');
        setQuantity(1);
        setIsScanning(true);
        setCameraError(''); // Hiba törlése
        setFeedback({ message: 'Sikeres bevételezés! Olvashatod a következő kódot.', error: false });
    };
    
    const handleNewScan = () => {
        setScannedCode('');
        setQuantity(1);
        setIsScanning(true);
        setCameraError(''); // Hiba törlése
        setFeedback({ message: '', error: false });
    };

    return (
        <div className="bevetelezes-container">
            <h2>Termék Bevételezés</h2>
            
            {isScanning && (
                <div className="scanner-container">
                    <video ref={ref} style={{ maxWidth: '100%' }}/>
                    {cameraError && <p className="feedback-error" style={{ padding: '1rem' }}>{cameraError}</p>}
                    {!cameraError && <p>Irányítsd a kamerát a vonalkódra...</p>}
                </div>
            )}
            
            <div className="controls-container">
                <h3>Beolvasott kód: <span>{scannedCode || 'Szkennelés...'}</span></h3>
                
                {scannedCode && (
                    <>
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)} 
                            placeholder="Mennyiség" 
                        />
                        <button onClick={handleSubmit}>Bevételezés</button>
                        <button onClick={handleNewScan} style={{backgroundColor: '#f44336'}}>Új szkennelés</button>
                    </>
                )}
            </div>

            {feedback.message && (
                <p className={feedback.error ? 'feedback-error' : 'feedback-success'}>
                    {feedback.message}
                </p>
            )}

            <button onClick={() => onNavigate('dashboard')} style={{marginTop: '20px'}}>Vissza a vezérlőpultra</button>
        </div>
    );
}

export default Bevetelezes;