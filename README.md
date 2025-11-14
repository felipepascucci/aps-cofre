# Cofre de Segurança com Reconhecimento Facial 🔐

## 1. Descrição do Projeto

Este projeto é uma solução de software full-stack desenvolvida para controlar o acesso a um cofre de segurança máxima fictício, utilizando reconhecimento facial em tempo real. A aplicação é construída com uma arquitetura moderna, separando o backend (API FastAPI) do frontend (Interface React).

O sistema autentica usuários via webcam e autoriza o acesso com base em um esquema de permissões hierárquico. Após a autenticação, o usuário é redirecionado para um portal de documentos seguro, onde pode visualizar arquivos confidenciais correspondentes ao seu nível de acesso.

## ✨ 2. Funcionalidades Principais

* **Reconhecimento Facial em Tempo Real:** Utiliza a webcam para identificar e autenticar usuários de forma contínua.
* **Proteção Anti-Spoofing:** A tolerância de reconhecimento é ajustada para um nível rigoroso (0.55) para rejeitar tentativas de falsificação usando fotos 2D (como em um celular), aumentando drasticamente a segurança.
* **Portal de Documentos Seguro:** Após a autenticação, usuários são redirecionados para páginas de nível (Nível 1, 2 ou 3) que funcionam como um portal de documentos.
* **Controle de Acesso Hierárquico:**
    * **Nível 1 (Geral):** Vê apenas documentos de Nível 1.
    * **Nível 2 (Diretor):** Vê documentos de Nível 1 e 2.
    * **Nível 3 (Ministro):** Vê todos os documentos (Nível 1, 2 e 3).
* **Área Administrativa Segura:** A página de cadastro (`/cadastro`) é protegida por um login e senha estáticos, garantindo que apenas administradores registrem novos usuários.
* **Cadastro Flexível de Usuários:** Permite o registro de novas faces através de duas opções:
    1.  **Upload de Arquivo:** Envio de uma foto existente, com opção de remover a seleção.
    2.  **Captura via Webcam:** Tira uma foto na hora através de um pop-up (modal) na interface.
* **Auditoria de Acessos:** Todas as tentativas de acesso, bem-sucedidas ou não, são registradas em log no banco de dados para fins de segurança e rastreabilidade.
* **Rotas Protegidas:** As páginas do portal de documentos (`/nivel-1`, etc.) são protegidas e não podem ser acessadas diretamente pela URL, redirecionando usuários não autorizados de volta para a câmera.
* **Interface Moderna e Polida:** Interface com tema escuro, animações e feedback visual claro (ícones '✓' e 'X' animados) para sucesso ou falha na autenticação, construída em React.
* **Tratamento de Erros Robusto:** A API possui um handler global de exceções que captura qualquer erro inesperado no servidor (ex: falha no banco de dados) e retorna uma mensagem de erro JSON padronizada.
* **Inicialização de Dados:** O sistema popula automaticamente a tabela `niveis_acesso` no banco de dados na primeira vez que o servidor é iniciado, garantindo que os dados essenciais estejam sempre presentes.

## ⚙️ 3. Tecnologias Utilizadas

* **Backend:**
    * Python 3.9+
    * FastAPI (API REST)
    * SQLAlchemy (ORM)
    * PostgreSQL (Banco de dados relacional)
    * `face_recognition` & `dlib` (Lógica de reconhecimento facial)
    * OpenCV (Manipulação de imagens)
    * Locust (Testes de carga e desempenho)
* **Frontend:**
    * React 18+ (com Hooks)
    * Vite (Build e servidor de desenvolvimento)
    * `react-router-dom` (Roteamento de páginas)
    * `lucide-react`, `react-icons` (Ícones da interface)
    * CSS3 (Estilização moderna)

## 🚀 4. Guia de Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto em uma nova máquina.

### 4.1. Pré-requisitos

* **Python (versão 3.9 ou superior)**
* **Node.js e npm** (recomenda-se a versão LTS)
* **PostgreSQL** (servidor de banco de dados)
* **Ferramentas de Build C++ e CMake:** Essencial para a instalação da biblioteca `dlib`.
    * **Windows:** Instale o Visual Studio Build Tools e, no instalador, marque a carga de trabalho "Desenvolvimento para desktop com C++".
    * **macOS:** Execute no terminal: `xcode-select --install`
    * **Linux (Debian/Ubuntu):** Execute no terminal: `sudo apt-get install build-essential cmake`

### 4.2. Configuração do Backend (Servidor)

1.  Navegue para a pasta do servidor:
    ```bash
    cd server
    ```
2.  Crie e ative um ambiente virtual:
    ```bash
    python -m venv venv
    venv\Scripts\activate  # Windows
    # source venv/bin/activate  # macOS/Linux
    ```
3.  Crie um arquivo `requirements.txt` dentro da pasta `server` com o conteúdo abaixo:
    ```txt
    fastapi
    uvicorn[standard]
    sqlalchemy
    psycopg2-binary
    face_recognition
    opencv-python
    python-multipart
    fastapi-cors
    locust
    ```
4.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```

### 4.3. Configuração do Banco de Dados

1.  Abra seu cliente PostgreSQL (DBeaver, psql, etc.).
2.  Crie um novo banco de dados. Recomendamos um nome dedicado:
    ```sql
    CREATE DATABASE cofre_seguranca;
    ```
3.  Abra o arquivo `server/database.py`.
4.  Localize a linha `SQLALCHEMY_DATABASE_URL` e **atualize-a** com sua senha e o nome do banco de dados que você criou:
    ```python
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:SUA_SENHA@localhost:5432/cofre_seguranca"
    ```
5.  *Não é necessário popular a tabela `niveis_acesso` manualmente. O servidor fará isso automaticamente na primeira inicialização.*

### 4.4. Configuração do Frontend (Interface)

1.  Em um **novo terminal**, navegue para a pasta do frontend:
    ```bash
    cd react-ui
    ```
2.  Instale todas as dependências do Node.js (incluindo React Router, etc.):
    ```bash
    npm install
    ```
3.  **Importante:** Crie a pasta para os documentos de exemplo. Dentro de `react-ui`, crie a pasta `public` (se ela não existir) e dentro dela, uma pasta `docs`:
    ```bash
    mkdir -p public/docs
    ```
4.  Adicione seus arquivos PDF de exemplo (ex: `RELATORIO_GERAL.pdf`, `DECRETO_MINISTERIAL.pdf`, etc.) dentro da pasta `react-ui/public/docs/`.

### 4.5. Executando a Aplicação

Você precisará de **dois terminais** abertos simultaneamente.

**Terminal 1 - Backend:**

```bash
# Navegue até a pasta raiz do projeto (ex: aps-cofre)
# Ative o ambiente virtual do Python:
server\venv\Scripts\activate

# Inicie o servidor FastAPI a partir da raiz
uvicorn server.main:app --reload
```

O backend estará rodando em `http://127.0.0.1:8000`.

**Terminal 2 - Frontend:**

```bash
# Navegue até a pasta do frontend
cd react-ui

# Inicie o servidor de desenvolvimento do React
npm run dev
```

O frontend estará rodando em `http://localhost:5173/`. **Acesse esta URL** no seu navegador.

### 4.6. Como Usar

1.  Para cadastrar um usuário, acesse a rota de administração: `http://localhost:5173/cadastro`.
2.  Faça o login com as credenciais padrão:
      * **Usuário:** `admin`
      * **Senha:** `admin`
3.  Use o formulário para cadastrar um novo rosto (upload ou captura pela webcam).
4.  Acesse a página principal (`http://localhost:5173/`) para iniciar o reconhecimento facial.
5.  Após um reconhecimento bem-sucedido, você será redirecionado para o seu portal de documentos seguro.

## 🧪 5. Testes de Desempenho (Opcional)

O projeto inclui scripts para realizar testes de carga e escalabilidade.

### 5.1. Popular o Banco com Dados em Massa

Para simular um banco de dados com muitos usuários:

1.  Certifique-se de que o backend **não** está rodando.
2.  No terminal, na pasta raiz do projeto, ative o ambiente virtual (`server\venv\Scripts\activate`).
3.  Execute o script `populate_db.py`:
    ```bash
    python -m server.populate_db
    ```
    Isso irá inserir 5.000 usuários "falsos" no banco para o teste.

### 5.2. Rodar o Teste de Carga (Locust)

1.  Garanta que seu servidor backend (FastAPI) esteja rodando no **Terminal 1**, mas sem a flag `--reload` (para performance máxima):
    ```bash
    uvicorn server.main:app
    ```
2.  No **Terminal 2**, na pasta raiz, ative o ambiente virtual e execute o Locust apontando para o arquivo de teste correto:
    ```bash
    python -m locust -f server/test/locustfile.py
    ```
3.  Abra a interface web do Locust em `http://localhost:8089`.
4.  Configure o teste:
      * **Number of users:** `100` (ou quantos desejar)
      * **Spawn rate:** `10`
      * **Host:** `http://127.0.0.1:8000`
5.  Clique em "Start swarming" para iniciar o teste e analisar a performance do endpoint `/reconhecer` sob carga pesada.

<!-- end list -->
