import os
from locust import HttpUser, task, between

script_dir = os.path.dirname(os.path.abspath(__file__))

TEST_IMAGE_FILENAME = "img_test.jpg"

TEST_IMAGE_PATH = os.path.join(script_dir, TEST_IMAGE_FILENAME)

class CofreUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        self.image_bytes = None
        if not os.path.exists(TEST_IMAGE_PATH):
            print(f"ERRO: Arquivo de imagem não encontrado em '{TEST_IMAGE_PATH}'")
            print("Verifique se 'img_test.jpg' está na pasta 'server/test/'.")
            print("Este usuário virtual não executará nenhuma tarefa.")
            return

        try:
            with open(TEST_IMAGE_PATH, 'rb') as f:
                self.image_bytes = f.read()
            print("Imagem de teste carregada com sucesso.")
        except Exception as e:
            print(f"Erro ao ler a imagem de teste '{TEST_IMAGE_PATH}': {e}")

    @task
    def reconhecer_rosto(self):
        if not self.image_bytes:
            return

        files = {'arquivo_imagem': (TEST_IMAGE_FILENAME, self.image_bytes, 'image/jpeg')}
        
        with self.client.post("/reconhecer", files=files, catch_response=True) as response:
            try:
                if response.status_code == 200:
                    json_response = response.json()
                    if json_response.get("acesso") == "permitido":
                        response.success()
                    else:
                        response.failure(f"Acesso negado: {json_response.get('nome')}")
                else:
                    response.failure(f"Erro HTTP: {response.status_code} - {response.text}")
            except Exception as e:
                response.failure(f"Erro ao processar resposta JSON: {e} - Resposta: {response.text}")