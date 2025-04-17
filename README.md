# Product Management System - Frontend

Este repositório contém o frontend do Sistema de Gerenciamento de Produtos, desenvolvido com Angular 19.

## Requisitos

- Node.js (v18 ou superior)
- Angular CLI (v19 ou superior)
- Docker e Docker Compose (opcional, para ambiente containerizado)

### Recomendações

``` Rodar no docker para facilitar ```

## Configuração do Ambiente

### Instalação de Dependências

Execute o seguinte comando para instalar as dependências:

```bash
npm install
```

### Instalação do Angular CLI

Se você ainda não tem o Angular CLI instalado:

```bash
npm install -g @angular/cli
```

## Executando o Projeto

### Modo de Desenvolvimento

```bash
npm start
# ou
ng serve
```

Por padrão, a aplicação será executada em `http://localhost:4200`.

Opções adicionais:

```bash
# Para permitir acesso externo
ng serve --host 0.0.0.0

# Para usar uma porta diferente
ng serve --port 4201

# Para abrir automaticamente no navegador
ng serve --open
```

### Build para Produção

```bash
npm run build
# ou
ng build
```

Os arquivos compilados serão armazenados no diretório `dist/frontend/browser`.

## Testes

### Executando Testes Unitários

```bash
npm test
# ou
ng test
```

### Modo de Observação para Testes

```bash
ng test --watch
```

### Cobertura de Testes

```bash
ng test --code-coverage
```

Os relatórios de cobertura serão gerados no diretório `coverage/`.

## Docker

### Construir e Iniciar o Contêiner

```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:80`.

### Parar o Contêiner

```bash
docker-compose down
```

### Construir Imagem Docker Manualmente

```bash
docker build -t product-management-frontend .
```

### Executar Contêiner Manualmente

```bash
docker run -p 80:80 product-management-frontend
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/    # Componentes da aplicação
│   ├── models/        # Interfaces e classes de modelo
│   ├── services/      # Serviços para comunicação com a API
│   ├── shared/        # Componentes, diretivas e pipes compartilhados
│   └── app.module.ts  # Módulo principal da aplicação
├── assets/           # Recursos estáticos
├── environments/     # Configurações de ambiente
└── index.html        # HTML principal
```

## Configuração de Proxy para Desenvolvimento

Se necessário, você pode configurar um proxy para redirecionar as requisições da API durante o desenvolvimento. Crie um arquivo `proxy.conf.json` na raiz do projeto:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

E execute com:

```bash
ng serve --proxy-config proxy.conf.json
```

## Configuração do Nginx

O arquivo `nginx.conf` incluído configura o servidor Nginx para:

1. Servir a aplicação Angular
2. Redirecionar as requisições da API para o backend
3. Lidar corretamente com o roteamento Angular

Este arquivo é usado automaticamente quando a aplicação é executada em contêineres Docker.