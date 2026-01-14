# 🚀 Guía de Despliegue en Vercel

## Paso 1: Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database**:
   - Ve a "Build" > "Firestore Database"
   - Click en "Create database"
   - Selecciona modo "Production" o "Test"
   - Elige una ubicación cercana

4. Habilita **Storage**:
   - Ve a "Build" > "Storage"
   - Click en "Get started"
   - Acepta las reglas por defecto

5. Configura las reglas de Firestore:
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

6. Configura las reglas de Storage:
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

7. Obtén las credenciales:
   - Ve a "Project Settings" (ícono de engranaje)
   - Scroll hasta "Your apps"
   - Click en el ícono web `</>`
   - Registra tu app
   - Copia las credenciales del `firebaseConfig`

## Paso 2: Preparar el Repositorio

1. Inicializa Git (si no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Baby Shower Abigail gift registry"
   ```

2. Sube a GitHub:
   ```bash
   # Crea un nuevo repositorio en GitHub primero
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git branch -M main
   git push -u origin main
   ```

## Paso 3: Desplegar en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno:
   - Click en "Environment Variables"
   - Agrega las siguientes variables con los valores de Firebase:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
     ```

5. Click en "Deploy"
6. ¡Espera a que termine el despliegue!

## Paso 4: Verificar

1. Una vez desplegado, Vercel te dará una URL
2. Visita la URL para ver tu aplicación en vivo
3. Prueba agregar un regalo desde `/admin`
4. Verifica que los invitados puedan ver y reclamar regalos

## 🎉 ¡Listo!

Tu aplicación ahora está en vivo y lista para compartir con los invitados del baby shower.

## Actualizaciones Futuras

Cada vez que hagas cambios y los subas a GitHub:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel automáticamente detectará los cambios y redesplegará tu aplicación.

## Solución de Problemas

### Error: Firebase no está configurado
- Verifica que todas las variables de entorno estén correctamente configuradas en Vercel
- Asegúrate de que no haya espacios extra en los valores

### Error: No se pueden subir imágenes
- Verifica que las reglas de Storage estén configuradas correctamente
- Asegúrate de que el bucket de Storage esté habilitado

### Error: No se pueden agregar/reclamar regalos
- Verifica que las reglas de Firestore estén configuradas correctamente
- Revisa la consola de Firebase para ver si hay errores

## Seguridad (Opcional pero Recomendado)

Para mayor seguridad, puedes agregar autenticación al panel de admin:
1. Habilita Firebase Authentication
2. Agrega un login simple con email/password
3. Protege la ruta `/admin` para que solo usuarios autenticados puedan acceder

## Personalización

Para cambiar colores, textos o diseño:
- Los colores principales están en `tailwind.config.js`
- Los textos se pueden editar directamente en `app/page.tsx` y `app/admin/page.tsx`
- Los estilos globales están en `app/globals.css`
