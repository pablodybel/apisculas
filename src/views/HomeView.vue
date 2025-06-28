<script>
import MovieCard from '../components/MovieCard.vue'
import SearchBar from '../components/SearchBar.vue'
import MovieFilters from '../components/MovieFilters.vue'
import { movieService } from '../services/movieService'
import { favoritesService } from '../services/favoritesService'

export default {
  name: 'HomeView',
  components: {
    MovieCard,
    SearchBar,
    MovieFilters
  },
  data() {
    return {
      movies: [],
      genres: [],
      loading: false,
      loadingMore: false,
      error: null,
      loadingMessage: '',
      sectionTitle: 'Películas Populares',
      favoritesCount: 0,
      currentPage: 1,
      totalPages: 1,
      isSearchMode: false,
      isFilterMode: false,
      currentSearchQuery: '',
      currentFilters: {}
    }
  },
  async created() {
    await Promise.all([
      this.loadGenres(),
      this.loadPopularMovies()
    ])
    this.updateFavoritesCount()
  },
  methods: {
    async loadPopularMovies(reset = true) {
      if (reset) {
        this.loading = true
        this.currentPage = 1
        this.isSearchMode = false
        this.isFilterMode = false
        this.currentSearchQuery = ''
        this.currentFilters = {}
      } else {
        this.loadingMore = true
      }
      
      this.error = null
      this.loadingMessage = 'Cargando películas populares...'
      this.sectionTitle = 'Películas Populares'
      
              try {
          const response = await movieService.getPopularMovies(this.currentPage)
          const results = response.results || []
          
          if (reset) {
            // Mostrar solo las primeras 8 películas inicialmente
            this.movies = results.slice(0, 8)
          } else {
            this.movies = [...this.movies, ...results]
          }
          
          this.totalPages = response.total_pages || 1
      } catch (error) {
        this.error = 'Error al cargar las películas'
        console.error(error)
      } finally {
        this.loading = false
        this.loadingMore = false
      }
    },

    async handleSearch(query, reset = true) {
      if (reset) {
        this.loading = true
        this.currentPage = 1
        this.isSearchMode = true
        this.currentSearchQuery = query
      } else {
        this.loadingMore = true
      }
      
      this.error = null
      this.loadingMessage = `Buscando "${query}"...`
      this.sectionTitle = `Resultados para: "${query}"`
      
      try {
        const response = await movieService.searchMovies(query, this.currentPage)
        
        if (reset) {
          this.movies = response.results || []
        } else {
          this.movies = [...this.movies, ...(response.results || [])]
        }
        
        this.totalPages = response.total_pages || 1
      } catch (error) {
        this.error = 'Error al buscar películas'
        console.error(error)
      } finally {
        this.loading = false
        this.loadingMore = false
      }
    },

    onFavoriteChanged(result) {
      this.updateFavoritesCount()
      // Mostrar notificación simple
      this.showNotification(result.message)
    },

    updateFavoritesCount() {
      this.favoritesCount = favoritesService.getFavorites().length
    },

    async loadGenres() {
      try {
        const response = await movieService.getGenres()
        this.genres = response.genres || []
      } catch (error) {
        console.error('Error loading genres:', error)
      }
    },

    async loadMoreMovies() {
      if (this.currentPage >= this.totalPages || this.loadingMore) return
      
      this.currentPage++
      
      if (this.isSearchMode && this.currentSearchQuery) {
        await this.handleSearch(this.currentSearchQuery, false)
      } else if (this.isFilterMode && Object.keys(this.currentFilters).length > 0) {
        await this.handleFiltersChanged(this.currentFilters, false)
      } else {
        await this.loadPopularMovies(false)
      }
    },

    async handleFiltersChanged(filters, reset = true) {
      // Verificar si hay filtros activos
      const hasActiveFilters = Object.values(filters).some(value => value !== null && value !== '')
      
      if (!hasActiveFilters) {
        // Si no hay filtros, cargar películas populares
        this.isFilterMode = false
        this.currentFilters = {}
        await this.loadPopularMovies(true)
        return
      }

      if (reset) {
        this.loading = true
        this.currentPage = 1
        this.isSearchMode = false
        this.isFilterMode = true
        this.currentFilters = filters
      } else {
        this.loadingMore = true
      }
      
      this.error = null
      this.loadingMessage = 'Aplicando filtros...'
      
      // Crear título dinámico basado en filtros
      let title = 'Películas'
      if (filters.genre) {
        const genre = this.genres.find(g => g.id == filters.genre)
        title = `${genre ? genre.name : 'Género seleccionado'}`
      }
      if (filters.year) title += ` de ${filters.year}`
      if (filters.minRating) title += ` (${filters.minRating}+ ⭐)`
      if (filters.adult === true) title += ' (+18)'
      else if (filters.adult === false) title += ' (Apta para todos)'
      
      this.sectionTitle = title
      
      try {
        const response = await movieService.discoverMovies(filters, this.currentPage)
        
        if (reset) {
          this.movies = response.results || []
        } else {
          this.movies = [...this.movies, ...(response.results || [])]
        }
        
        this.totalPages = response.total_pages || 1
      } catch (error) {
        this.error = 'Error al aplicar filtros'
        console.error(error)
      } finally {
        this.loading = false
        this.loadingMore = false
      }
    },

    clearSearchAndFilters() {
      this.isSearchMode = false
      this.isFilterMode = false
      this.currentSearchQuery = ''
      this.currentFilters = {}
      this.loadPopularMovies(true)
    },

    showNotification(message) {
      // Crear notificación temporal
      const notification = document.createElement('div')
      notification.className = 'notification'
      notification.textContent = message
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.classList.add('show')
      }, 100)
      
      setTimeout(() => {
        notification.classList.remove('show')
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }
  }
}
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1 class="hero-title">Apisculas</h1>
      <p class="hero-subtitle">
        🎬 Descubre, busca y guarda tus películas favoritas
      </p>
    </div>

    <SearchBar 
      @search="handleSearch"
      @clear-search="clearSearchAndFilters"
    />

    <MovieFilters 
      :genres="genres"
      @filters-changed="handleFiltersChanged"
    />

    <div v-if="loading" class="loading">
      <div class="spinner">🎬</div>
      <p>{{ loadingMessage }}</p>
    </div>

    <div v-else-if="error" class="error">
      <h3>❌ Error</h3>
      <p>{{ error }}</p>
      <button @click="loadPopularMovies" class="retry-btn">Reintentar</button>
    </div>

    <div v-else class="content">
      <div class="section-header">
        <h2>{{ sectionTitle }}</h2>
        <div class="favorites-link">
          <router-link to="/favorites" class="favorites-btn">
            ❤️ Favoritos ({{ favoritesCount }})
          </router-link>
        </div>
      </div>

      <div v-if="movies.length === 0" class="empty">
        <h3>🔍 No se encontraron películas</h3>
        <p>Prueba con otro término de búsqueda</p>
      </div>

      <div v-else class="movies-grid">
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.id"
          :movie="movie"
          @favorite-changed="onFavoriteChanged"
        />
      </div>

      <!-- Botón Cargar Más -->
      <div v-if="!loading && movies.length > 0 && currentPage < totalPages" class="load-more-section">
        <button 
          @click="loadMoreMovies"
          :disabled="loadingMore"
          class="load-more-btn"
        >
          <span v-if="loadingMore" class="loading-spinner">🎬</span>
          {{ loadingMore ? 'Cargando...' : 'Ver más películas' }}
        </button>
      </div>

      <!-- Información de páginas -->
      <div v-if="!loading && movies.length > 0" class="pagination-info">
        <p>Mostrando {{ movies.length }} películas{{ totalPages > 1 ? ` de miles disponibles` : '' }}</p>
        <p v-if="currentPage >= totalPages && movies.length >= 20" class="end-message">
          🎉 ¡Has visto todas las películas disponibles!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 0 2rem 0;
  margin: 0;
  box-sizing: border-box;
}

.hero {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  padding: 1rem 1rem 0 1rem;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 
    0 0 20px rgba(255, 107, 107, 0.5),
    0 0 40px rgba(78, 205, 196, 0.3),
    0 0 60px rgba(69, 183, 209, 0.2);
  animation: 
    gradientShift 3s ease-in-out infinite,
    glowPulse 2s ease-in-out infinite alternate,
    float 4s ease-in-out infinite;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative;
  cursor: default;
  transition: all 0.3s ease;
}

.hero-title:hover {
  transform: scale(1.05) rotate(1deg);
  filter: brightness(1.2);
}

.hero-title::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3);
  background-size: 400% 400%;
  border-radius: 20px;
  z-index: -1;
  opacity: 0;
  animation: gradientShift 3s ease-in-out infinite;
  transition: opacity 0.3s ease;
}

.hero-title:hover::before {
  opacity: 0.3;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes glowPulse {
  0% { 
    filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.5))
           drop-shadow(0 0 40px rgba(78, 205, 196, 0.3));
  }
  100% { 
    filter: drop-shadow(0 0 30px rgba(255, 107, 107, 0.8))
           drop-shadow(0 0 60px rgba(78, 205, 196, 0.5))
           drop-shadow(0 0 80px rgba(69, 183, 209, 0.3));
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

.loading,
.error,
.empty {
  text-align: center;
  color: white;
  padding: 3rem 1rem;
}

.spinner {
  font-size: 3rem;
  animation: spin 2s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error h3,
.empty h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.content {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
}

.favorites-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.favorites-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  padding: 0;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
    letter-spacing: 1px;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .home {
    padding: 2rem 0 1rem 0;
  }
  
  .hero {
    padding: 0.5rem 0.5rem 0 0.5rem;
    margin-bottom: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
    letter-spacing: 0.5px;
    margin-bottom: 1rem;
  }
  
  .content {
    padding: 0 0.5rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}

/* Pantallas medianas */
@media (min-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .content {
    padding: 0 3rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

/* Pantallas grandes */
@media (min-width: 1200px) {
  .content {
    padding: 0 4rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1400px) {
  .content {
    padding: 0 5rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
  }
}

@media (min-width: 1600px) {
  .content {
    padding: 0 6rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
  }
}

@media (min-width: 1920px) {
  .content {
    padding: 0 8rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;
  }
}

/* Pantallas súper grandes (limitadas a 1800px de contenido) */
@media (min-width: 2000px) {
  .content {
    padding: 0 4rem;
  }
  
  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
  }
}

/* Sección de cargar más */
.load-more-section {
  text-align: center;
  margin: 3rem 0;
}

.load-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  min-width: 200px;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pagination-info {
  text-align: center;
  color: white;
  margin: 2rem 0;
  opacity: 0.8;
}

.pagination-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.end-message {
  font-weight: 600;
  color: #ffd700 !important;
}
</style>

<style>
/* Estilos globales para notificaciones */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4299e1;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  max-width: 300px;
}

.notification.show {
  transform: translateX(0);
}
</style>
