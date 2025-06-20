<template>
  <div class="search-bar">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar películas por título..."
          class="search-input"
          @keyup.enter="performSearch"
          @input="onInputChange"
        />
        <div class="search-actions">
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="clear-btn"
            title="Limpiar búsqueda"
          >
            ✕
          </button>
          <button
            @click="performSearch"
            class="search-btn"
            :disabled="!searchQuery.trim()"
            title="Buscar"
          >
            🔍
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: '',
      searchTimeout: null
    }
  },
  methods: {
    onInputChange() {
      // Debounce para evitar muchas búsquedas
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        if (this.searchQuery.trim().length >= 2) {
          this.performSearch()
        } else if (this.searchQuery.trim().length === 0) {
          this.$emit('clear-search')
        }
      }, 500)
    },
    
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', this.searchQuery.trim())
      }
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.$emit('clear-search')
    }
  }
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  margin-bottom: 2rem;
  padding: 0 1rem;
  box-sizing: border-box;
}

.search-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.search-input-wrapper:focus-within {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: #2d3748;
}

.search-input::placeholder {
  color: #a0aec0;
}

.search-actions {
  display: flex;
  align-items: center;
  padding-right: 0.5rem;
}

.clear-btn,
.search-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.clear-btn {
  color: #a0aec0;
}

.clear-btn:hover {
  color: #e53e3e;
  background: rgba(229, 62, 62, 0.1);
}

.search-btn {
  color: #4299e1;
  margin-left: 0.25rem;
}

.search-btn:hover:not(:disabled) {
  background: rgba(66, 153, 225, 0.1);
  transform: scale(1.1);
}

.search-btn:disabled {
  color: #a0aec0;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .search-bar {
    padding: 0 0.5rem;
  }
  
  .search-input {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .clear-btn,
  .search-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
}
</style> 