import face_recognition
import numpy as np
import cv2
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)

@router.get("/", response_model=List[schemas.Usuario])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lista os usuários básicos cadastrados no banco de dados.
    """
    users = crud.get_usuarios_simples(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=schemas.Usuario)
async def create_user(
    nome: str = Form(...),
    id_nivel_acesso: int = Form(...),
    arquivo_imagem: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Cadastra um novo usuário no sistema.
    """
    conteudo_imagem = await arquivo_imagem.read()
    nparr = np.frombuffer(conteudo_imagem, np.uint8)
    imagem = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    imagem_rgb = cv2.cvtColor(imagem, cv2.COLOR_BGR2RGB)

    localizacoes_rostos = face_recognition.face_locations(imagem_rgb)
    if not localizacoes_rostos:
        raise HTTPException(status_code=400, detail="Nenhum rosto encontrado na imagem.")
    
    embedding = face_recognition.face_encodings(imagem_rgb, localizacoes_rostos)[0]
    embedding_lista = embedding.tolist()

    usuario_schema = schemas.UsuarioCreate(nome=nome, id_nivel_acesso=id_nivel_acesso)

    novo_usuario = crud.criar_usuario(db=db, usuario=usuario_schema, embedding=embedding_lista)
    
    return novo_usuario