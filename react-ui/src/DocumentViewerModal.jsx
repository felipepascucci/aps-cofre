import React, {useState} from 'react';
import Modal from 'react-modal';
import {X} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/Page/TextLayer.css';

// Configuração do worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const modalStyle = {
    content: { 
        top: '50%', 
        left: '50%', 
        right: 'auto', 
        bottom: 'auto', 
        marginRight: '-50%', 
        transform: 'translate(-50%, -50%)', 
        width: '80vw', 
        height: '80vh', 
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    overlay: { 
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000 
    }
};

function DocumentViewerModal({ isOpen, onClose, document }) {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const renderPage = (pageIndex) => (
        <Page 
            key={`page_${pageIndex + 1}`} 
            pageNumber={pageIndex + 1} 
            renderAnnotationLayer={true}
            renderTextLayer={true}
            // Propriedade para garantir que a página se ajuste à largura do container
            width={700} // Valor fixo recomendado, ajuste se necessário
        />
    );
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyle}
            contentLabel="Visualizador de Documento"
        >
            <button 
                onClick={onClose} 
                    style={{  
                    zIndex: 9999,
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#1565c0', 
                    color: 'white',        
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 15px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                    }}
             >
                        <X size={18} style={{ marginRight:'5px'}} />
                    </button>

                    {document ? (
                      <div style={{ flexGrow: 1, overflowY: 'auto', paddingTop: '50px' }}> 
                       <Document
                        file={document.uri}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading="Carregando PDF..."
                        noData="Nenhum arquivo PDF encontrado."
                    >
                       {Array.from(new Array(numPages), (el, index) => (
                        renderPage(index) 
                    ))}
                    </Document>
                </div>
            ) : null}
            numPages && (
                    <p style={{ 
                        textAlign: 'center', 
                        padding: '10px', 
                        color: '#555', 
                        borderTop: '1px solid #eee',
                        position: 'absolute', // Define a posição em relação ao modal
                        bottom: '0',        // Fica na parte inferior
                        left: '0',
                        right: '0',
                        background: '#fff', // Fundo branco para garantir visibilidade
                        zIndex: 9000
                    }}>
                        Visualizando {numPages} paginas
                    </p>
                )}
        </Modal>
    );
}
export default DocumentViewerModal;
