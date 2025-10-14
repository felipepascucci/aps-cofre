from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    """
    Busca todos os usuários, fazendo um JOIN para incluir o ID e o nome do nível de acesso.
    """
    resultados = db.query(models.Usuario, models.NivelAcesso).join(
        models.NivelAcesso, models.Usuario.id_nivel_acesso == models.NivelAcesso.id
    ).offset(skip).limit(limit).all()
    
    usuarios_formatados = []
    for usuario, nivel_acesso in resultados:
        usuarios_formatados.append({
            "id": usuario.id,
            "nome": usuario.nome,
            "embedding_facial": usuario.embedding_facial,
            "nivel_acesso_nome": nivel_acesso.nome_nivel
        })
        
    return usuarios_formatados

# Função para a rota GET /usuarios
def get_usuarios_simples(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Usuario).offset(skip).limit(limit).all()

def criar_usuario(db: Session, usuario: schemas.UsuarioCreate, embedding: List[float]):
    db_usuario = models.Usuario(
        nome=usuario.nome,
        id_nivel_acesso=usuario.id_nivel_acesso,
        embedding_facial=embedding
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# ---- FUNÇÃO DE LOGGING ----
def criar_log_acesso(db: Session, sucesso: bool, id_usuario_detectado: Optional[int] = None):
    """
    Cria um novo registro de log na tabela logs_acesso.
    id_usuario_detectado pode ser nulo se o rosto for desconhecido.
    """
    log_entry = models.LogAcesso(
        sucesso=sucesso,
        id_usuario_detectado=id_usuario_detectado
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry