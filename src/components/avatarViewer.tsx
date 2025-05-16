import { Canvas } from '@react-three/fiber';
import SceneManager from './sceneManager';
import { useAppContext } from '../context/appContext';

const AvatarViewer = () => {
    const { isLoading } = useAppContext();

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <Canvas
                style={{ background: '#f0f0f0' }}
                camera={{ position: [0, 0, 5], fov: 50 }}
            >
                <SceneManager />
            </Canvas>

            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            padding: '20px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            borderRadius: '8px',
                            textAlign: 'center',
                        }}
                    >
                        Loading model...
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarViewer;