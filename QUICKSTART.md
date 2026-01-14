# 🚀 Inicio Rápido

## 📋 Pasos para Ejecutar el Proyecto

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Firebase
Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus credenciales de Firebase.

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📱 Rutas Disponibles

- **`/`** - Página principal para invitados (ver y reclamar regalos)
- **`/admin`** - Panel de administración (agregar/eliminar regalos)

## ✨ Características

### Para Administradores (`/admin`)
- ✅ Agregar regalos con nombre, foto y link de compra
- ✅ Subir imágenes directamente o usar URLs
- ✅ Ver todos los regalos y su estado
- ✅ Eliminar regalos
- ✅ Ver quién ha reclamado cada regalo

### Para Invitados (`/`)
- ✅ Ver todos los regalos disponibles
- ✅ Reclamar un regalo ingresando su nombre
- ✅ Ver qué regalos ya están apartados
- ✅ Acceder al link de compra de cada regalo
- ✅ Interfaz hermosa con tema de niña

## 🎨 Diseño

El diseño está inspirado en:
- 💗 **Colores**: Rosa y púrpura suaves
- ✨ **Animaciones**: Elementos flotantes y brillantes
- 📖 **Tema Bíblico**: Honrando el significado del nombre Abigail
- 🌸 **Elementos**: Corazones, estrellas y decoraciones delicadas

## 🔥 Firebase Setup Rápido

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Firestore Database**
3. Habilita **Storage**
4. Copia las credenciales a `.env.local`
5. Configura las reglas (ver `DEPLOYMENT.md`)

## 📦 Despliegue

Ver `DEPLOYMENT.md` para instrucciones detalladas de despliegue en Vercel.

## 🆘 Ayuda

Si tienes problemas:
1. Verifica que todas las dependencias estén instaladas
2. Asegúrate de que Firebase esté correctamente configurado
3. Revisa que las variables de entorno estén en `.env.local`
4. Consulta `DEPLOYMENT.md` para solución de problemas

## 💝 Hecho con amor para Abigail Gutierrez Tapiero
