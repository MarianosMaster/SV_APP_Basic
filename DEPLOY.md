# Cómo Desplegar "Nuestro Mundo" en el Móvil 📱

## 1. Subir a GitHub (Guardar tu código)

Para no perder nunca este regalo, lo mejor es guardarlo en la nube (GitHub).

1.  **Crea una cuenta** en [GitHub.com](https://github.com) (si no tienes).
2.  **Crea un Nuevo Repositorio**:
    *   Dale al `+` arriba a la derecha -> **New repository**.
    *   Ponle nombre (ej: `nuestro-mundo`).
    *   Déjalo **Público** (más fácil) o **Privado**.
    *   Dale a **Create repository**.
3.  **Sube los archivos** (Desde tu ordenador):
    *   Abre la terminal en la carpeta del proyecto y escribe esto uno por uno:
    ```bash
    git init
    git add .
    git commit -m "Regalo para Pilar terminado"
    git branch -M main
    git remote add origin https://github.com/TU_USUARIO/nuestro-mundo.git
    git push -u origin main
    ```
    *(Cambia `TU_USUARIO` por tu nombre de usuario de GitHub y `nuestro-mundo` por el nombre que hayas puesto).*

---

## 2. Ponerlo en Internet (Vercel)

Una vez en GitHub, usar Vercel es automático:

1.  Entra en [Vercel](https://vercel.com) y entra con tu cuenta de GitHub.
2.  Dale a **"Add New..."** -> **Project**.
3.  Verás tu repositorio `nuestro-mundo` en la lista. Dale a **Import**.
4.  Dale a **Deploy**. ¡Y listo!

---

## 3. Instalar en el Móvil de Pilar (PWA)

Cuando Vercel termine, te dará un enlace (ej: `nuestro-mundo.vercel.app`).

1.  Mándale el enlace por WhatsApp.
2.  Dile que lo abra y:
    *   **Android**: Tocar los 3 puntos -> **Instalar aplicación**.
    *   **iPhone**: Tocar "Compartir" -> **Añadir a pantalla de inicio**.

¡Aparecerá como una app real con icono de corazón! ❤️
