import z from 'zod';

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a satring'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid url'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy','Crime','Drama','Fantasy','Horror','Thriller','Sci-Fi']),
        {
            required_error: 'Movie genre is required',
            invalid_type_error: 'Movie type must be an arrar of enum Genres'
        }
    )

})

export function validateMovie(object){
    // return movieSchema.parse(objecty)
    return movieSchema.safeParse(object) //safeParse devuelve un objeto result que nos dice si hay un error o si hay datos 
}

export function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object); //partial hace que los atributos sean opcionales
}

