# ContactFlow Enterprise 💎
### Sistema Profesional de Gestión y Control de Contactos Empresariales

**ContactFlow Enterprise** es una aplicación web full-stack de alto rendimiento diseñada para la administración, búsqueda y organización de credenciales y contactos de redes corporativas. Cuenta con una interfaz de usuario de última generación basada en *glassmorphism* (efectos de cristal y agua translúcida) en modo claro unificado, diseñada para ofrecer una experiencia interactiva, rápida y fluida.

El proyecto está completamente dockerizado, lo que permite replicar e implementar todo el sistema (Base de datos PostgreSQL, ORM Prisma y Servidor Next.js 15) en cualquier máquina con un solo comando.

---

## ✨ Características Principales

* **Autenticación Segura**: Panel de acceso unificado con encriptación bcrypt, sesiones basadas en JWT seguras y animaciones inmersivas de entrada.
* **Dashboard de Métricas**: Tarjetas glassmorphic con estadísticas en tiempo real (Contactos totales, Empresas activas, Nuevos este mes) y un listado dinámico de agregados recientes.
* **Libreta de Contactos Avanzada**:
  * **Dos Vistas Interactivas**: Intercambio dinámico entre vista de tabla compacta corporativa y vista de tarjetas visuales elegantes con avatares.
  * **Búsqueda en Tiempo Real**: Filtro inteligente multicanal que busca instantáneamente por nombre, cargo, correo o empresa.
  * **Alertas Personalizadas**: Sistema de confirmación de eliminación permanente con físicas elásticas interactivas (Framer Motion), eliminando el uso de avisos nativos del navegador.
* **Modo Claro Ultra-Premium**: Estilizado con esferas HSL flotantes en el fondo que simulan cristal líquido y sombras difusas elegantes.

---

## 🛠️ Tecnologías del Proyecto

* **Core**: Next.js 15 (App Router), React 19 y TypeScript.
* **Diseño**: Tailwind CSS v4, Lucide Icons, Framer Motion (para micro-interacciones y modal de físicas).
* **Base de Datos**: PostgreSQL.
* **ORM & Acceso a Datos**: Prisma ORM (migraciones automatizadas y seeding).
* **Contenedores**: Docker & Docker Compose.

---

## 🚀 Guía de Replicación Local

Sigue estos sencillos pasos para descargar, configurar y ejecutar la aplicación en tu entorno de desarrollo.

### Opción A: Despliegue Rápido con Docker (Recomendado)

Esta es la forma más rápida y limpia de replicar el proyecto, ya que Docker se encargará de instalar y configurar la base de datos y compilar el servidor automáticamente.

#### Requisitos Previos:
* Tener instalado **Docker** y **Docker Desktop** (con WSL 2 si estás en Windows).
* Tener instalado **Git**.

#### Pasos para la ejecución:

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tecsup-labs/lab-aws-ec2-virtualization-environment.git
   cd lab-aws-ec2-virtualization-environment
   ```

2. **Crear el Archivo de Variables de Entorno (`.env`)**:
   Crea un archivo llamado `.env` en la raíz del proyecto y copia la siguiente configuración por defecto:
   ```env
   DATABASE_URL="postgresql://postgres:postgres123@db:5432/contacts_db?schema=public"
   JWT_SECRET="your-super-secret-enterprise-jwt-key-2026"
   NODE_ENV="production"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

3. **Ejecutar el Stack de Docker**:
   Ejecuta el siguiente comando en tu terminal para compilar el proyecto y levantar los contenedores:
   ```bash
   docker compose up --build -d
   ```
   *Nota: El contenedor de la base de datos se creará, se aplicarán las migraciones de Prisma de forma automática a través del punto de entrada (`entrypoint.sh`) y se sembrarán datos de prueba para que no inicies con la base de datos vacía.*

4. **Acceder a la Aplicación**:
   Abre tu navegador e ingresa a:
   ```text
   http://localhost:3000
   ```

---

### Opción B: Ejecución en Entorno de Desarrollo Local (Sin Docker)

Si prefieres ejecutar el proyecto directamente en tu sistema local:

#### Requisitos Previos:
* **Node.js** (versión 18 o superior).
* **PostgreSQL** activo en tu máquina local.

#### Pasos para la ejecución:

1. **Clonar el proyecto e instalar dependencias**:
   ```bash
   git clone https://github.com/tecsup-labs/lab-aws-ec2-virtualization-environment.git
   cd lab-aws-ec2-virtualization-environment
   npm install
   ```

2. **Configurar el archivo `.env`**:
   Crea el archivo `.env` apuntando a tu PostgreSQL local:
   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/contacts_db?schema=public"
   JWT_SECRET="your-super-secret-enterprise-jwt-key-2026"
   NODE_ENV="development"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

3. **Ejecutar las migraciones y base de datos**:
   ```bash
   # Generar cliente de Prisma
   npx prisma generate
   
   # Aplicar migraciones a la base de datos
   npx prisma migrate dev
   
   # Sembrar la base de datos con contactos de prueba
   npx prisma db seed
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Acceder**: Abre tu navegador en `http://localhost:3000`.

---

## 🔑 Credenciales de Prueba por Defecto

Para ingresar al sistema una vez desplegado:

* **Usuario**: `demo@example.com`
* **Contraseña**: `admin123`
