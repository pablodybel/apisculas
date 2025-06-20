# 🎬 Aplicación de Películas

Una aplicación web sencilla y moderna para descubrir, buscar y guardar tus películas favoritas.

## ✨ Características

- **Explorar Películas Populares**: Ve las películas más populares del momento
- **Búsqueda Inteligente**: Busca películas por título con resultados en tiempo real
- **Detalles Completos**: Ve información detallada de cada película
- **Lista de Favoritos**: Guarda tus películas favoritas y accede a ellas fácilmente
- **Diseño Responsive**: Funciona perfectamente en móviles, tablets y desktop
- **Interfaz Moderna**: Diseño atractivo con animaciones suaves

## 🚀 Tecnologías

- **Vue.js 3** - Framework principal
- **Vue Router** - Navegación entre páginas
- **CSS3** - Estilos modernos y responsive
- **The Movie Database (TMDb) API** - Datos de películas
- **LocalStorage** - Almacenamiento de favoritos

## 📱 Funcionalidades

### Página Principal
- Muestra películas populares en un grid responsive
- Barra de búsqueda con debounce
- Contador de favoritos
- Navegación a favoritos

### Detalles de Película
- Poster e imagen de fondo
- Información completa (sinopsis, rating, géneros, etc.)
- Botón para agregar/quitar de favoritos
- Navegación de regreso

### Lista de Favoritos
- Todas las películas guardadas
- Opción para quitar de favoritos
- Navegación rápida a detalles
- Estado vacío cuando no hay favoritos

## 🎯 Uso

1. **Explorar**: La página principal muestra películas populares
2. **Buscar**: Usa la barra de búsqueda para encontrar películas específicas
3. **Ver Detalles**: Haz clic en cualquier película para ver más información
4. **Guardar Favoritos**: Usa el botón de corazón para guardar películas
5. **Ver Favoritos**: Accede a tu lista personal desde el botón de favoritos

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📝 API

La aplicación utiliza The Movie Database (TMDb) API para obtener información de películas. La API key está incluida para facilitar el uso inmediato.

---

¡Disfruta explorando el mundo del cine! 🍿
