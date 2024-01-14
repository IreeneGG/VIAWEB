from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pymysql
import jwt
import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# Configuración de la conexión a la base de datos MySQL
db = pymysql.connect(
    host="localhost",
    user="root",
    password="1234",
    db="autentificacion",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor
)


app = FastAPI(
    title="API de Autenticación",
    description="API para autenticación de usuarios y gestión de destinos favoritos.",
    version="1.0.0",
    docs_url="/docs",  # Ruta para la documentación de Swagger
    redoc_url="/redoc",  # Ruta para la documentación ReDoc
)

# Añadir el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las origenes
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos
    allow_headers=["*"],  # Permite todos los encabezados
)

# Clave secreta para la generación del token JWT
SECRET_KEY = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Modelo Pydantic para el registro y login de usuarios
class User(BaseModel):
    username: str
    password: str

# Función para crear un token JWT
def create_jwt_token(data: dict):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data.update({"exp": expiration})
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

# Ruta para generar el token JWT
@app.post("/auth/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    cursor = db.cursor()
    query = "SELECT * FROM users WHERE username=%s AND password=%s"
    cursor.execute(query, (form_data.username, form_data.password))
    user = cursor.fetchone()
    cursor.close()

    if user:
        token = create_jwt_token({"sub": user["username"]})
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

# Ruta para registrar un nuevo usuario
@app.post("/auth/register")
async def register(user_data: User):
    cursor = db.cursor()
    
    # Verificar si el usuario ya existe en la base de datos
    query = "SELECT * FROM users WHERE username=%s"
    cursor.execute(query, (user_data.username,))
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    # Insertar el nuevo usuario en la base de datos
    insert_query = "INSERT INTO users (username, password) VALUES (%s, %s)"
    cursor.execute(insert_query, (user_data.username, user_data.password))
    
    db.commit()
    cursor.close()
    
    return {"message": "Usuario registrado exitosamente"}

# Función para obtener el usuario actual
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Credencial inválida")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Credencial inválida")

# Ruta protegida que requiere autenticación
@app.get("/auth/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

class AddFavoriteDestination(BaseModel):
    destination: str  # Nombre del destino (string)
    
class DeleteFavoriteDestination(BaseModel):
    destination: str  # Nombre del destino (string)

# Ruta para agregar un nuevo destino favorito
@app.post("/auth/favorite-destinations")
async def add_favorite_destination(
    favorite_data: AddFavoriteDestination, current_user: str = Depends(get_current_user)
):
    cursor = db.cursor()

    # Inserta el nuevo destino favorito en la base de datos
    insert_query = "INSERT INTO favorite_destinations (user_id, destination) VALUES (%s, %s)"
    cursor.execute(insert_query, (current_user, favorite_data.destination))

    db.commit()
    cursor.close()

    return {"message": "Destino favorito agregado exitosamente"}

# Ruta para eliminar un destino favorito
@app.delete("/auth/favorite-destinations/delete")
async def delete_favorite_destination(
    favorite_data: DeleteFavoriteDestination, current_user: str = Depends(get_current_user)
):
    cursor = db.cursor()

    # Elimina el destino de favoritos de la base de datos
    delete_query = "DELETE FROM favorite_destinations WHERE user_id = %s AND destination = %s"
    cursor.execute(delete_query, (current_user, favorite_data.destination))

    if cursor.rowcount == 0:
        cursor.close()
        raise HTTPException(status_code=404, detail="Destino no encontrado en favoritos")

    db.commit()
    cursor.close()

    return {"message": "Destino favorito eliminado exitosamente"}

# Ruta para obtener todos los destinos favoritos del usuario
@app.get("/auth/favorite-destinations/all", response_model=list)
async def get_all_favorite_destinations(current_user: str = Depends(get_current_user)):
    cursor = db.cursor()

    # Obtener todos los destinos favoritos del usuario
    select_query = "SELECT destination FROM favorite_destinations WHERE user_id = %s"
    cursor.execute(select_query, (current_user,))
    favorite_destinations = cursor.fetchall()

    cursor.close()

    return [destination["destination"] for destination in favorite_destinations]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
