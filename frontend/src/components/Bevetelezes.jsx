import React, { useState, useRef } from 'react';
import { useZxing } from 'react-zxing'; // <-- A helyes import, a Hook-ot kérjük el

function Bevetelezes({ onSubmit, onNavigate }) {
    const [scannedCode, setScannedCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [feedback, setFeedback] = useState({ message: '', error: false });
    const [isScanning, setIsScanning] = useState(true);

    // Létrehozunk egy hivatkozást (ref), amit a videó elemre teszünk.
    // Így tudja majd a Hook, hogy melyik elemet kell használnia.
    const ref = useRef(null);

    // Itt használjuk a Hook-ot. Megadjuk neki a videó elemünket (ref),
    // és azt, hogy mit csináljon, ha találatot kap (onResult).
    useZxing({
        ref,
        paused: !isScanning, // A szkennelés szünetel, ha nem akarjuk
        onResult(result) {
            if (isScanning) {
                const codeText = result.getText();
                console.log('Sikeres beolvasás:', codeText);
                setScannedCode(codeText);
                setIsScanning(false); // Leállítjuk a szkennelést a találat után
                setFeedback({ message: `Kód beolvasva: ${codeText}. Add meg a mennyiséget!`, error: false });
            }
        },
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
        setFeedback({ message: 'Sikeres bevételezés! Olvashatod a következő kódot.', error: false });
    };
    
    const handleNewScan = () => {
        setScannedCode('');
        setQuantity(1);
        setIsScanning(true);
        setFeedback({ message: '', error: false });
    };

    return (
        <div className="bevetelezes-container">
            <h2>Termék Bevételezés</h2>
            
            {/* Csak akkor mutatjuk a videót, ha szkennelünk */}
            {isScanning && (
                <div className="scanner-container">
                    {/* Ez a videó elem, amit a Hook irányít. A böngésző ezt fogja kameraként használni. */}
                    <video ref={ref} style={{ maxWidth: '100%' }}/>
                    <p>Irányítsd a kamerát a vonalkódra...</p>
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