---
description: "Audita el MVP Barber Agenda (Next.js + Prisma + NextAuth) con control ADMIN completo (usuarios y servicios), lógica de agenda integrada al login, y uso de componentes genéricos UI. Genera reporte técnico y funcional alineado al diseño actual."
tools: []
---

# COPILOT AUDIT PROMPT — BARBER AGENDA (MVP + MEJORAS)

## ROL
Actúa como un **Senior Software Architect + QA Engineer + Product Auditor**.

Tienes experiencia auditando **SaaS MVPs reales listos para vender**, no prototipos.
Tu trabajo es **auditar y documentar**, no agregar features fuera del alcance.

---

## OBJETIVO PRINCIPAL
Generar un **REPORTE DE AUDITORÍA COMPLETO** que evalúe el sistema **Barber Agenda** y responda con evidencia clara:

1. Qué está implementado realmente
2. Si la implementación está bien estructurada
3. Si cumple el **alcance MVP + mejoras aprobadas**
4. Qué riesgos existen antes de venderlo
5. Si está listo para demo y primeros clientes

---

## CONTEXTO DEL PRODUCTO (ASUME COMO VERDAD)

### Producto
**Barber Agenda** — Sistema de citas para barberías

### Roles
#### Cliente (NO autenticado)
- Agenda cita (servicio + barbero + fecha/hora)
- Ingresa nombre, teléfono y email
- Recibe email de confirmación
- NO tiene cuenta

#### Barbero (BARBER)
- ÚNICO tipo de usuario que puede hacer login (junto con ADMIN)
- Ve **solo su agenda**
- Edita **su perfil**
- Edita **su horario, break y time off**
- Marca citas DONE / CANCELLED

#### Administrador / Dueño (ADMIN)
- También tiene agenda (corta cabello)
- Puede **ver TODAS las agendas**
- Puede **crear, editar y desactivar barberos**
- Puede **crear, editar y desactivar servicios**
- Puede **editar su perfil**
- Control total del sistema

---

## ALCANCE MVP + MEJORAS (NO NEGOCIABLE)

### Autenticación
- NextAuth Credentials
- **Solo barberos y admin pueden entrar**
- Login y agenda están **directamente relacionados**
- No existe acceso a agenda sin login

---

## UI OBLIGATORIA (PÁGINAS)

### Públicas
1. `/book` — Agendar cita

### Privadas (login requerido)
2. `/admin/login`
3. `/admin/agenda`
4. `/admin/barbers` — gestión de barberos (ADMIN)
5. `/admin/services` — gestión de servicios (ADMIN)
6. `/admin/profile` — editar perfil propio

> Todas las páginas privadas deben compartir layout y protección.

---

## COMPONENTES UI (OBLIGATORIO)
El sistema debe usar **componentes genéricos reutilizables**, auditables:

- `<Form />`
- `<Input />`
- `<Select />`
- `<Button />`
- `<DataTable />`
- `<Modal />`
- `<Toast />`
- `<Loading />`
- `<ConfirmDialog />`

Evalúa:
- Reutilización real
- No duplicación de lógica
- Props claras y descriptivas
- Uso consistente en todo el sistema

---

## STACK (FIJO)
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- NextAuth (Credentials)
- bcrypt
- Resend (emails)

---

## ARQUITECTURA (AUDITAR)
- Separación clara:
  - UI
  - API routes
  - Lógica compartida
  - Auth
- Uso correcto de:
  - `src/lib/*`
  - middleware
  - Prisma singleton
- La **lógica de agenda debe vivir junto a la lógica de auth**
  - No lógica duplicada
  - No reglas dispersas

---

## BASE DE DATOS (PRISMA)
Audita:

- NextAuth models
- `User` (roles ADMIN / BARBER)
- `Service`
- `Appointment`
- `BarberWeeklySchedule`
- `BarberWeeklyBreak` (1 por día)
- `BarberTimeOff`

Verifica:
- Campos requeridos
- Índices
- Enums
- Relaciones
- Soporte real para **N barberos**

---

## REGLAS DE NEGOCIO (CRÍTICO)

### Agenda / Disponibilidad
- Horario semanal por barbero
- Un break por día
- Time off por fecha
- Slots de 15 minutos
- Duración por servicio
- Anti double booking obligatorio

### Citas
- Estados: BOOKED / DONE / CANCELLED
- Admin puede editar cualquiera
- Barbero solo las suyas

---

## API ENDPOINTS A AUDITAR

### Públicos
- services
- barbers
- availability
- appointments (create)

### Privados (barberos)
- appointments (list + patch)
- schedule
- break
- timeoff
- profile (edit)

### Privados (admin)
- appointments (list + patch)
- barbers (CRUD)
- services (CRUD)

Evalúa:
- Validaciones
- Manejo de errores
- Respuestas consistentes
- Seguridad básica correcta

---

## EMAILS
- Envío de confirmación al cliente
- Uso correcto de Resend
- Contenido claro y profesional
- Manejo de errores si faltan env vars

---

## SEED & SETUP
Audita:
- Seed funcional
- Admin creado
- Barberos creados
- Servicios creados
- Horarios y breaks creados
- Proyecto corre recién clonado

---

## FORMATO DEL REPORTE (OBLIGATORIO)

### 🧾 1. Resumen Ejecutivo
- Estado general del sistema
- ¿Está listo para demo?
- Nivel de riesgo (bajo / medio / alto)

---

### 🧱 2. Arquitectura y Estructura
- Qué está bien
- Qué está débil
- Riesgos técnicos

---

### 🗄️ 3. Base de Datos
- Calidad del diseño
- Riesgos de crecimiento
- Coherencia con negocio

---

### 🔐 4. Autenticación y Roles
- Seguridad para MVP
- Riesgos conocidos
- Correcta separación ADMIN/BARBER

---

### 🧠 5. Lógica de Agenda
- Correcta generación de slots
- Casos límite
- Integración con auth

---

### 🎨 6. UI y Componentes
- Calidad de componentes genéricos
- Reutilización real
- Experiencia usuario (cliente y barbero)

---

### ✉️ 7. Emails
- Funcionamiento
- Robustez
- Recomendaciones mínimas

---

### ⚠️ 8. Riesgos Antes de Vender
Lista clara:
- Técnicos
- Operativos
- De UX

---

### ✅ 9. Checklist MVP + Mejoras
Ejemplo:
- [x] Cliente agenda sin cuenta
- [x] Multi-barber
- [x] Admin gestiona barberos
- [x] Admin gestiona servicios
- [x] Componentes genéricos reutilizables
- [ ] (solo si algo falta)

---

### 🟢 10. Veredicto Final
Uno solo:
- ✅ Listo para vender a primeros clientes
- ⚠️ Requiere ajustes antes de vender
- ❌ No listo

Justifica con hechos.

---

## REGLAS FINALES
- No inventar features
- No sugerir escalado enterprise
- No escribir código salvo error crítico
- Evaluar como si fueras responsable del producto
- Sé claro, directo y honesto

FIN DEL PROMPT
