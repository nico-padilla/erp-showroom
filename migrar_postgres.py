import os
import sqlite3
from sqlalchemy import create_engine, text


SQLITE_DB = "backend/app/erp_showroom.db"

DATABASE_URL = os.environ["DATABASE_URL"]

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg2://",
        1
    )

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

sqlite = sqlite3.connect(SQLITE_DB)
sqlite.row_factory = sqlite3.Row
cur = sqlite.cursor()


print()
print("==========================================")
print(" MIGRACIÓN ERP SHOWROOM")
print("==========================================")
print()


CREATE_TABLES = """

CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY,
    codigo VARCHAR NOT NULL UNIQUE,
    codigo_barras VARCHAR UNIQUE,
    nombre VARCHAR NOT NULL,
    descripcion VARCHAR,
    categoria VARCHAR,
    marca VARCHAR,
    talle VARCHAR,
    color VARCHAR,
    precio_compra FLOAT,
    precio_venta FLOAT,
    stock INTEGER,
    stock_minimo INTEGER,
    imagen VARCHAR,
    activo BOOLEAN
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR,
    apellido VARCHAR,
    telefono VARCHAR UNIQUE,
    email VARCHAR,
    instagram VARCHAR
);

CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY,
    cliente_id INTEGER,
    total FLOAT,
    metodo_pago VARCHAR,
    fecha TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INTEGER PRIMARY KEY,
    venta_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER,
    precio_unitario FLOAT
);

CREATE TABLE IF NOT EXISTS movimientos_stock (
    id INTEGER PRIMARY KEY,
    producto_id INTEGER,
    tipo VARCHAR NOT NULL,
    cantidad INTEGER NOT NULL,
    motivo VARCHAR,
    fecha TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimientos_caja (
    id INTEGER PRIMARY KEY,
    tipo VARCHAR,
    concepto VARCHAR,
    monto FLOAT,
    fecha TIMESTAMP
);

"""


with engine.begin() as pg:

    print("Creando tablas...")

    for statement in CREATE_TABLES.split(";"):
        statement = statement.strip()

        if statement:
            pg.execute(text(statement))

    print("Tablas listas.")
    print()

    print("Limpiando datos anteriores de PostgreSQL...")

    pg.execute(text("DELETE FROM detalle_ventas"))
    pg.execute(text("DELETE FROM movimientos_stock"))
    pg.execute(text("DELETE FROM movimientos_caja"))
    pg.execute(text("DELETE FROM ventas"))
    pg.execute(text("DELETE FROM clientes"))
    pg.execute(text("DELETE FROM productos"))

    print("Base PostgreSQL limpia.")
    print()


    # PRODUCTOS

    print("Migrando productos...")

    productos = cur.execute(
        "SELECT * FROM productos ORDER BY id"
    ).fetchall()

    for p in productos:

        datos = dict(p)

        datos["activo"] = bool(datos["activo"])

        pg.execute(
            text("""
                INSERT INTO productos (
                    id,
                    codigo,
                    codigo_barras,
                    nombre,
                    descripcion,
                    categoria,
                    marca,
                    talle,
                    color,
                    precio_compra,
                    precio_venta,
                    stock,
                    stock_minimo,
                    imagen,
                    activo
                )
                VALUES (
                    :id,
                    :codigo,
                    :codigo_barras,
                    :nombre,
                    :descripcion,
                    :categoria,
                    :marca,
                    :talle,
                    :color,
                    :precio_compra,
                    :precio_venta,
                    :stock,
                    :stock_minimo,
                    :imagen,
                    :activo
                )
            """),
            datos
        )

    print(f"Productos migrados: {len(productos)}")
    print()


    # CLIENTES

    print("Migrando clientes...")

    clientes = cur.execute(
        "SELECT * FROM clientes ORDER BY id"
    ).fetchall()

    for c in clientes:

        pg.execute(
            text("""
                INSERT INTO clientes (
                    id,
                    nombre,
                    apellido,
                    telefono,
                    email,
                    instagram
                )
                VALUES (
                    :id,
                    :nombre,
                    :apellido,
                    :telefono,
                    :email,
                    :instagram
                )
            """),
            dict(c)
        )

    print(f"Clientes migrados: {len(clientes)}")
    print()


    # VENTAS

    print("Migrando ventas...")

    ventas = cur.execute(
        "SELECT * FROM ventas ORDER BY id"
    ).fetchall()

    for v in ventas:

        pg.execute(
            text("""
                INSERT INTO ventas (
                    id,
                    cliente_id,
                    total,
                    metodo_pago,
                    fecha
                )
                VALUES (
                    :id,
                    :cliente_id,
                    :total,
                    :metodo_pago,
                    :fecha
                )
            """),
            dict(v)
        )

    print(f"Ventas migradas: {len(ventas)}")
    print()


    # DETALLES

    print("Migrando detalles de ventas...")

    detalles = cur.execute(
        "SELECT * FROM detalle_ventas ORDER BY id"
    ).fetchall()

    for d in detalles:

        pg.execute(
            text("""
                INSERT INTO detalle_ventas (
                    id,
                    venta_id,
                    producto_id,
                    cantidad,
                    precio_unitario
                )
                VALUES (
                    :id,
                    :venta_id,
                    :producto_id,
                    :cantidad,
                    :precio_unitario
                )
            """),
            dict(d)
        )

    print(f"Detalles migrados: {len(detalles)}")
    print()


    # MOVIMIENTOS STOCK

    print("Migrando movimientos de stock...")

    movimientos_stock = cur.execute(
        "SELECT * FROM movimientos_stock ORDER BY id"
    ).fetchall()

    for m in movimientos_stock:

        pg.execute(
            text("""
                INSERT INTO movimientos_stock (
                    id,
                    producto_id,
                    tipo,
                    cantidad,
                    motivo,
                    fecha
                )
                VALUES (
                    :id,
                    :producto_id,
                    :tipo,
                    :cantidad,
                    :motivo,
                    :fecha
                )
            """),
            dict(m)
        )

    print(
        f"Movimientos de stock migrados: "
        f"{len(movimientos_stock)}"
    )
    print()


    # MOVIMIENTOS CAJA

    print("Migrando movimientos de caja...")

    movimientos_caja = cur.execute(
        "SELECT * FROM movimientos_caja ORDER BY id"
    ).fetchall()

    for m in movimientos_caja:

        pg.execute(
            text("""
                INSERT INTO movimientos_caja (
                    id,
                    tipo,
                    concepto,
                    monto,
                    fecha
                )
                VALUES (
                    :id,
                    :tipo,
                    :concepto,
                    :monto,
                    :fecha
                )
            """),
            dict(m)
        )

    print(
        f"Movimientos de caja migrados: "
        f"{len(movimientos_caja)}"
    )
    print()


    # SECUENCIAS

    print("Ajustando secuencias...")

    tablas = [
        "productos",
        "clientes",
        "ventas",
        "detalle_ventas",
        "movimientos_stock",
        "movimientos_caja"
    ]

    for tabla in tablas:

        pg.execute(
            text(
                f"""
                SELECT setval(
                    pg_get_serial_sequence(
                        '{tabla}',
                        'id'
                    ),
                    COALESCE(
                        (SELECT MAX(id) FROM {tabla}),
                        1
                    ),
                    true
                )
                """
            )
        )

    print("Secuencias ajustadas.")
    print()


sqlite.close()


print("==========================================")
print(" MIGRACIÓN FINALIZADA CORRECTAMENTE")
print("==========================================")
print()
print("Productos:", len(productos))
print("Clientes:", len(clientes))
print("Ventas:", len(ventas))
print("Detalles:", len(detalles))
print("Movimientos stock:", len(movimientos_stock))
print("Movimientos caja:", len(movimientos_caja))
print()
