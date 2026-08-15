#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Build frontend if needed
cd "$ROOT_DIR/frontend"
if [ ! -d dist ]; then
  echo "Construyendo frontend..."
  npm install
  npm run build
fi

# Iniciar backend
cd "$ROOT_DIR/backend"
if [ -x ".venv/bin/python" ]; then
  PYTHON="./.venv/bin/python"
elif command -v python3 >/dev/null 2>&1; then
  PYTHON="python3"
else
  echo "Python no encontrado. Instala Python 3 y vuelve a ejecutar."
  exit 1
fi

"$PYTHON" -m uvicorn app.main:app --host 0.0.0.0 --port 8000
