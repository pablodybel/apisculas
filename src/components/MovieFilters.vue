<template>
  <div class="movie-filters">
    <div class="filters-container">
      <h3 class="filters-title">🔍 Filtros Avanzados</h3>
      
      <div class="filters-grid">
        <!-- Filtro por Género -->
        <div class="filter-group">
          <label class="filter-label">🎭 Género</label>
          <select 
            v-model="localFilters.genre" 
            @change="emitFilters"
            class="filter-select"
          >
            <option value="">Todos los géneros</option>
            <option 
              v-for="genre in genres" 
              :key="genre.id" 
              :value="genre.id"
            >
              {{ genre.name }}
            </option>
          </select>
        </div>

        <!-- Filtro por Año -->
        <div class="filter-group">
          <label class="filter-label">📅 Año</label>
          <select 
            v-model="localFilters.year" 
            @change="emitFilters"
            class="filter-select"
          >
            <option value="">Cualquier año</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Filtro por Rating Mínimo -->
        <div class="filter-group">
          <label class="filter-label">⭐ Rating Mínimo</label>
          <select 
            v-model="localFilters.minRating" 
            @change="emitFilters"
            class="filter-select"
          >
            <option value="">Cualquier rating</option>
            <option value="7">7.0+ ⭐</option>
            <option value="8">8.0+ ⭐⭐</option>
            <option value="9">9.0+ ⭐⭐⭐</option>
          </select>
        </div>

        <!-- Filtro por Clasificación -->
        <div class="filter-group">
          <label class="filter-label">🔞 Clasificación</label>
          <select 
            v-model="localFilters.adult" 
            @change="emitFilters"
            class="filter-select"
          >
            <option value="">Todas las edades</option>
            <option value="false">Apta para todos</option>
            <option value="true">Solo adultos (+18)</option>
          </select>
        </div>
      </div>

      <!-- Filtros Activos -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="active-label">Filtros activos:</span>
        <div class="filter-chips">
          <span 
            v-if="localFilters.genre" 
            class="filter-chip"
            @click="clearFilter('genre')"
          >
            {{ getGenreName(localFilters.genre) }} ✕
          </span>
          <span 
            v-if="localFilters.year" 
            class="filter-chip"
            @click="clearFilter('year')"
          >
            {{ localFilters.year }} ✕
          </span>
          <span 
            v-if="localFilters.minRating" 
            class="filter-chip"
            @click="clearFilter('minRating')"
          >
            {{ localFilters.minRating }}+ ⭐ ✕
          </span>
          <span 
            v-if="localFilters.adult" 
            class="filter-chip"
            @click="clearFilter('adult')"
          >
            {{ localFilters.adult === 'true' ? '+18' : 'Apta para todos' }} ✕
          </span>
        </div>
        <button @click="clearAllFilters" class="clear-all-btn">
          Limpiar todos
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieFilters',
  props: {
    genres: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localFilters: {
        genre: '',
        year: '',
        minRating: '',
        adult: ''
      }
    }
  },
  computed: {
    years() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let year = currentYear; year >= 1950; year--) {
        years.push(year)
      }
      return years
    },
    
    hasActiveFilters() {
      return Object.values(this.localFilters).some(value => value !== '')
    }
  },
  methods: {
    emitFilters() {
      // Convertir valores de string a los tipos correctos
      const filters = {
        genre: this.localFilters.genre || null,
        year: this.localFilters.year || null,
        minRating: this.localFilters.minRating ? parseFloat(this.localFilters.minRating) : null,
        adult: this.localFilters.adult ? this.localFilters.adult === 'true' : null
      }
      
      this.$emit('filters-changed', filters)
    },
    
    clearFilter(filterKey) {
      this.localFilters[filterKey] = ''
      this.emitFilters()
    },
    
    clearAllFilters() {
      this.localFilters = {
        genre: '',
        year: '',
        minRating: '',
        adult: ''
      }
      this.emitFilters()
    },
    
    getGenreName(genreId) {
      const genre = this.genres.find(g => g.id == genreId)
      return genre ? genre.name : genreId
    }
  }
}
</script>

<style scoped>
.movie-filters {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.filters-container {
  max-width: 100%;
}

.filters-title {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.filter-select {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
}

.active-filters {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.active-label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-grow: 1;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.8);
  color: #2d3748;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  background: #e53e3e;
  color: white;
  transform: scale(1.05);
}

.clear-all-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  background: #c53030;
  transform: scale(1.05);
}

/* Responsive */
@media (min-width: 1200px) {
  .filters-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .movie-filters {
    padding: 2rem;
  }
}

@media (min-width: 1600px) {
  .filters-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;
  }
  
  .movie-filters {
    padding: 2.5rem;
  }
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .active-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filter-chips {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .movie-filters {
    padding: 1rem;
  }
}
</style> 