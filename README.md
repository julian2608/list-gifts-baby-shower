# 🎀 Lista de Regalos - Baby Shower Abigail

Una hermosa aplicación web para gestionar la lista de regalos del baby shower de Abigail Gutierrez Tapiero.

## ✨ Características

- 👑 **Panel de Administración**: Agrega regalos con foto, nombre y link de compra
- 🎁 **Vista de Invitados**: Los invitados pueden ver y reclamar regalos
- 💝 **Diseño Hermoso**: Tema femenino y bíblico para celebrar a Abigail
- 🔥 **Firebase Backend**: Base de datos en tiempo real
- 🚀 **Desplegable en Vercel**: Hosting gratuito y rápido

## 🛠️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Habilita Storage (para las imágenes)
5. Copia las credenciales de configuración
6. Crea un archivo `.env.local` basado en `.env.example`
7. Pega tus credenciales de Firebase

### 3. Reglas de Firestore

En Firebase Console, ve a Firestore Database > Rules y pega:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gifts/{giftId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 4. Reglas de Storage

En Firebase Console, ve a Storage > Rules y pega:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gifts/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## 🚀 Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Desplegar en Vercel

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio
4. Agrega las variables de entorno (las mismas del archivo `.env.local`)
5. ¡Despliega!

## 📱 Rutas

- `/` - Vista principal para invitados (ver y reclamar regalos)
- `/admin` - Panel de administración (agregar regalos)

## 🎨 Diseño

El diseño está inspirado en:
- 💗 Colores suaves rosa y púrpura
- ✨ Elementos delicados y femeninos
- 📖 Temática bíblica para honrar el nombre de Abigail
- 🌸 Flores y elementos decorativos

## 💝 Hecho con amor para Abigail
