# ERP Showroom Backend

Este backend está construido con FastAPI y SQLAlchemy para la gestión de productos.

## Requisitos

- Python 3.12
- `venv` o entorno virtual

## Instalación

```bash
cd /home/nico/erp-showroom/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Ejecutar

```bash
cd /home/nico/erp-showroom/backend
source .venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## Endpoints

- `GET /` - comprobación del servidor
- `POST /productos/` - crear producto
- `GET /productos/` - listar productos

## Notas

- No guardes `venv`, `.venv`, ni archivos `.db` en Git.
- Si se necesita, usa `pip install -r requirements.txt` para reconstruir el entorno.
