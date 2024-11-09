## Nutricoaching Integral - Backend

<div align="center">
    <img src="https://github.com/user-attachments/assets/0150c134-b66f-4226-9b80-877699a593a0" alt="Descripción" width="400" />
</div>

### 1. Descripcion General del Proyecto

</br>

Este proyecto consiste en el desarrollo de una API RESTful que sirve como backend para una aplicación web/móvil. La API es responsable de manejar la lógica de negocio, autenticación de usuarios, procesamiento de datos y la comunicación con la base de datos.

</br>

### 2. Funcionalidades Principales

</br>

- **Autenticacion y Autorizacion:** Los usuarios pueden registrarse e iniciar sesion, tambien manejar tokens de sesion (JWT). El sistema maneja permisos y roles para controlar el acceso a ciertas rutas y acciones.

- **Gestion de Usuarios:** CRUD (Crear, Leer, Actualizar y Eliminar) de usuarios, incluyendo manejo de roles.

- **Manejo Productos, Servicios y Viandas:** CRUD para los productos, servicios y viandas ofrecidos por la plataforma.

- **Procesamiento de Pagos :** Integracion con la pasarela de pagos de Mercado Pago para manejar transacciones seguras y en tiempo real.

- **Gestion de Reservas:** Permite la creación, actualización y cancelación de reservas o pedidos, con lógica para la disponibilidad y confirmaciones automáticas.

- **Notificaciones:** Sistema de notificaciones a través de correos electrónicos con NodeMailer integrado.

</br>

### 3. Arquitectura del Proyecto

</br>

- **Tecnologias utilizadas:**

  - **Backend:** NestJS
  - **Base de Datos:** MySQL
  - **Autenticacion:** JWT (Json Web Token)
  - **Testing:** Jest
  - **Infraestructura:** Desplegado en \*

</br>

### 4. Configuracion del Entorno

</br>

#### a) Clonar Repositorio

</br>

```bash
git clone https://github.com/tomascardenas96/nutricouching-back
```

</br>

#### b) Instalacion de Dependencias

</br>

Para instalar las dependencias, ejecutar el siguiente comando en la raiz del backend

```bash
npm install
```

</br>

#### c) Variables de Entorno

</br>

```bash
SECRET_KEY
USER_NAME_MAIL
USER_PASSWORD_MAIL
```

</br>

#### d) Como ejecutar el proyecto

</br>

```bash
npm run start:dev
```

</br>

### 5. Arquitectura del sistema

#### a) Estructuracion de las carpetas

</br>

```bash
src/
├── auth/
    ├── dto/
    ├── guard/
    ├── auth.controller.spec.ts
    ├── auth.controller.ts
    ├── auth.module.ts
    ├── auth.service.spec.ts
    ├── auth.service.ts
├── booking/
    ├── dto/
    ├── entities/
    ├── booking.controller.spec.ts
    ├── booking.controller.ts
    ├── booking.module.ts
    ├── booking.service.spec.ts
    ├── booking.service.ts
├── ...
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
```

</br>

#### 5) Diagrama de Relacion de Entidades

![Captura de pantalla 2024-11-08 123313](https://github.com/user-attachments/assets/1ba6c9d4-461c-4aad-b3be-c235bf815611)
