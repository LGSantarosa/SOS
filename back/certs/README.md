# Certificados (desenvolvimento)

A pasta `certs/` existe para voce gerar certificado local quando precisar.

## Igual ao GitHub?

Nao da para criar o mesmo certificado do GitHub (ele usa CA publica em dominio real).
Para ambiente local, o mais proximo e usar **mkcert**, que cria certificado confiavel na sua maquina.

## Como gerar (mkcert)

1. Instale o mkcert
2. Rode os comandos abaixo dentro de `back/certs`:

```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

Isso gera arquivos como:
- `localhost+2.pem` (certificado)
- `localhost+2-key.pem` (chave)

Esses arquivos ficam ignorados pelo Git.
