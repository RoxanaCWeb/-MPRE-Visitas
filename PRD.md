
# Documento de Requisitos del Producto (PRD)
## Sistema de Gestión de Visitas ART

**Versión:** 1.2  
**Fecha:** 2024-08-03  
**Autor:** Senior Frontend Engineer  
**Estado:** En Desarrollo (Fase 1.2)

---

### 1. Resumen Ejecutivo

El **Sistema de Gestión de Visitas ART** es una aplicación web interna diseñada para una Aseguradora de Riesgos del Trabajo (ART). Su objetivo principal es centralizar y optimizar la gestión de visitas de prevención y seguridad laboral que se realizan en los establecimientos de las empresas clientes.

Esta fase del desarrollo introduce un **flujo de programación de visitas completo**, mejora la visualización de la información para el rol de **Preventor** con notificaciones de feedback, y refina la lógica de los estados de las visitas, permitiéndole gestionar su agenda de manera más eficiente y priorizada.

### 2. Objetivos del Producto

*   **Centralizar la Información:** Crear una única fuente de verdad para la programación, ejecución y seguimiento de las visitas de prevención.
*   **Optimizar el Flujo de Trabajo:** Simplificar las tareas diarias tanto del personal de campo (Preventores) como del administrativo (Backoffice).
*   **Mejorar la Priorización:** Facilitar la identificación de visitas urgentes o vencidas mediante indicadores visuales claros.
*   **Proporcionar Feedback Claro:** Informar al usuario sobre el resultado de sus acciones a través de notificaciones en pantalla.
*   **Establecer una Base Escalable:** Construir una arquitectura de software robusta que permita añadir nuevas funcionalidades en el futuro.

### 3. Perfiles de Usuario y Conceptos Clave

#### 3.1 Perfiles de Usuario

La aplicación está diseñada para dos perfiles de usuario bien definidos:

*   **Preventor:**
    *   **Descripción:** Profesional técnico que realiza las inspecciones de seguridad en campo.
    *   **Necesidades Clave:** Visualizar su agenda, programar y reprogramar visitas, priorizar tareas, acceder a detalles y cargar actas de visita.

*   **Backoffice:**
    *   **Descripción:** Personal administrativo encargado de la planificación y gestión de las visitas.
    *   **Necesidades Clave:** Programar visitas, gestionar clientes, procesar informes y administrar el sistema.

#### 3.2 Fechas Clave

*   **Fecha Límite:** Fecha máxima asignada por Backoffice para que la visita sea completada. Su incumplimiento tiene implicaciones de gestión.
*   **Fecha Programada:** Fecha en la que el Preventor planea realizar la visita. Es una fecha tentativa y puede ser modificada (reprogramada).
*   **Fecha de Visita (o de Realización):** Fecha real en la que la visita fue ejecutada y se cargó el acta correspondiente.

### 4. Requisitos Funcionales

#### 4.1. Acceso y Selección de Rol
*   **RF-001:** Al ingresar, el usuario ve una pantalla para seleccionar su rol ("Preventor" o "Backoffice").
*   **RF-002:** Al seleccionar un rol, la aplicación redirige al panel principal correspondiente.

#### 4.2. Estructura de Navegación Principal (Layout)
*   **RF-003:** La interfaz principal se compone de una barra de navegación lateral (sidebar) y un área de contenido principal.
*   **RF-004:** El sidebar es colapsable y contiene el menú de navegación y la opción "Cambiar Rol".
*   **RF-005:** El menú del sidebar es dinámico según el rol.
    *   **Menú Preventor:** Inicio, Establecimientos, Mis Visitas.
    *   **Menú Backoffice:** Inicio, Establecimientos, Visitas, Proveedores, Usuarios.

#### 4.3. Pantalla "Mis Visitas" (Vista del Preventor)
*   **RF-006:** Esta pantalla es accesible desde el sidebar para el rol de Preventor.
*   **RF-007: Filtros de Búsqueda:**
    *   La pantalla incluye un panel de filtros para refinar la lista de visitas.
    *   Los campos de filtro incluyen Cliente, Contrato, Establecimiento, Estado y Fechas.
    *   Se añade un filtro de tipo checkbox: **"Mostrar sólo próximos a vencer (7 días)"**.
*   **RF-008: Visualización de Visitas (Tabla y Tarjetas):**
    *   Muestra un listado de las visitas que coinciden con los filtros aplicados.
    *   **Columnas de la tabla:** Selección (checkbox), Establecimiento, Estado, Fecha Visita, Fecha Programada, Fecha Límite, Acciones.
    *   **Codificación de Color para Fecha Límite:** La columna "Fecha Límite" usa colores para indicar urgencia (solo para visitas pendientes, programadas o reprogramadas):
        *   **Rojo:** La fecha ya ha pasado (visita vencida).
        *   **Naranja:** La fecha de vencimiento es en 7 días o menos.
        *   **Normal:** Sin color especial para las demás fechas.
    *   **Indicador de Estado:** La columna "Estado" muestra una insignia (badge) con un color y texto distintivo para cada estado.
*   **RF-009: Programación de Visitas:**
    *   **Selección Múltiple:** El usuario puede seleccionar una o más visitas en estado "Pendiente", "Programada" o "Reprogramada" usando checkboxes. Los checkboxes para otros estados están deshabilitados.
    *   **Botón de Programación:** Un botón **"Programar Visitas"** se habilita sobre la lista cuando al menos una visita está seleccionada.
*   **RF-010: Notificaciones de Feedback:**
    *   Al completar acciones clave (ej. programar visitas, guardar acta), se muestra una notificación temporal ("toast") confirmando el éxito de la operación.

#### 4.4. Pantalla "Detalle de Visita" (Vista del Preventor)
*   **RF-011:** Al hacer clic en "Ver Visita", se navega a esta pantalla.
*   **RF-012:** La pantalla muestra una cabecera con los detalles de la visita.
*   **RF-013:** Contiene un formulario detallado de **"Acta de Visita"**.
    *   **Modo Solo Lectura:** Si la visita está en estado "Realizada", el formulario se muestra deshabilitado para prevenir modificaciones.
*   **RF-014:** El formulario incluye funcionalidad para **adjuntar archivos** (PDF, imágenes), con opciones para listar, descargar y eliminar los archivos subidos.

#### 4.5. Pantallas Provisionales (Placeholders)
*   **RF-015:** Las secciones del menú que aún no han sido desarrolladas muestran una pantalla genérica con un título y un mensaje "Esta sección está en desarrollo".

### 5. Requisitos No Funcionales

*   **RNF-001: Diseño y UI/UX:**
    *   **Tema Visual:** La aplicación utiliza un tema claro (`light mode`).
    *   **Paleta de Colores:** Primario (`#1E272E`), Secundario (`#1473E6`), Fondos (`#FFFFFF`, `#F3F4F6`), Alertas (Rojo para vencido, Naranja para por vencer).
    *   **Responsividad:** La interfaz debe ser completamente adaptable a diferentes tamaños de pantalla.
*   **RNF-002: Pila Tecnológica:**
    *   **Frontend:** React con TypeScript.
    *   **Estilos:** Tailwind CSS.
    *   **Datos:** Actualmente se utilizan datos de prueba (mock data).
*   **RNF-003: Accesibilidad:**
    *   Los elementos interactivos deben tener estados de `hover` y `focus` claros. Se deben utilizar atributos ARIA.

### 6. Flujo de Usuario Principal (Preventor)

1.  **Entrada y Selección de Rol:** El usuario entra a la app, selecciona el rol "Preventor".
2.  **Vista Principal:** Se carga el panel principal.
3.  **Navegación a "Mis Visitas":** El usuario hace clic en "Mis Visitas".
4.  **Visualización de Visitas:** El área de contenido se actualiza para mostrar la lista de visitas. El usuario identifica rápidamente las visitas **vencidas (rojo)** y las **próximas a vencer (naranja)**.
5.  **Selección para Programar:** El usuario marca los checkboxes de varias visitas en estado "Pendiente" que desea programar.
6.  **Acción de Programar:** El botón "Programar Visitas" se activa. El usuario hace clic en él.
7.  **Panel de Programación:** Se abre un panel lateral donde el usuario selecciona una fecha del calendario y hace clic en "Guardar".
8.  **Confirmación y Actualización:** El panel se cierra, el estado de las visitas seleccionadas cambia de "Pendiente" a "Programada", y aparece una notificación en pantalla confirmando la acción.
9.  **Ver Detalle de Visita:** El usuario hace clic en "Ver visita" en una de las visitas programadas.
10. **Registro de Acta:** Se navega a la pantalla de detalle, donde completa el formulario "Acta de Visita", registra la fecha de realización y adjunta archivos de evidencia.
11. **Guardado:** El usuario guarda el acta, es redirigido a la lista principal, el estado de la visita cambia a "Realizada", y aparece una notificación de éxito.

### 7. Criterios de Aceptación

*   ✅ Un usuario puede seleccionar el rol de "Preventor" o "Backoffice".
*   ✅ El sidebar muestra el menú correspondiente al rol y es colapsable.
*   ✅ En "Mis Visitas", el preventor puede filtrar la lista por múltiples criterios.
*   ✅ Las fechas límite se muestran en rojo si están vencidas y en naranja si están próximas a vencer.
*   ✅ El preventor puede seleccionar múltiples visitas (solo las programables) y el checkbox "Seleccionar todo" refleja el estado de selección correctamente (incluido el estado intermedio).
*   ✅ Un botón "Programar Visitas" abre un panel lateral para asignar una fecha.
*   ✅ Al programar una visita "Pendiente", su estado cambia a "Programada".
*   ✅ El usuario recibe notificaciones de éxito al completar acciones clave.
*   ✅ El formulario de acta de visita está en modo solo lectura para visitas ya "Realizadas".