import express, { json } from 'express'; //require -> commonJS
// import movies from './movies.json';  //ERR_IMPORT_ASSERTION_TYPE_MISSING no reconoce la importacion de un jsson
//import movies from './movies.json' assert {type: 'json'}; //assert no utiliar no paso a la etapa 3 se quedo solo en desarrollo es decr no existe
// import movies from './movies.json' with {type: 'json'}; //el with esta en etapa 3 pero todavia no ha sido implementado en esta version de node 18.x.x 
import { moviesRouter } from './routes/movies.js';

// como leer json en ESModules  esta es una forma correcta pero no optima , se puede hacer
// import fs from 'node:fs';
// const movies = JSON.parse((fs.readFileSync('./movies.json')));

const app = express();
app.use(json());
app.disable('x-powered-by');

app.use('/movies', moviesRouter);

const PORT = process.env.PORT ?? 1234;      //process.env.PORT con esto el servicio donde se ospeda le da el puerto

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`);
})