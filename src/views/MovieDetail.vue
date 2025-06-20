<template>
  <div class="movie-detail">
    <div v-if="loading" class="loading">
      <div class="spinner">🎬</div>
      <p>Cargando detalles de la película...</p>
    </div>

    <div v-else-if="error" class="error">
      <h3>❌ Error</h3>
      <p>{{ error }}</p>
      <button @click="$router.go(-1)" class="back-btn">Volver</button>
    </div>

    <div v-else-if="movie" class="movie-content">
      <!-- Backdrop -->
      <div 
        class="backdrop"
        :style="{ backgroundImage: movie.backdrop_path ? `url(${getBackdropUrl(movie.backdrop_path)})` : 'none' }"
      >
        <div class="backdrop-overlay"></div>
      </div>

      <div class="content">
        <!-- Botón de regreso -->
        <button @click="$router.go(-1)" class="back-button">
          ← Volver
        </button>

        <div class="movie-info">
          <!-- Poster -->
          <div class="poster-section">
            <img 
              :src="movie.poster_path ? getImageUrl(movie.poster_path) : 'https://via.placeholder.com/300x450/333/fff?text=Sin+Imagen'"
              :alt="movie.title"
              class="poster"
            />
          </div>

          <!-- Información -->
          <div class="info-section">
            <h1 class="title">{{ movie.title }}</h1>
            
            <div class="meta">
              <span class="year">{{ getYear(movie.release_date) }}</span>
              <span class="rating">⭐ {{ movie.vote_average.toFixed(1) }}/10</span>
              <span class="runtime" v-if="movie.runtime">{{ movie.runtime }} min</span>
            </div>

            <div class="genres" v-if="movie.genres && movie.genres.length">
              <span 
                v-for="genre in movie.genres" 
                :key="genre.id"
                class="genre-tag"
              >
                {{ genre.name }}
              </span>
            </div>

            <div class="actions">
              <button 
                @click="toggleFavorite"
                class="favorite-btn"
                :class="{ 'is-favorite': isFavorite }"
              >
                {{ isFavorite ? '❤️ En Favoritos' : '🤍 Agregar a Favoritos' }}
              </button>
            </div>

            <div class="overview" v-if="movie.overview">
              <h3>Sinopsis</h3>
              <p>{{ movie.overview }}</p>
            </div>

            <div class="additional-info">
              <div class="info-grid">
                <div class="info-item" v-if="movie.release_date">
                  <strong>📅 Fecha de estreno:</strong>
                  {{ formatDate(movie.release_date) }}
                </div>
                
                <div class="info-item" v-if="movie.original_language">
                  <strong>🌍 Idioma original:</strong>
                  {{ getLanguageName(movie.original_language) }}
                </div>
                
                <div class="info-item" v-if="movie.production_countries && movie.production_countries.length">
                  <strong>🏳️ País:</strong>
                  {{ movie.production_countries.map(c => c.name).join(', ') }}
                </div>
                
                <div class="info-item" v-if="movie.vote_count">
                  <strong>👥 Votos:</strong>
                  {{ movie.vote_count.toLocaleString() }}
                </div>
                
                <div class="info-item" v-if="movie.budget && movie.budget > 0">
                  <strong>💰 Presupuesto:</strong>
                  ${{ movie.budget.toLocaleString() }}
                </div>
                
                <div class="info-item" v-if="movie.revenue && movie.revenue > 0">
                  <strong>💵 Recaudación:</strong>
                  ${{ movie.revenue.toLocaleString() }}
                </div>
                
                <div class="info-item" v-if="movie.popularity">
                  <strong>📊 Popularidad:</strong>
                  {{ Math.round(movie.popularity) }}
                </div>
                
                <div class="info-item" v-if="movie.adult !== undefined">
                  <strong>🔞 Clasificación:</strong>
                  {{ movie.adult ? '+18' : 'Apta para todos' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { movieService } from '../services/movieService'
import { favoritesService } from '../services/favoritesService'

export default {
  name: 'MovieDetail',
  data() {
    return {
      movie: null,
      loading: false,
      error: null,
      isFavorite: false
    }
  },
  async created() {
    await this.loadMovieDetails()
  },
  methods: {
    async loadMovieDetails() {
      this.loading = true
      this.error = null
      
      try {
        const movieId = this.$route.params.id
        this.movie = await movieService.getMovieDetails(movieId)
        this.isFavorite = favoritesService.isFavorite(this.movie.id)
      } catch (error) {
        this.error = 'Error al cargar los detalles de la película'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    toggleFavorite() {
      const result = favoritesService.toggleFavorite(this.movie)
      this.isFavorite = favoritesService.isFavorite(this.movie.id)
      this.showNotification(result.message)
    },

    getImageUrl(path) {
      return movieService.getImageUrl(path)
    },

    getBackdropUrl(path) {
      return movieService.getBackdropUrl(path)
    },

    getYear(dateString) {
      return dateString ? new Date(dateString).getFullYear() : 'N/A'
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    getLanguageName(code) {
      const languages = {
        'en': 'Inglés',
        'es': 'Español',
        'fr': 'Francés',
        'de': 'Alemán',
        'it': 'Italiano',
        'pt': 'Portugués',
        'ja': 'Japonés',
        'ko': 'Coreano',
        'zh': 'Chino',
        'ru': 'Ruso',
        'hi': 'Hindi',
        'ar': 'Árabe'
      }
      return languages[code] || code.toUpperCase()
    },

    showNotification(message) {
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

<style scoped>
.movie-detail {
  width: 100%;
  min-height: 100vh;
  background: #1a202c;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
  text-align: center;
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

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.back-btn:hover {
  background: #3182ce;
}

.movie-content {
  position: relative;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(26, 32, 44, 0.8) 70%,
    rgba(26, 32, 44, 1) 100%
  );
}

.content {
  position: relative;
  z-index: 2;
  padding: 3rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  box-sizing: border-box;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.movie-info {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  margin-top: 20vh;
}

.poster {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.info-section {
  color: white;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.year {
  color: #a0aec0;
}

.rating {
  color: #f6ad55;
  font-weight: 600;
}

.runtime {
  color: #a0aec0;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.genre-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.actions {
  margin-bottom: 2rem;
}

.favorite-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn:not(.is-favorite) {
  background: white;
  color: #2d3748;
}

.favorite-btn.is-favorite {
  background: #e53e3e;
  color: white;
}

.favorite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.overview h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.overview p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e2e8f0;
  margin-bottom: 2rem;
}

.additional-info {
  margin-top: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  font-size: 0.95rem;
  color: #a0aec0;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.info-item strong {
  color: white;
  display: block;
  margin-bottom: 0.25rem;
}

/* Pantallas grandes */
@media (min-width: 1200px) {
  .content {
    padding: 3rem 4rem 2rem 4rem;
  }
  
  .movie-info {
    grid-template-columns: 350px 1fr;
    gap: 4rem;
  }
}

@media (min-width: 1600px) {
  .content {
    padding: 3rem 6rem 2rem 6rem;
  }
  
  .movie-info {
    grid-template-columns: 400px 1fr;
    gap: 5rem;
  }
}

@media (min-width: 2000px) {
  .content {
    padding: 3rem 4rem 2rem 4rem;
  }
  
  .movie-info {
    grid-template-columns: 450px 1fr;
    gap: 4rem;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .movie-info {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 10vh;
  }

  .poster-section {
    text-align: center;
  }

  .poster {
    max-width: 250px;
  }

  .title {
    font-size: 2rem;
  }

  .meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
  }

  .poster {
    max-width: 200px;
  }
}
</style> 