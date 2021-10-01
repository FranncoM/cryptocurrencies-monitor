# Cryptocurrencies Monitor
API REST para consumir un servicio externo y utilizar su información.

## Version de node utilizada
- Node.js v.14.17.6

## Instrucciones para iniciar
- Instalar dependencias necesarias ***npm install***
- Crear un archivo ***.env***, usar el archivo ***.env.sample*** ubicado en la raíz del proyecto.
- Ejecutar aplicación en entorno de desarrollo ***npm run dev***.

## API

#### Rutas
| Método http | Ruta | Descripción | Datos body |
| --- | --- | --- | --- |
`GET` | `/api/v1/coins/:coin` | Devuelve una moneda por su id | {coin: String}
`GET` | `/api/v1/user` | Devueve datos del usuario | token 
`POST` | `/api/v1/coins/all` | Devuelve un listado de monedas ( 100 monedas por consulta) | `page`: Number , `order`: String, `currency`: String ("ars","usd","eur"),`currencySort`:String
`POST` | `/api/v1/user` | Crea un usuario | { `userName`:String, `name`:String, `lastName`:String, `passwor`:String, `topCoins`:[String] }   
`POST` | `/api/v1/user/addCoins` | Agrega monedas al topN del usuario | Order results by volume (descending)
`POST` | `/api/v1/login` | Login de usuario | Order results by coin name (ascending)


#### Códigos de estado
-en progreso...
