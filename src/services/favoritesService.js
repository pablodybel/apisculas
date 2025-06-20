// Servicio simple para manejar favoritos
const FAVORITES_KEY = 'moviesFavorites'

export const favoritesService = {
  // Obtener favoritos
  getFavorites() {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error getting favorites:', error)
      return []
    }
  },

  // Agregar a favoritos
  addToFavorites(movie) {
    try {
      const favorites = this.getFavorites()
      if (!this.isFavorite(movie.id)) {
        favorites.push(movie)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return false
    }
  },

  // Remover de favoritos
  removeFromFavorites(movieId) {
    try {
      const favorites = this.getFavorites()
      const updated = favorites.filter(movie => movie.id !== movieId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return false
    }
  },

  // Verificar si es favorito
  isFavorite(movieId) {
    try {
      const favorites = this.getFavorites()
      return favorites.some(movie => movie.id === movieId)
    } catch (error) {
      console.error('Error checking favorite:', error)
      return false
    }
  },

  // Alternar favorito
  toggleFavorite(movie) {
    if (this.isFavorite(movie.id)) {
      this.removeFromFavorites(movie.id)
      return { action: 'removed', message: `"${movie.title}" removida de favoritos` }
    } else {
      this.addToFavorites(movie)
      return { action: 'added', message: `"${movie.title}" agregada a favoritos` }
    }
  }
} 