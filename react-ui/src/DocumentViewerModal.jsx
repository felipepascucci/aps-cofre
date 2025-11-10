import React, {useState, useEffect, useRef} from 'react';
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
        width: '50vw', 
        height: '80vh', 
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box'
    },
    overlay: { 
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000 
    }
};

function DocumentViewerModal({ isOpen, onClose, document }) {
    const [numPages, setNumPages] = useState(null);
    const [containerWidth, setContainerWidth] = useState(null); 
    const containerRef = useRef(null);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            // Ajuste a largura, subtraindo um pouco das margens (ex: 20px)
            setContainerWidth(containerRef.current.clientWidth - 20); 
        }
    }, [isOpen]);
    

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const renderPage = (pageIndex) => (
        <Page 
            key={`page_${pageIndex + 1}`} 
            pageNumber={pageIndex + 1} 
            renderAnnotationLayer={true}
            renderTextLayer={true}
            width={containerWidth || 800}
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
                      <div 
                      ref={containerRef}
                      style={{ flexGrow: 1, overflowY: 'auto', paddingTop: '0px',paddingBottom:'50%',justifyContent:'center', display:'flex' ,width:'100%' }}> 
                       <Document
                        file={document.uri}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading="Carregando PDF..."
                        noData="Nenhum arquivo PDF encontrado."
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin:0, padding:0 }}
                    >
                       {Array.from(new Array(numPages), (el, index) => (
                        renderPage(index) 
                    ))}
                    </Document>
                </div>
            ) : null}
         }
        </Modal>
    );
}
export default DocumentViewerModal;
