# InPages

InPages é uma plataforma web inspirada no Letterboxd, voltada para amantes de livros de tecnologia. Permite pesquisar, favoritar, avaliar, comentar, criar postagens, seguir outros usuários e organizar sua biblioteca pessoal.

## Funcionalidades

- **Pesquisa de Livros:** Busca em banco local e na API do Google Books.
- **Favoritos:** Cada usuário tem sua própria lista de favoritos.
- **Biblioteca:** Organize livros lidos e não lidos.
- **Reviews:** Avalie livros com estrelas (incluindo meia estrela) e escreva comentários.
- **Feed Social:** Veja postagens dos usuários que você segue.
- **Sistema de seguidores:** Siga/desfaça seguidores e veja postagens dos seguidos.
- **Perfil:** Edite seu nome e visualize informações pessoais.
- **Login/Cadastro:** Autenticação simples por email e senha.
- **Categorias:** Explore livros por categorias, com filtragem aprimorada.
- **Integração com Google Books:** Amplie o catálogo e a busca de livros.
- **Design Responsivo:** Interface moderna e adaptável.

## Instalação e Execução

### Pré-requisitos
- Node.js (v18 ou superior recomendado)
- npm (geralmente já vem com o Node)

### Backend (Clone do repositório InPages-ServerSide)

1. Acesse a pasta do backend:
   ```bash
   cd serverSide
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Instale o nodemon globalmente (opcional, mas recomendado para desenvolvimento):
   ```bash
   npm install -g nodemon
   ```
4. Inicie o servidor (modo desenvolvimento):
   ```bash
   nodemon app.js
   ```
   Ou, se preferir rodar sem nodemon:
   ```bash
   node app.js
   ```
5. O backend estará disponível em `http://localhost:8000`

### Frontend

1. Acesse a pasta do frontend:
   ```bash
   cd inpages
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o frontend:
   ```bash
   npm start
   ```
4. O frontend estará disponível em `http://localhost:3000`

## Como usar

1. Cadastre-se e faça login.
2. Pesquise livros e adicione aos favoritos ou à biblioteca.
3. Marque livros como lidos/não lidos.
4. Escreva reviews e avalie livros.
5. Siga outros usuários para ver postagens no feed.
6. Crie postagens e compartilhe suas leituras.
7. Edite seu perfil a qualquer momento.

## Tecnologias

- **Frontend:** React, Styled-components, Axios
- **Backend:** Node.js, Express, JSON como banco de dados simples
- **APIs:** Google Books

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests!

---

**Desenvolvido por [LeoGundes]**
