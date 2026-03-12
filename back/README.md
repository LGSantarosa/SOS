# SOS - Backend

API/servico em Python.

## Estrutura

- `main.py` - ponto de entrada
- `requirements.txt` - dependencias
- `certs/` - instrucoes para certificado HTTPS local

## Como rodar

1. Crie e ative um ambiente virtual (recomendado):
   ```bash
   cd back
   python3 -m venv venv
   source venv/bin/activate   # Linux/macOS
   # ou: venv\Scripts\activate   # Windows
   ```

2. Instale as dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute:
   ```bash
   python3 main.py
   ```

## HTTPS local

Use `mkcert` para gerar certificado local confiavel. Instrucoes em `certs/README.md`.
