# 📸 Portafolio Fotográfico — *Eivind Leso* (v1.0)

[![Deploy with Vercel](https://vercel.com/button)](https://eivindleso.vercel.app/)

Sitio web oficial del fotógrafo **Eivind Leso**, desarrollado como una **Single Page Application (SPA)** completamente estática y **100% responsiva**, creada con **HTML, CSS y JavaScript puro (Vanilla JS)**.  
Diseñada para ser **ligera, rápida y visualmente elegante**, enfocada en la experiencia del usuario.

👉 **Versión en vivo:** [https://eivindleso.vercel.app](https://eivindleso.vercel.app)

---

## 🖼️ Vista Previa

![Captura del portafolio de Eivind Leso](./screenshot.png)  
*Para personalizarla, reemplaza `screenshot.png` con una captura actualizada del sitio.*

---

## 🧭 Estructura del Proyecto

```bash
EivindLeso/
├── index.html              # Estructura principal del sitio
├── css/
│   └── style.css           # Hoja de estilos base y responsive
├── js/
│   └── script.js           # Interactividad y manipulación del DOM
├── img/
│   ├── carrusel/           # Imágenes del carrusel inicial
│   ├── trabajo/            # Fotografías del portafolio
│   ├── logo2.png
│   └── mi-foto.jpg
└── README.md               # Documentación del proyecto
```

---

## ⚙️ Arquitectura y Decisiones Técnicas

### 🧩 JavaScript — *Vanilla JS*
Se eligió **JavaScript puro** para mantener un rendimiento óptimo y eliminar dependencias innecesarias.  
Toda la lógica principal se ejecuta tras el evento `DOMContentLoaded` desde `js/script.js`.

**Características clave:**
- **🎞️ Filtrado de galería:**  
  Control dinámico mediante `data-category` para mostrar/ocultar imágenes.
- **🪶 Lightbox interactivo:**  
  Permite navegar entre imágenes sin salir del visor, gestionando un array dinámico de la categoría activa.
- **🔁 Carrusel animado:**  
  Implementa transiciones suaves con `setTimeout`, `setInterval` y clases CSS (`.active`, `.transitioning`).

---

### 🎨 CSS — *Diseño Moderno y Limpio*
`style.css` está organizado modularmente y aprovecha características modernas:

- **Variables CSS (`:root`)** para colores y tipografías globales.  
- **Flexbox + CSS Grid** para una composición fluida y responsiva.  
- **Transiciones y animaciones** sutiles (`@keyframes`) que refuerzan la experiencia visual (zoom, fundido, desplazamiento).

---

### 📬 Formulario de Contacto
El formulario usa **Formspree** como backend externo, lo que permite enviar correos sin un servidor propio.  
El endpoint de Formspree recibe y procesa los datos del formulario de forma segura.

---

## 🚀 Despliegue y Flujo CI/CD

El sitio está alojado en **Vercel**, integrado directamente con GitHub.

- **Despliegue continuo:** Cada `push` en `main` genera automáticamente un nuevo build.  
- **Atomic Deployments:** Sin tiempo de inactividad; el nuevo sitio se activa solo al finalizar la compilación.  
- **Preview Deployments:** Cada rama genera una URL temporal para pruebas previas a la fusión.

---

## 🧠 Cómo Ejecutar el Proyecto Localmente

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/Mind0T/EivindLeso.git
   ```
2. **Accede al directorio:**
   ```bash
   cd EivindLeso
   ```
3. **Ejecuta el proyecto:**
   - Abre `index.html` directamente en tu navegador, **o**
   - Usa la extensión **Live Server** de VS Code para habilitar recarga automática.

---

## 🔮 Mejoras Futuras

- **🖼️ Lazy Loading:** optimizar la carga diferida de imágenes.  
- **📦 Modularización JS:** refactorización con ES6 Modules.  
- **💫 Animaciones on-scroll:** añadir efectos suaves al desplazarse.  
- **🧩 CMS Headless:** integrar un gestor de contenido (p. ej. Contentful o Sanity) para facilitar la actualización del portafolio.

---

## 👤 Autor

**Irving Soriano**  
📂 *Fotografo y estudiante de Ing en Inteligencia Artificial*  
- GitHub: [@Mind0T](https://github.com/Mind0T)  
- LinkedIn: [Irving Soriano](https://www.linkedin.com/in/irving-soriano/)
