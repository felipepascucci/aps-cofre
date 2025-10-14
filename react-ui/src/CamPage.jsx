import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CamPage() {
  // Estado principal que controla a interface: 'scanning', 'success', ou 'denied'
  const [uiState, setUiState] = useState('scanning');

  // Estado secundário para a mensagem e estilo do texto de status
  const [status, setStatus] = useState({ message: 'Aproxime o rosto...', type: 'checking' });

  // Referências para o elemento <video> e para a função de navegação
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // useEffect para inicializar a câmera (roda apenas uma vez)
  useEffect(() => {
    const videoElement = videoRef.current;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
        setStatus({ message: 'Erro ao acessar a câmera!', type: 'denied' });
      }
    }
    startCamera();

    return () => {
      if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        console.log("Câmera desligada com sucesso.");
      }
    };
  }, []);

  // useEffect para o loop de reconhecimento, que depende do estado da UI
  useEffect(() => {
    if (uiState !== 'scanning') return;

    const intervalId = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (uiState !== 'scanning') return;

        const formData = new FormData();
        formData.append('arquivo_imagem', blob, 'frame.jpg');

        try {
          setStatus({ message: 'Verificando...', type: 'checking' });
          const response = await fetch('http://127.0.0.1:8000/reconhecer', { method: 'POST', body: formData });
          const result = await response.json();

          if (response.ok && result.acesso === 'permitido') {
            setUiState('success');
            setStatus({ message: `Reconhecido! Redirecionando...`, type: 'allowed' });

            setTimeout(() => {
              switch (result.nivel_acesso) {
                case 'Nível 1 - Geral':
                  navigate('/nivel-1', { state: { authLevel: 'Nível 1 - Geral', userName: result.nome } });
                  break;
                case 'Nível 2 - Diretor':
                  navigate('/nivel-2', { state: { authLevel: 'Nível 2 - Diretor', userName: result.nome } });
                  break;
                case 'Nível 3 - Ministro':
                  navigate('/nivel-3', { state: { authLevel: 'Nível 3 - Ministro', userName: result.nome } });
                  break;
                default:
                  setUiState('scanning');
                  setStatus({ message: 'Nível de acesso inválido!', type: 'denied' });
              }
            }, 2000);

          } else {
            setUiState('denied');
            setStatus({ message: 'Acesso Negado', type: 'denied' });

            setTimeout(() => {
              setUiState('scanning');
              setStatus({ message: 'Aproxime o rosto...', type: 'checking' });
            }, 2000);
          }
        } catch (error) {
          console.error('Erro ao enviar frame:', error);
          setStatus({ message: 'Erro de conexão com o servidor', type: 'denied' });
          setTimeout(() => {
            setUiState('scanning');
            setStatus({ message: 'Aproxime o rosto...', type: 'checking' });
          }, 2000);
        }
      }, 'image/jpeg');
    }, 3000);

    return () => clearInterval(intervalId);
  }, [uiState, navigate]);

  return (
    <>
      <h1>Cofre de Segurança</h1>
      <div className="card-container">
        <div className="video-container">

          {uiState === 'success' && (
            <div className="feedback-overlay success">
              <div className="icon-container success">
                <svg className="icon-svg" viewBox="0 0 52 52">
                  <path className="path" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
            </div>
          )}

          {uiState === 'denied' && (
            <div className="feedback-overlay denied">
              <div className="icon-container denied">
                <svg className="icon-svg" viewBox="0 0 52 52">
                  <line className="path" x1="16" y1="16" x2="36" y2="36" />
                  <line className="path" x1="36" y1="16" x2="16" y2="36" />
                </svg>
              </div>
            </div>
          )}

          <video ref={videoRef} autoPlay muted playsInline />
        </div>

        <div className={`status status-${status.type}`}>
          {status.message}
        </div>
      </div>
    </>
  );
}

export default CamPage;