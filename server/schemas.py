from pydantic import BaseModel
from typing import List

class UsuarioBase(BaseModel):
    nome: str
    id_nivel_acesso: int

class UsuarioCreate(UsuarioBase):
    pass

class Usuario(UsuarioBase):
    id: int

    class Config:
        from_attributes = True