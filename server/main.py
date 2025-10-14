from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models
from .database import engine, get_db
from .routers import users

# Cria as tabelas no banco de dados (se elas não existirem)
models.Base.metadata.create_all(bind=engine)

# INICIALIZAÇÃO DA APLICAÇÃO
app = FastAPI(
    title="API do Cofre de Segurança",
    description="API para reconhecimento facial e controle de acesso.",
    version="1.0.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas definidas no arquivo users.py
app.include_router(users.router)


@app.get("/")
def read_root():
    """Endpoint principal para verificar se a API está online."""
    return {"status": "success", "message": "API do Cofre de Segurança está online!"}


@app.post("/reconhecer")
async def reconhecer_rosto(arquivo_imagem: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Recebe uma imagem, compara com os dados mais recentes do banco de dados e registra o log.
    """
    import face_recognition
    import numpy as np
    import cv2
    
    # Passo 1: Carrega os dados mais recentes de usuários do DB a cada requisição
    usuarios_db = crud.get_usuarios(db, limit=1000)
    imagens_conhecidas_db = [np.array(u["embedding_facial"]) for u in usuarios_db]
    nomes_conhecidos_db = [u["nome"] for u in usuarios_db]
    niveis_conhecidos_db = [u["nivel_acesso_nome"] for u in usuarios_db]
    ids_conhecidos_db = [u["id"] for u in usuarios_db]

    # Passo 2: Processa a imagem recebida do frontend
    conteudo_imagem = await arquivo_imagem.read()
    nparr = np.frombuffer(conteudo_imagem, np.uint8)
    imagem = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    imagem_rgb = cv2.cvtColor(imagem, cv2.COLOR_BGR2RGB)

    localizacoes_rostos = face_recognition.face_locations(imagem_rgb)
    if not localizacoes_rostos:
        crud.criar_log_acesso(db=db, sucesso=False, id_usuario_detectado=None)
        raise HTTPException(status_code=400, detail="Nenhum rosto encontrado na imagem.")

    embedding_desconhecido = face_recognition.face_encodings(imagem_rgb, localizacoes_rostos)[0]
    
    # Passo 3: Compara e determina o resultado
    acesso_permitido = False
    nome_reconhecido, nivel_acesso_reconhecido, id_usuario_reconhecido = "Desconhecido", None, None

    if nomes_conhecidos_db:
        distancias = face_recognition.face_distance(imagens_conhecidas_db, embedding_desconhecido)
        menor_distancia = np.min(distancias)
        
        if menor_distancia <= 0.6:
            acesso_permitido = True
            indice = np.argmin(distancias)
            nome_reconhecido = nomes_conhecidos_db[indice]
            nivel_acesso_reconhecido = niveis_conhecidos_db[indice]
            id_usuario_reconhecido = ids_conhecidos_db[indice]

    # Passo 4: Registra o log da tentativa
    crud.criar_log_acesso(db=db, sucesso=acesso_permitido, id_usuario_detectado=id_usuario_reconhecido)

    # Passo 5: Retorna a resposta
    return {
        "acesso": "permitido" if acesso_permitido else "negado", 
        "nome": nome_reconhecido, 
        "nivel_acesso": nivel_acesso_reconhecido
    }