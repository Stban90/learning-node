import { validateMovie, validatePartialMovie } from "../scheme/movies.js";
import { MovieModel } from "../models/movie.js";

export class MovieController {

    static async getAll(req, res) {
        // const origin = req.header('origin'); 
        // if(ACCEPTED_ORIGINS.includes(origin)){
        //     res.header('Access-Control-Allow-Origin', origin)
        // }

        //res.header('Access-Control-Allow-Origin', '*'); //CORS AQui le indicamos q todos los origenes q no sean nuestro origen estan permitidos //funciona pero es una mala practica
        //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); //CORS aqui le indicamos especificamente q dominio puede acceder

        // const { genre, otroParam } = req.query;
        const { genre } = req.query;
        const movies = await MovieModel.getAll({ genre });
        res.json(movies);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (movie) return res.json(movie);
        return res.status(404).json({ message: 'Movie not found' });
    }

    static async post(req, res) {
        const movieValidated = validateMovie(req.body)
        if (!movieValidated.success) {
            //error 400 bad request indica que el cliente ha echo algo para q se cometa este error 
            return res.status(400).json({ error: JSON.parse(movieValidated.error.message) });
        }
        const newMovie = await MovieModel.create({ input: movieValidated.data });
        res.status(201).json(newMovie);
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await MovieModel.delete({ id });
        if (result === false) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        return res.json({ message: 'Movie deleted' });
    }

    static async patch(req, res) {
        const result = validatePartialMovie(req.body);  //valido q el objeto que estoy enviando sea una movie
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const { id } = req.params;
        const updatedMovie = await MovieModel.update({ id, input: result.data });
        return res.json(updatedMovie);
    }
}