# ContactFlow Enterprise 💎
### Laboratorio: Entorno de Virtualización y Despliegue en la Nube (AWS EC2 & Docker)

Este repositorio contiene la implementación y documentación del laboratorio de virtualización y despliegue de aplicaciones web de alto rendimiento. El proyecto consiste en **ContactFlow Enterprise**, una aplicación SaaS premium de gestión de contactos empresariales diseñada bajo un entorno *glassmorphic* en modo claro, dockerizada y desplegada en una máquina virtual **Windows Server 2025** sobre **Amazon Web Services (AWS) EC2**.

---

## 🚀 Arquitectura y Tecnologías del Proyecto

El laboratorio demuestra la integración de infraestructura en la nube, virtualización por contenedores y desarrollo de software moderno:

* **Infraestructura Cloud**: Amazon Web Services (AWS) EC2
* **Sistema Operativo Virtualizado**: Windows Server 2025 Base
* **Conectividad Remota**: Protocolo RDP (Remote Desktop Protocol) mediante Windows App
* **Orquestación de Contenedores**: Docker & Docker Compose
* **Frontend & Backend (Full Stack)**: Next.js 15, React 19 y TypeScript
* **Estilo y Diseño**: Tailwind CSS v4, shadcn/ui, Framer Motion (Glassmorphism & Liquid Light effects)
* **Base de Datos y Persistencia**: PostgreSQL con Prisma ORM

---

## 🛠️ Guía de Replicación Paso a Paso

Sigue esta guía detallada para levantar y probar la infraestructura y la aplicación desde cero.

### Fase 1: Creación de la Instancia en AWS EC2

1. **Acceder a la Consola de AWS**: Dirígete al servicio **EC2** y presiona **Launch Instance** (Lanzar Instancia).
2. **Seleccionar el Sistema Operativo (AMI)**: Selecciona **Microsoft Windows Server 2025 Base** (Free Tier Eligible).
3. **Tipo de Instancia**: Selecciona `t3.micro` (o `t2.micro` según disponibilidad en tu capa gratuita).
4. **Key Pair (Llave de Seguridad)**: Crea un nuevo par de llaves (.pem) llamado `lab-ec2-key.pem` y guárdalo de forma segura. Lo necesitarás para descifrar la contraseña.
5. **Configuración de Red (Security Groups)**:
   * Habilita el tráfico **RDP (Puerto 3389)** desde tu IP pública actual.
   * Agrega una regla personalizada para **TCP (Puerto 3000)** desde cualquier dirección (`0.0.0.0/0`) para permitir el acceso público a la aplicación web.
6. **Lanzar**: Presiona **Launch Instance** y espera a que el estado sea `Running` con las comprobaciones `2/2 checks` superadas.

---

### Fase 2: Conexión Remota mediante RDP

1. **Obtener Contraseña**:
   * En la consola de EC2, selecciona tu instancia, presiona **Connect** y ve a la pestaña **RDP client**.
   * Haz clic en **Get password**, sube tu archivo `lab-ec2-key.pem` y presiona **Decrypt password**. Copia la contraseña descifrada.
2. **Establecer Conexión**:
   * Descarga la aplicación **Windows App** (Microsoft Remote Desktop) en tu macOS/Linux/Windows.
   * Crea una nueva conexión con la **IP Pública** de tu instancia de AWS.
   * Conéctate utilizando las credenciales:
     * **Usuario**: `Administrator`
     * **Contraseña**: *(La contraseña descifrada en el paso anterior)*

---

### Fase 3: Preparación del Entorno en la Máquina Virtual

Una vez dentro de la sesión de escritorio remoto de Windows Server, abre el navegador (Microsoft Edge) e instala las siguientes herramientas obligatorias:

1. **Git para Windows**: Descarga e instala desde [git-scm.com](https://git-scm.com/).
2. **Docker Desktop para Windows**: Descarga e instala desde [docker.com](https://www.docker.com/).
   * *Nota: Asegúrate de habilitar las funciones de virtualización y WSL 2 si el asistente de instalación lo requiere.*
3. Abre la consola de **PowerShell** (o CMD) y verifica que las herramientas estén disponibles en las variables de entorno ejecutando:
   ```powershell
   git --version
   docker --version
   docker compose version
   ```

---

### Fase 4: Clonación y Despliegue de la Aplicación con Docker

En la terminal de tu máquina virtual Windows Server, realiza el flujo de clonación y lanzamiento automatizado:

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tecsup-labs/lab-aws-ec2-virtualization-environment.git
   ```
2. **Entrar al Directorio del Proyecto**:
   ```bash
   cd lab-aws-ec2-virtualization-environment
   ```
3. **Crear archivo de Variables de Entorno (`.env`)**:
   * Crea un archivo llamado `.env` en la raíz del proyecto para indicarle a Docker Compose las credenciales internas de la base de datos PostgreSQL:
   ```env
   DATABASE_URL="postgresql://postgres:postgres123@db:5432/contacts_db?schema=public"
   JWT_SECRET="your-super-secret-enterprise-jwt-key-2026"
   NODE_ENV="production"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```
4. **Ejecutar con Docker Compose**:
   Levanta la base de datos PostgreSQL y compila el frontend de Next.js en producción automáticamente con un solo comando:
   ```bash
   docker compose up --build -d
   ```
   *El contenedor del backend esperará a que la base de datos esté lista, ejecutará las migraciones de Prisma ORM automáticamente a través del entrypoint y sembrará datos de prueba.*

---

### Fase 5: Verificación en el Navegador

* **Acceso Local (Dentro de la VM)**: Abre el navegador en Windows Server e ingresa a `http://localhost:3000`.
* **Acceso Público (Desde tu Mac física)**: Abre el navegador e ingresa utilizando la **IP Pública de tu instancia AWS** en el puerto 3000:
  ```text
  http://<IP_PUBLICA_AWS>:3000
  ```

#### 🔑 Credenciales por Defecto para Pruebas:
* **Usuario**: `demo@example.com`
* **Contraseña**: `admin123`

---

## 🎨 Características Destacadas de la Interfaz

* **Glassmorphism Premium**: Todas las ventanas y tarjetas del dashboard privado tienen un fondo traslúcido reactivo que flota elegantemente.
* **Fondo de Cristal Líquido**: Cuenta con esferas HSL dinámicas y difusas en el fondo que generan una sensación de fluidez y modernidad.
* **Modal de Confirmación Animado**: Para las acciones sensibles de eliminación de contactos, se diseñó un cuadro de diálogo elástico con rebotes físicos gracias a Framer Motion.
* **Modo Claro Unificado**: Diseñado exclusivamente en tonos claros sofisticados y minimalistas para maximizar la legibilidad y el enfoque profesional.
