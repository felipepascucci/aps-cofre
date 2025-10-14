import React, { useState, useRef } from 'react';

// --- Credenciais de Administrador (definidas no código) ---
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

function RegistrationPage() {
  // --- Estados para o formulário de CADASTRO ---
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState('1');
  const [foto, setFoto] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });

  // --- Estados para a tela de LOGIN ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- Estados e Refs para o MODAL DA CÂMERA ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const modalVideoRef = useRef(null);

  // Função para lidar com a submissão do formulário de LOGIN
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Usuário ou senha inválidos.');
    }
  };

  // Função para lidar com a submissão do formulário de CADASTRO
  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    if (!foto) {
      alert('Por favor, selecione ou capture uma foto.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('id_nivel_acesso', nivel);
    formData.append('arquivo_imagem', foto);

    setStatus({ message: 'Cadastrando, por favor aguarde...', type: 'checking' });

    try {
      const response = await fetch('http://127.0.0.1:8000/usuarios', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setStatus({ message: `Usuário "${result.nome}" cadastrado com sucesso!`, type: 'success' });
        setNome('');
        setNivel('1');
        setFoto(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        setStatus({ message: `Erro: ${result.detail}`, type: 'error' });
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setStatus({ message: 'Erro de conexão com o servidor.', type: 'error' });
    }
  };

  // Função para remover o arquivo selecionado
  const handleRemoveFoto = () => {
    setFoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Funções para controlar o MODAL DA CÂMERA
  const openCameraModal = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsModalOpen(true);
      setTimeout(() => {
        if (modalVideoRef.current) {
          modalVideoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Erro ao abrir a câmera no modal:", err);
      alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    }
  };

  const closeCameraModal = () => {
    if (modalVideoRef.current && modalVideoRef.current.srcObject) {
      modalVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsModalOpen(false);
  };

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = modalVideoRef.current.videoWidth;
    canvas.height = modalVideoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(modalVideoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], "foto_capturada.jpg", { type: "image/jpeg" });
      setFoto(capturedFile);
      closeCameraModal();
    }, 'image/jpeg');
  };


  return (
    <>
      <h1>Administração</h1>
      <div className="card-container">
        {isLoggedIn ? (
          <>
            <h2>Cadastro de Novo Usuário</h2>
            <form onSubmit={handleRegistrationSubmit}>
              <div><label>Nome:</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
              <div><label>Nível de Acesso:</label><select value={nivel} onChange={(e) => setNivel(e.target.value)} required><option value="1">Nível 1 - Geral</option><option value="2">Nível 2 - Diretor</option><option value="3">Nível 3 - Ministro</option></select></div>

              <div>
                <label>Rosto:</label>
                <div className="file-input-container">
                  <label htmlFor="foto-upload" className="custom-file-upload">
                    Escolher Arquivo
                  </label>
                  <button type="button" onClick={openCameraModal} className="camera-icon-btn" title="Tirar foto com a webcam">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path></svg>
                  </button>
                  <input id="foto-upload" type="file" ref={fileInputRef} onChange={(e) => setFoto(e.target.files[0])} accept="image/jpeg, image/png" style={{ display: 'none' }} />
                  <span className="file-name-display">{foto ? foto.name : ''}</span>
                  {foto && (<button type="button" onClick={handleRemoveFoto} className="remove-file-btn">&times;</button>)}
                </div>
              </div>

              <button type="submit">Cadastrar</button>
            </form>
            {status.message && (<div className={`status status-${status.type}`} style={{ display: 'block' }}>{status.message}</div>)}
          </>
        ) : (

          <>
            <h2>Login de Administrador</h2>
            <form onSubmit={handleLoginSubmit}>
              <div><label>Usuário:</label><input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} required /></div>
              <div><label>Senha:</label><input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required /></div>
              <button type="submit">Entrar</button>
              {loginError && (<p>{loginError}</p>)}
            </form>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Capturar Foto</h3>
            <video ref={modalVideoRef} autoPlay playsInline width="480" height="360" style={{ borderRadius: '8px', border: '2px solid var(--bg-light)' }}></video>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="button" onClick={handleCapture}>Tirar Foto</button>
              <button type="button" onClick={closeCameraModal} style={{ backgroundColor: 'var(--denied-color)' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RegistrationPage;