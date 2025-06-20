// Servicio simple para The Movie Database API
const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export const movieService = {
  // Obtener películas populares
  async getPopularMovies(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      throw error
    }
  },

  // Buscar películas por título
  async searchMovies(query, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error searching movies:', error)
      throw error
    }
  },

  // Obtener detalles de una película
  async getMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching movie details:', error)
      throw error
    }
  },



  // Obtener URL de imagen
  getImageUrl(path) {
    return path ? `${IMAGE_BASE_URL}${path}` : null
  },

  // Obtener URL de backdrop
  getBackdropUrl(path) {
    return path ? `https://image.tmdb.org/t/p/w1280${path}` : null
  },

  // Descubrir películas con filtros
  async discoverMovies(filters = {}, page = 1) {
    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        language: 'es-ES',
        page: page.toString(),
        sort_by: 'popularity.desc'
      })

      // Agregar filtros si están presentes
      if (filters.genre) params.append('with_genres', filters.genre)
      if (filters.year) params.append('year', filters.year)
      if (filters.minRating) params.append('vote_average.gte', filters.minRating)
      if (filters.maxRating) params.append('vote_average.lte', filters.maxRating)
      if (filters.adult !== undefined) params.append('include_adult', filters.adult)

      const response = await fetch(`${BASE_URL}/discover/movie?${params}`)
      return await response.json()
    } catch (error) {
      console.error('Error discovering movies:', error)
      throw error
    }
  },

  // Obtener géneros disponibles
  async getGenres() {
    try {
      const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching genres:', error)
      throw error
    }
  }
} 