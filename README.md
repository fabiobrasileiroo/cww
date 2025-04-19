# Cww

## RFs (Requisitos funcionais)

> obs: é uma declaração de como um sistema deve se comportar

- [x] RF01: Implementar página inicial.
- [x] RF02-UI: Implementar listagem de eventos.
- [] RF02-Back: Implementar listagem de eventos do banco de dado.
- [x] RF03: Implementar Register/Login/Logout com jwt.

- [x] RF04-UI: Implementar criação de evento. Giovani
- [] RF04-Back: Implementar criação de evento. Giovani
- [x] RF05-UI: Implementar Calendario de eventos.
- [] RF05-Back: Implementar Calendario de eventos.
- [] RF06-UI: Implementar Meu perfil/Configuração.
- [] RF06-Back: Implementar Meu perfil/Configuração.
  faser como uma server action
- [] RF07-UI: Implementar Gerenciamento de eventos.
- [] RF07-Back: Implementar Gerenciamento de eventos.
- [ ] RF08-Back-UI: Implementar funcionalidade de evento de imagem pelo imgBB.
- [ ] RF09-Back-UI: Implementar envio de e-mail para usuário ao esquecer a senha para mudar a senha.
- [] RF10-Back-Ui: Implementar relatório de usuário e eventos.
- [x] RF11: Implementar registro de novos usuários.
- [] RF12: Implementar controle de permissões por nível de usuário.
- [] RF13: Implementar envio de e-mail para usuarios para redefinir a senha.
- [] RF14: Implementar crud de usuários para gerenciar perfis de usuários.

## RNs (Regras de negócio)

> obs: descreve um aspecto do negócio, definindo ou restringindo tanto sua estrutura quanto seu comportamento

- [] RN01: Um evento criado pelo usuário deve ser aprovado apenas por um admin/root.

## RNFs (requisitos não-funcionais)

> obs: são os requisitos relacionados ao uso da aplicação em termos de desempenho, usabilidade, confiabilidade, segurança, disponibilidade, manutenção e tecnologias envolvidas. Estes requisitos dizem respeito a como as funcionalidades serão entregues ao usuário do software

- [x] RNF01: Garantir segurança dos dados (criptografia).
- [x] RNF02: Autenticação e autorização.
- [ ] RNF03: Integração fácil com outros serviços.

# Dicas uteis

update prisma client

```bash
npx prisma generate
```

para fazer uma migrate

```bash
npx prisma migrate dev --name init

npx prisma studio
```
