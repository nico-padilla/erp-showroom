from fastapi import FastAPI

app = FastAPI(
    title="ERP María Paz Showroom",
    version="0.1.0"
)

@app.get("/")
def inicio():
    return {
        "mensaje": "Bienvenido al ERP María Paz Showroom",
        "estado": "Funcionando"
    }