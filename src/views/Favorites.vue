<template>
  <div class="favorites">
    <div class="hero">
      <h1 class="hero-title">❤️ Mis Favoritos</h1>
      <p class="hero-subtitle">
        Tus películas guardadas en un solo lugar
      </p>
    </div>

    <div class="content">
      <div class="header-actions">
        <button @click="$router.go(-1)" class="back-btn">
          ← Volver
        </button>
        
        <div class="stats" v-if="favorites.length > 0">
          <span class="count">{{ favorites.length }} película{{ favorites.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div v-if="favorites.length === 0" class="empty-state">
        <div class="empty-icon">💔</div>
        <h3>No tienes favoritos aún</h3>
        <p>Explora películas y agrega las que más te gusten a tu lista de favoritos</p>
        <router-link to="/" class="explore-btn">
          🎬 Explorar Películas
        </router-link>
      </div>

      <div v-else class="favorites-grid">
        <div 
          v-for="movie in favorites" 
          :key="movie.id"
          class="favorite-card"
        >
          <div class="poster-section" @click="goToDetail(movie.id)">
            <img 
              :src="movie.poster_path ? getImageUrl(movie.poster_path) : 'https://via.placeholder.com/300x450/333/fff?text=Sin+Imagen'"
              :alt="movie.title"
              class="poster"
            />
          </div>
          
          <div class="info-section">
            <h3 class="title" @click="goToDetail(movie.id)">{{ movie.title }}</h3>
            
            <div class="meta">
              <span class="year">{{ getYear(movie.release_date) }}</span>
              <span class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
            </div>
            
            <p class="overview">{{ truncateText(movie.overview, 100) }}</p>
            
            <div class="actions">
              <button 
                @click="removeFavorite(movie)"
                class="remove-btn"
                title="Quitar de favoritos"
              >
                🗑️ Quitar
              </button>
              
              <button 
                @click="goToDetail(movie.id)"
                class="detail-btn"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { favoritesService } from '../services/favoritesService'
import { movieService } from '../services/movieService'

export default {
  name: 'Favorites',
  data() {
    return {
      favorites: []
    }
  },
  created() {
    this.loadFavorites()
  },
  methods: {
    loadFavorites() {
      this.favorites = favoritesService.getFavorites()
    },

    removeFavorite(movie) {
      if (confirm(`¿Estás seguro de que quieres quitar "${movie.title}" de favoritos?`)) {
        favoritesService.removeFromFavorites(movie.id)
        this.loadFavorites()
        this.showNotification(`"${movie.title}" removida de favoritos`)
      }
    },

    goToDetail(movieId) {
      this.$router.push(`/movie/${movieId}`)
    },

    getImageUrl(path) {
      return movieService.getImageUrl(path)
    },

    getYear(dateString) {
      return dateString ? new Date(dateString).getFullYear() : 'N/A'
    },

    truncateText(text, length) {
      if (!text) return 'Sin descripción disponible'
      return text.length > length ? text.substring(0, length) + '...' : text
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
.favorites {
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
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

.content {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.stats {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.empty-state {
  text-align: center;
  color: white;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
}

.empty-state h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.explore-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.explore-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.poster-section {
  cursor: pointer;
  overflow: hidden;
}

.poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.poster-section:hover .poster {
  transform: scale(1.05);
}

.info-section {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #2d3748;
  cursor: pointer;
  transition: color 0.3s ease;
}

.title:hover {
  color: #667eea;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.year {
  color: #718096;
  font-weight: 500;
}

.rating {
  color: #f6ad55;
  font-weight: 600;
}

.overview {
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.remove-btn,
.detail-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.remove-btn {
  background: #fed7d7;
  color: #c53030;
}

.remove-btn:hover {
  background: #feb2b2;
}

.detail-btn {
  background: #667eea;
  color: white;
}

.detail-btn:hover {
  background: #5a67d8;
}

/* Pantallas grandes */
@media (min-width: 1200px) {
  .content {
    padding: 0 4rem;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }
}

@media (min-width: 1600px) {
  .content {
    padding: 0 6rem;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2.5rem;
  }
}

@media (min-width: 2000px) {
  .content {
    padding: 0 4rem;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .favorite-card {
    flex-direction: row;
  }
  
  .poster-section {
    flex: 0 0 120px;
  }
  
  .poster {
    height: 100%;
    width: 120px;
  }
  
  .info-section {
    padding: 1rem;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .favorites {
    padding: 1rem 0;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .favorite-card {
    flex-direction: column;
  }
  
  .poster-section {
    flex: none;
  }
  
  .poster {
    height: 180px;
    width: 100%;
  }
}
</style> 