import React, { useRef, useState, useEffect } from 'react';

const ZoomableImageWithButtons: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Tabla' | 'Información' | 'Otros'>('Tabla');

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();

    const delta = -event.deltaY;
    const zoomFactor = 0.001;
    const newScale = Math.min(Math.max(0.3, scale + delta * zoomFactor), 6);

    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const dx = (offsetX - translate.x) * (1 - newScale / scale);
      const dy = (offsetY - translate.y) * (1 - newScale / scale);

      setTranslate({
        x: translate.x + dx,
        y: translate.y + dy,
      });
    }

    setScale(newScale);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsPanning(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setLastMousePos(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isPanning || !lastMousePos) return;

    const dx = event.clientX - lastMousePos.x;
    const dy = event.clientY - lastMousePos.y;

    setTranslate((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleButtonClick = (id: string) => {
    setSelectedButtonId(id);
    setModalVisible(true);
    setActiveTab('Tabla'); // por defecto siempre abre en "Tabla"
  };

  const renderTabContent = () => {
    if (activeTab === 'Tabla') {
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Columna 1</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Columna 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>Dato A</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>Dato B</td>
            </tr>
          </tbody>
        </table>
      );
    }

    if (activeTab === 'Información') {
      return (
        <div>
          <p>Información detallada sobre <strong>{selectedButtonId}</strong>.</p>
          <ul>
            <li>Dato 1</li>
            <li>Dato 2</li>
            <li>Dato 3</li>
          </ul>
        </div>
      );
    }

    if (activeTab === 'Otros') {
      return (
        <div>
          <p>Contenido adicional o funcionalidades especiales para <strong>{selectedButtonId}</strong>.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'relative',
        cursor: isPanning ? 'grabbing' : 'grab',
        backgroundColor: '#f0f0f0',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    > 
      {/* Imagen principal con botones */}
      <div
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${translate.x}px), calc(-50% + ${translate.y}px)) scale(${scale})`,
            transformOrigin: 'center',
            margin: 0,
        }}
      >
        <img
          src="/mapaperu.svg"
          alt="Imagen Principal"
          style={{
            width: '500px',
            height: 'auto',
            objectFit: 'cover', 
            userSelect: 'none',
            pointerEvents: 'none',
            display: 'block',
          }}
          draggable={false}
        />

        {/* Botón 1 */}
        <img
          src="/Escudo_UNSA.png"
          alt="Botón 1"
          onClick={() => handleButtonClick('Botón 1')}
          style={{
            position: 'absolute',
            top: '600px',
            left: '350px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
          }}
        />

        {/* Botón 2 */}
        <img
          src="/Escudo_TIUNSA.png"
          alt="Botón 2"
          onClick={() => handleButtonClick('Botón 2')}
          style={{
            position: 'absolute',
            top: '600px',
            left: '380px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Modal con pestañas */}
      {modalVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.54)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setModalVisible(false)}
        >
          <div
            style={{
              backgroundColor: 'rgba(153, 140, 140, 0.95)',
              padding: '20px',
              borderRadius: '16px',
              width: '80%',
              maxHeight: '80%',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedButtonId}</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              {(['Tabla', 'Información', 'Otros'] as const).map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderBottom: activeTab === tab ? '3px solid #007BFF' : '3px solid transparent',
                    marginRight: '16px',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Contenido del tab activo */}
            <div>{renderTabContent()}</div>

            {/* Cerrar */}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setModalVisible(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      <h1> ROAmap</h1>
    </div>
  );
};

export default ZoomableImageWithButtons;
