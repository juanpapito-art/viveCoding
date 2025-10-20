# WIPS - Web Interactiva Para Sismos

## 📁 Estructura del Proyecto

```
wips-deploy/
├── index.html          ← Archivo HTML principal
├── css/
│   └── styles.css      ← Estilos CSS
├── js/
│   └── app.js          ← Lógica JavaScript
├── images/             ← Carpeta para imágenes (opcional)
└── README.md           ← Este archivo
```

## 🚀 Cómo Desplegar

### Opción 1: Netlify (Drag & Drop)
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `wips-deploy` completa
3. ¡Listo! Tu sitio estará en línea en segundos

### Opción 2: GitHub Pages
1. Crea un repositorio en GitHub
2. Sube los archivos a la rama `main`
3. Ve a Settings > Pages
4. Selecciona `main` como rama de origen
5. Tu sitio estará en `https://tuusuario.github.io/nombre-repo`

### Opción 3: Vercel
1. Ve a https://vercel.com/new
2. Conecta tu repositorio de GitHub
3. Vercel desplegará automáticamente

### Opción 4: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Luego abre http://localhost:8000
```

## ✨ Características

✅ Mapa interactivo con datos en tiempo real de USGS
✅ Estadísticas de sismos (total, severos, moderados)
✅ Tabla de sismos recientes
✅ Panel de detalles del sismo seleccionado
✅ Diseño responsive (móvil y desktop)
✅ Actualización automática cada 5 minutos

## 📊 Fuente de Datos

Los datos sísmicos se obtienen en tiempo real de:
- **USGS Earthquake API**: https://earthquake.usgs.gov/

## 👥 Integrantes del Proyecto

- Mateo Lastra
- Sofia Lopez
- Juan Manuel Londoño

## 📚 Tecnologías

- HTML5
- CSS3
- JavaScript Vanilla
- Leaflet.js (Mapas)
- USGS API (Datos sísmicos)

## 📝 Notas

- No requiere servidor backend
- No requiere base de datos
- Funciona en cualquier navegador moderno
- Los datos se actualizan cada 5 minutos automáticamente

---

**Última actualización**: Octubre 2025
