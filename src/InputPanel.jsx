import { Html } from '@react-three/drei'
import { useState } from 'react';

const InputPanel = ({ onUpdate }) => {
    const [numElements, setNumElements] = useState('');
    const [tempInputs, setTempInputs] = useState([]);
    const [error, setError] = useState('');

    const handleNumElementsSubmit = (e) => {
        e.preventDefault();
        const num = parseInt(numElements);
        if (num > 0) {
            setTempInputs(Array(num).fill({ progress: 0, color: '#000000', text: '' }));
        }
    };

    const handleInputChange = (index, field, value) => {
        const newInputs = [...tempInputs];
        newInputs[index] = { 
            ...newInputs[index], 
            [field]: field === 'progress' ? parseFloat(value) / 100 : value 
        };
        setTempInputs(newInputs);
    };

    const handleUpdateVisual = () => {
        const totalProgress = tempInputs.reduce((sum, item) => sum + (item.progress || 0), 0);
        if (Math.abs(totalProgress - 1) > 0.01) {
            setError('Total progress must equal 100%');
            return;
        }
        onUpdate(tempInputs);
        setError('');
    };

    return (
        <Html
            as='div'
            transform
            position={[-2, 2, 0]}
            style={{
                width: '300px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)'
            }}
        >
            {tempInputs.length === 0 ? (
                <form onSubmit={handleNumElementsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                        Configure Ring Segments
                    </div>
                    <input
                        type="number"
                        value={numElements}
                        onChange={(e) => setNumElements(e.target.value)}
                        placeholder="Number of segments"
                        style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '8px',
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Set Segments
                    </button>
                </form>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ fontSize: '18px' }}>Segment Configuration</div>
                    {tempInputs.map((input, index) => (
                        <div key={index} style={{ 
                            padding: '10px',
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                                Segment {index + 1}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input
                                    type="number"
                                    placeholder="Progress (%)"
                                    onChange={(e) => handleInputChange(index, 'progress', e.target.value)}
                                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <input
                                    type="color"
                                    onChange={(e) => handleInputChange(index, 'color', e.target.value)}
                                    style={{ width: '100%', height: '30px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Label text"
                                    onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                        </div>
                    ))}
                    {error && (
                        <div style={{ color: 'red', padding: '8px' }}>
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleUpdateVisual}
                        style={{
                            padding: '10px',
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Update Ring
                    </button>
                </div>
            )}
        </Html>
    );
};

export default InputPanel;