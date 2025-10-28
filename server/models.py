from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from .database import Base
import datetime
from sqlalchemy import event

class NivelAcesso(Base):
    __tablename__ = "niveis_acesso"
    id = Column(Integer, primary_key=True, index=True)
    nome_nivel = Column(String, unique=True, nullable=False)

@event.listens_for(NivelAcesso.__table__, 'after_create')
def populate_niveis_acesso(target, connection, **kw):
    connection.execute(
        target.insert(),
        [
            {'nome_nivel': 'Nível 1 - Geral'},
            {'nome_nivel': 'Nível 2 - Diretor'},
            {'nome_nivel': 'Nível 3 - Ministro'}
        ]
    )

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    id_nivel_acesso = Column(Integer, ForeignKey("niveis_acesso.id"), nullable=False)
    embedding_facial = Column(ARRAY(Float), nullable=False)
    data_cadastro = Column(DateTime, default=datetime.datetime.utcnow)

    nivel_acesso = relationship("NivelAcesso")

class LogAcesso(Base):
    __tablename__ = "logs_acesso"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    id_usuario_detectado = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    sucesso = Column(Boolean, nullable=False)