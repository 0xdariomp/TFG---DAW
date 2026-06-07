# TFG - DAW | Portfolio de Darío Martínez

![Astro](https://img.shields.io/badge/Astro-FF7E33?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Este repositorio contiene el código fuente de mi **Trabajo de Fin de Grado (TFG)** para el ciclo superior de **Desarrollo de Aplicaciones Web (DAW)**.

Se trata de un **portfolio personal web interactivo y dinámico** diseñado para destacar mis habilidades como desarrollador frontend, así como documentar y presentar los proyectos más relevantes que he desarrollado.

## 🚀 Proyectos Destacados Incluidos

El portfolio no solo es una carta de presentación, sino que integra demos y documentación sobre tres proyectos principales:

1. **💈 Peluquería VIP Granada**
   - Aplicación web premium con sistema de reservas online, selección de servicios (corte, barba, cejas), mapa integrado y panel de accesibilidad completo.
   - _Tecnologías:_ HTML5, CSS3, JavaScript, LocalStorage.
2. **🤖 ChatBot IA Empresarial**
   - Asistente IA en producción para _Close Marketing_ integrado con Odoo Discuss. Incluye NLP, canales automáticos y memoria persistente entre sesiones.
   - _Tecnologías:_ JavaScript, IA / NLP, Odoo API, REST API.
3. **⚙️ Automatizaciones n8n**
   - Sistema de monitorización de almacenamiento en servidores Plesk con alertas por Slack/Email, y un procesador automático de reseñas con IA, almacenamiento en MySQL y visualización en Google Looker Studio.
   - _Tecnologías:_ n8n, Plesk API, IA / LLMs, MySQL, Looker Studio.

## 💻 Tecnologías Utilizadas

- **Framework:** [Astro](https://astro.build/) - Para una generación de sitios estáticos ultrarrápida y un enrutamiento sencillo.
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) - Para un diseño moderno, responsive y altamente personalizable.
- **Backend / Base de Datos:** [Supabase](https://supabase.com/) - Integrado para manejar funcionalidades dinámicas o almacenamiento de datos.
- **Lenguajes:** HTML Semántico, CSS moderno (con variables y animaciones nativas) y Vanilla JavaScript.

## 📁 Estructura del Proyecto

```text
/
├── public/           # Assets estáticos (imágenes, scripts globales como script.js)
├── src/
│   ├── assets/       # Estilos globales (style.css) y recursos
│   ├── components/   # Componentes modulares de Astro (secciones, UI, etc.)
│   ├── layouts/      # Plantillas base (Layout principal, PeluqueriaLayout, etc.)
│   ├── lib/          # Configuración de librerías de terceros (Supabase)
│   └── pages/        # Páginas de la aplicación (index, proyectos específicos)
├── astro.config.mjs  # Configuración de Astro
├── package.json      # Dependencias y scripts
└── tailwind.css / config # Configuración de Tailwind (integrado con Vite)
```

## 🛠️ Instalación y Uso Local

Para clonar y ejecutar este proyecto localmente, sigue estos pasos:

1. **Clona el repositorio:**

   ```sh
   git clone https://github.com/0xdariomp/TFG---DAW.git
   cd tfg-daw
   ```

2. **Instala las dependencias:**

   ```sh
   npm install
   # o si usas pnpm: pnpm install
   ```

3. **Inicia el servidor de desarrollo:**

   ```sh
   npm run dev
   # o con pnpm: pnpm dev
   ```

4. **Abre tu navegador:**
   Visita `http://localhost:4321` para ver el portfolio en acción.

## 👨‍💻 Autor

**Darío Martínez**
_Desarrollador Web Frontend_

- Especializado en crear experiencias digitales fluidas, estéticamente atractivas y centradas en el usuario.
