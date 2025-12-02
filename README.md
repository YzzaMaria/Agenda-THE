# Agenda-THE
O Sistema Agenda THE centraliza a divulgação e curadoria de eventos culturais,sociais e de lazer da capital piauiense.  
# Agenda THE 🎭

Um sistema completo de gestão de eventos culturais com perfis múltiplos, sistema de recompensas e banco de dados SQLite.

## ✨ Funcionalidades

- **4 Perfis de Usuário**: Usuário Final, Produtor, Curador e Parceiro
- **Sistema de Recompensas**: Badges e pontos por participação
- **API RESTful**: Backend Node.js + Express
- **Banco de Dados**: SQLite3 integrado
- **Frontend Mobile-first**: Design responsivo

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite3
- **Estilização**: CSS Puro com design mobile-first

## 📁 Estrutura do Projeto 
agenda-the/
├──frontend/ # Interface do usuário
│├── index.html
│├── css/
│└── js/
├──backend/ # API e servidor
│├── server.js
│├── database/
│└── package.json
└──README.md



## 🚀 Como Executar

### Pré-requisitos
- Node.js 14+
- NPM ou Yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/agenda-the.git

# Entre na pasta do projeto
cd agenda-the

# Instale as dependências do backend
cd backend
npm install

# Inicialize o banco de dados
node database/recriar-banco-completo.js

# Inicie o servidor
node server.js
 

