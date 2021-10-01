# Cryptocurrencies Monitor
API REST wrapper que se sirve de la api de coinGecko.

## Version de Node JS utilizada
- Node.js v.14.17.6

## Instrucciones para iniciar
- Instalar dependencias necesarias ***npm install***
- Crear un archivo ***.env***, usar el archivo ***.env.sample*** ubicado en la raíz del proyecto.
- Ejecutar aplicación en entorno de desarrollo ***npm run dev***.

## Instrucciones para correr pruebas automatizadas
- Para correr solo pruebas de user ***npm run test-user***
- Para correr solo pruebas de login ***npm run test-login***
- Para correr solo pruebas de coin ***npm run test-coin***
- Para correr todas las pruebas de test ***npm run test***

## API

#### Rutas
| Método http | Ruta | Descripción | Params |
| --- | --- | --- | --- |
`GET` | `/api/v1/user` | Devueve datos del usuario | token 
`GET` | `/api/v1/coins/:coin` | Devuelve una moneda por su id | {coin: String}
`GET` | `/api/v1/coins/all` | Devuelve un listado de monedas (max:100) | `page`: Number , `order`: String, `currency`: String ("ars","usd","eur"),`currencySort`: String
`POST`| `/api/v1/user` | Crea un usuario | { `userName`:String, `name`:String, `lastName`:String, `passwor`:String, `topCoins`:[String] }   
`POST`| `/api/v1/login` | Login de usuario | `username`:String, `password`: String
`PUT` | `/api/v1/user/addCoins` | Agrega monedas al topN del usuario | `addCoin`: [String]
`PUT` | `/api/v1/user/removeCoins` | Elimina monedas del topN del usuario | `removeCoin`: [String]

#### Códigos de estado
- **200:** Recurso obtenido correctamente
- **201:** Recurso creado correctamente
- **400:** Error del cliente
- **401:** Error de identificación, falta de autenticación o falta de privilegios
- **403:** Acción prohibida
- **404:** Recurso no encontrado, no existe dicho recurso
- **409:** Error de validacion de tipo
- **500:** Error de parte del servidor

### Autenticación sin estado

La autenticación se utiliza **JWT** para la generación de un token utilizando la dependencia **jsonwebtoken** con un tiempo de expiración de 7 días.

### Pruebas automatizadas

Las pruebas automatizadas se realizaron con ***Jest*** y ***Supertest***.
