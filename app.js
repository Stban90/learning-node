const express = require('express'); //require -> commonJS
const movies = require('./movies.json'); 
const crypto = require('node:crypto');  //para crear id UUID v4
const { validateMovie, validatePartialMovie } = require('./scheme/movies');



const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.json({message: 'Hello world'});
})

const ACCEPTED_ORIGINS = [  //CORS list of dominios permitidos
    'http://localhost:8080',
    'http://127.0.0.1:5500',
    'http://cualquierdominio.com',
    'http://localhost:8080'
]

app.get('/movies', (req, res) => {
    const origin = req.header('origin'); 
    if(ACCEPTED_ORIGINS.includes(origin)){
        res.header('Access-Control-Allow-Origin', origin)
    }

    //res.header('Access-Control-Allow-Origin', '*'); //CORS AQui le indicamos q todos los origenes q no sean nuestro origen estan permitidos //funciona pero es una mala practica
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); //CORS aqui le indicamos especificamente q dominio puede acceder

    // const { genre, otroParam } = req.query;
    const { genre } = req.query;
    if(genre){
        const filteredMovies = movies.filter(
            // movie => movie.genre.includes(genre)   //esta linea esta bien pero es caseSensitive
            movie =>movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())  //movie.genre es un array pilas  //aqui ya no es caseSensitive
        )
        res.json(filteredMovies);
    }                //en la req podemos acceder a a query y en la query al objeto queryParams
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const {id} = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)
    return res.status(404).json({message: 'Movie not found'});
})

app.post('/movies', (req, res) => {

    const result = validateMovie(req.body)
    if(result.error){
        //error 400 bad request indica que el cliente ha echo algo para q se cometa este error 
        return res.status(400).json({error: JSON.parse(result.error.message)});
    }

    const newMovie = {
        id: crypto.randomUUID(),     // uuid=  universal unique identifier
        ...result.data
    }
    // Esto no seria rest porq estamos guardando el estado de la aplicacion en memoria

    movies.push(newMovie);
    res.status(201).json(newMovie);
})


app.delete('/movies', (req, res) => {
    const origin = req.header(origin || !origin); 
    if(ACCEPTED_ORIGINS.includes(origin)){
        res.header('Access-Control-Allow-Origin', origin)
    }
    const { id} = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if(movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found'}); 
    }
    movies.splice(movieIndex, 1);
    return res.json({ message: 'Moviedeleted'});
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body);  //valido q el objeto que estoy enviando sea una movie
    if(!result.success){
        return res.status(400).json({error: JSON.parse(result.error,message)});
    }
    const {id} =req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if(movieIndex===-1){
        return result.status(404).json({message: 'Movie not found'});
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie;//aqui deberiamos guardar en la base de datos
    return res.json(updateMovie);
    
})


const PORT = process.env.PORT ?? 1234;      //process.env.PORT con esto el servicio donde se ospeda le da el puerto

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`);
})