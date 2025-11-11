import time
from sqlalchemy.orm import Session
from ..database import SessionLocal, engine
from ..models import Base, Usuario

TOTAL_USUARIOS = 5000

EMBEDDING_EXEMPLO = [
    -0.12, 0.05, 0.03, -0.01, -0.04, -0.07, -0.03, -0.08, 0.13, -0.03,
    0.23, -0.04, -0.19, -0.12, -0.09, 0.12, -0.16, -0.12, 0.03, -0.09,
    -0.08, -0.01, 0.01, 0.05, -0.02, -0.19, -0.09, -0.05, -0.03, -0.06,
    -0.11, 0.08, -0.13, 0.02, 0.15, -0.22, -0.03, -0.03, -0.14, 0.03,
    0.04, 0.11, -0.08, 0.02, -0.05, -0.13, 0.01, 0.09, -0.03, 0.09,
    0.06, 0.09, 0.01, -0.04, -0.16, 0.01, -0.05, -0.08, 0.05, -0.02,
    0.02, -0.09, -0.21, 0.12, -0.10, -0.01, 0.01, 0.05, -0.03, -0.04,
    0.02, 0.13, -0.16, -0.02, 0.15, 0.02, 0.04, -0.09, -0.10, -0.10,
    0.04, -0.15, 0.01, 0.10, -0.10, -0.19, 0.03, 0.01, 0.08, -0.02,
    0.07, 0.09, -0.04, -0.11, -0.08, -0.02, 0.06, 0.10, -0.01, 0.05,
    -0.06, 0.03, 0.01, -0.09, -0.06, 0.01, 0.02, -0.03, -0.05, -0.15,
    -0.10, -0.07, 0.08, 0.01, 0.04, 0.02, -0.03, -0.01, -0.07, -0.05,
    -0.08, -0.12, 0.03, -0.05, 0.03, 0.07, 0.01, -0.06
]

def populate_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    try:
        count = db.query(Usuario).count()
        if count > 3:
            print(f"O banco de dados já contém {count} usuários. Pulando a população.")
            return

        print(f"Banco de dados vazio. Inserindo {TOTAL_USUARIOS} usuários falsos...")
        start_time = time.time()

        usuarios_para_inserir = []
        for i in range(TOTAL_USUARIOS):
            usuarios_para_inserir.append(
                Usuario(
                    nome=f"Usuario Falso {i+1}",
                    id_nivel_acesso=(i % 3) + 1,
                    embedding_facial=EMBEDDING_EXEMPLO
                )
            )

        db.bulk_save_objects(usuarios_para_inserir)
        db.commit()
        
        end_time = time.time()
        print(f"Inserção de {TOTAL_USUARIOS} usuários concluída em {end_time - start_time:.2f} segundos.")
        
    except Exception as e:
        print(f"Ocorreu um erro: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_database()