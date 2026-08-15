# ERP Showroom - Ejecución desde USB

## Requisitos

- Python 3
- Node.js
- Pip
- NPM

## Uso

1. Copiar todo el proyecto al USB.
2. Abrir una terminal en la carpeta del proyecto.
3. Ejecutar:

```bash
chmod +x run.sh
./run.sh
```

4. Abrir en el navegador:

- `http://localhost:8000`

## Notas

- La base de datos SQLite está en `backend/erp_showroom.db`.
- Si `frontend/dist` no existe, el script construye el frontend automáticamente.
- El backend servirá el frontend compilado desde `frontend/dist`.
