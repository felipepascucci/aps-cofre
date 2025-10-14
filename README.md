# Cofre de Segurança com Reconhecimento Facial 🔐

## Descrição do Projeto

Este projeto é uma solução de software desenvolvida para controlar o acesso a um cofre de segurança máxima fictício, utilizando reconhecimento facial em tempo real. A aplicação é construída com uma arquitetura full-stack moderna, separando o backend (serviço de API) do frontend (interface do usuário).

O sistema autentica usuários através de suas webcams e autoriza o acesso com base em um esquema de permissões de três níveis, garantindo que apenas pessoal autorizado possa interagir com o sistema, com redirecionamentos para áreas específicas de acordo com seu nível de privilégio.

## ✨ Funcionalidades Principais

* **Reconhecimento Facial em Tempo Real:** Utiliza a webcam para identificar e autenticar usuários de forma contínua.
* **Controle de Acesso em Níveis:**
    * **Nível 1 (Geral):** Acesso a uma página de boas-vindas genérica.
    * **Nível 2 (Diretor):** Acesso a uma página de nível de diretoria.
    * **Nível 3 (Ministro):** Acesso a uma página exclusiva de nível máximo.
* **Área Administrativa Segura:** Uma página de cadastro (`/cadastro`) protegida por login e senha para registrar novos usuários autorizados.
* **Cadastro Flexível de Usuários:** Permite o registro de novas faces através de duas opções:
    1.  **Upload de Arquivo:** Envio de uma foto existente.
    2.  **Captura via Webcam:** Tira uma foto na hora através de um pop-up na interface.
* **Auditoria de Acessos:** Todas as tentativas de acesso, bem-sucedidas ou não, são registradas em um banco de dados para fins de segurança e auditoria.
* **Interface Moderna e Responsiva:** Interface com tema escuro, animações e feedback visual claro para o usuário, construída em React.
* **Rotas Protegidas:** As páginas de nível de acesso não podem ser acessadas diretamente pela URL sem uma autenticação facial prévia na sessão.

## ⚙️ Tecnologias Utilizadas

* **Backend:**
    * Python 3.9+
    * FastAPI (para a criação da API REST)
    * SQLAlchemy (ORM para comunicação com o banco de dados)
    * PostgreSQL (Banco de dados relacional)
    * `face_recognition` & `dlib` (Para a lógica de reconhecimento facial)
    * OpenCV (Para manipulação de imagens)
* **Frontend:**
    * React 18+
    * Vite (Ferramenta de build e servidor de desenvolvimento)
    * JavaScript (ES6+)
    * `react-router-dom` (Para navegação e rotas)
    * CSS3 (Para estilização)


## 🚀 Guia de Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto em uma nova máquina.

### 1. Pré-requisitos

Antes de começar, garanta que você tem os seguintes softwares instalados:

* **Python (versão 3.9 ou superior)**
* **Node.js e npm** (recomenda-se a versão LTS)
* **PostgreSQL** (servidor de banco de dados)
* **Ferramentas de Build C++ (https://visualstudio.microsoft.com/pt-br/vs) e CMake (https://cmake.org/download):** Essencial para a instalação da biblioteca `dlib`


### 2. Configuração do Backend

# 1. Navegue para a pasta do servidor
cd server

# 2. Crie um ambiente virtual (recomendado)
python -m venv venv

# 3. Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Instale as dependências Python
pip install -r requirements.txt


### 3. Configuração do Banco de Dados

1.  Abra seu cliente PostgreSQL (como o DBeaver ou `psql`).
2.  Crie um novo banco de dados. Ex: `CREATE DATABASE postgres;`
3.  Abra o arquivo `server/database.py`.
4.  Localize a linha `SQLALCHEMY_DATABASE_URL` e **atualize a sua senha** e o nome do banco de dados, se for diferente:
    
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:SUA_SENHA@localhost:5432/postgres"


### 4. Configuração do Frontend

# 1. Em um novo terminal, navegue para a pasta do frontend
cd react-ui

# 2. Instale as dependências do Node.js
npm install


### 5. Executando a Aplicação

Você precisará de **dois terminais** abertos simultaneamente.

**Terminal 1 - Backend:**

# Estando na pasta raiz do projeto (aps-cofre)
# Ative o ambiente virtual do Python primeiro!
cd server
venv\Scripts\activate # ou source venv/bin/activate

# Volte para a raiz
cd .. 

# Inicie o servidor FastAPI
uvicorn server.main:app --reload

O servidor backend estará rodando em `http://127.0.0.1:8000`.

**Terminal 2 - Frontend:**

# Estando na pasta do frontend (react-ui)
cd react-ui

# Inicie o servidor de desenvolvimento do React
npm run dev

O servidor frontend estará rodando em um endereço como `http://localhost:5173/`. **Acesse esta URL** no seu navegador.

### 6. Como Usar

1.  Para cadastrar um usuário, acesse a rota de administração digitando no navegador: `http://localhost:5173/cadastro`.
2.  Faça o login com as credenciais padrão:
    * **Usuário:** `admin`
    * **Senha:** `admin`
3.  Use o formulário para cadastrar um novo rosto, seja por upload de arquivo ou capturando uma foto com a webcam.
4.  Acesse a página principal (`http://localhost:5173/`) para iniciar o reconhecimento facial.
5.  Após um reconhecimento bem-sucedido, você será redirecionado para a página correspondente ao seu nível de acesso.