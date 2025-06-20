<template>
  <div class="movie-card" @click="goToDetails">
    <div class="movie-poster">
      <img 
        :src="movie.poster_path ? getImageUrl(movie.poster_path) : '/placeholder.jpg'"
        :alt="movie.title"
        @error="handleImageError"
      />
      <button 
        class="favorite-btn"
        :class="{ 'is-favorite': isFavorite }"
        @click.stop="toggleFavorite"
        :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
      >
        ❤️
      </button>
    </div>
    
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <div class="movie-meta">
        <span class="movie-year">{{ getYear(movie.release_date) }}</span>
        <span class="movie-rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
      </div>
      <p class="movie-overview">{{ truncatedOverview }}</p>
    </div>
  </div>
</template>

<script>
import { movieService } from '../services/movieService'
import { favoritesService } from '../services/favoritesService'

export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFavorite: false
    }
  },
  computed: {
    truncatedOverview() {
      const overview = this.movie.overview || 'Sin descripción disponible'
      return overview.length > 120 ? overview.substring(0, 120) + '...' : overview
    }
  },
  mounted() {
    this.isFavorite = favoritesService.isFavorite(this.movie.id)
  },
  methods: {
    getImageUrl(path) {
      return movieService.getImageUrl(path)
    },
    
    getYear(dateString) {
      return dateString ? new Date(dateString).getFullYear() : 'N/A'
    },
    
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x450/333/fff?text=Sin+Imagen'
    },
    
    toggleFavorite() {
      const result = favoritesService.toggleFavorite(this.movie)
      this.isFavorite = favoritesService.isFavorite(this.movie.id)
      this.$emit('favorite-changed', result)
    },
    
    goToDetails() {
      this.$router.push(`/movie/${this.movie.id}`)
    }
  }
}
</script>

<style scoped>
.movie-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.movie-poster {
  position: relative;
  overflow: hidden;
}

.movie-poster img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.05);
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  background: #e53e3e;
}

.movie-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  line-height: 1.3;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}

.movie-year {
  color: #718096;
  font-weight: 500;
}

.movie-rating {
  color: #f6ad55;
  font-weight: 600;
}

.movie-overview {
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.4;
  margin: 0;
  flex-grow: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .movie-poster img {
    height: 250px;
  }
  
  .movie-info {
    padding: 0.75rem;
  }
  
  .movie-title {
    font-size: 1rem;
  }
}
</style> 