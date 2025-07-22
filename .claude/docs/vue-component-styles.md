# Vue Component Style Guide

Basado en el análisis del archivo `pages/example.vue`, este documento establece las convenciones de estilo para componentes Vue en este proyecto.

## Estructura del Componente

### Orden de Bloques
1. `<script setup>` - Siempre primero
2. `<template>` - Después del script
3. `<style>` - Al final (si es necesario)

### Estructura del Script Setup

```vue
<script setup>
// IMPORTS //////////////////
import { ... } from '...';

// SERVICES //////////////////
const serviceInstance = createService();

// LAYOUT //////////////////
definePageMeta({
    layout: 'layoutName',
});

// PAGE PERMISSIONS //////////////////
const permissions = {
    types: ['...'],
    permissions: {
        '...': ['...'],
    },
};

// REFS //////////////////
const refName = ref(null);

// VARS //////////////////
const { t } = useI18n();
const variableName = ref/reactive(...);

// MODALS //////////////////
const openModalName = ref(false);

// PARAMS //////////////////
const paramName = route.params.name;

// USE //////////////////
const storeInstance = useStore();

// INIT //////////////////
// Inicialización de variables globales

// METHODS //////////////////
// Funciones del componente

// COMPUTED //////////////////
const computedName = computed(() => {
    // lógica
});

// CYCLELIFE //////////////////
onMounted(async () => {
    // lógica de mounted
});
</script>
```

## Convenciones de Nomenclatura

### Variables y Referencias
- **refs**: Prefijo `ref` + nombre descriptivo en camelCase
  ```js
  const refBasicInformation = ref(null);
  const refNavigationSure = ref(null);
  ```

- **variables reactivas**: camelCase directo
  ```js
  const loadings = reactive({
      save: false,
      delete: false,
  });
  ```

- **computeds**: Prefijo `c_` + nombre descriptivo
  ```js
  const c_name = computed(() => {
      // lógica
  });
  ```

- **modales**: Prefijo `openModal` + nombre descriptivo
  ```js
  const openModalDelete = ref(false);
  const openModalActivate = ref(false);
  ```

### Funciones
- **Funciones asíncronas**: Prefijo `async function`
- **Handlers de eventos**: Prefijo `on` + acción
  ```js
  async function onSubmit() { }
  async function onDelete() { }
  async function onActivate() { }
  ```

- **Funciones utilitarias**: Nombre descriptivo directo
  ```js
  function goBack() { }
  async function getCompany() { }
  ```

## Comentarios de Sección

Usar comentarios con barras para dividir secciones:

```js
// IMPORTS //////////////////
// SERVICES //////////////////
// LAYOUT //////////////////
// PAGE PERMISSIONS //////////////////
// REFS //////////////////
// VARS //////////////////
// MODALS //////////////////
// PARAMS //////////////////
// USE //////////////////
// INIT //////////////////
// METHODS //////////////////
// COMPUTED //////////////////
// CYCLELIFE //////////////////
```

## Estructura del Template

### Organización
1. **Componentes de utilidad** (permisos, modales) al inicio
2. **Estructura principal** del layout
3. **Componentes específicos** de la página

### Comentarios en Template
```html
<!-- CONTROL DE CAMBIOS -->
<!-- MODAL DELETE -->
<!-- MODAL ACTIVATE -->
<!-- LEFT -->
<!-- COLUMN RIGHT -->
```

## Patrones de Código

### Manejo de Estados
```js
const loadings = reactive({
    save: false,
    delete: false,
    activate: false,
});

const data = reactive({
    company: {},
    providers: {},
});
```

### Validación y Envío de Formularios
```js
async function onSubmit() {
    const validBasicInformation = await refBasicInformation.value.onValidate();
    const validQualification = await refQualification.value.onValidate();
    
    if (validBasicInformation && validQualification) {
        _appStore.locked = true;
        loadings.save = true;
        error.value = null;
        
        // lógica de envío
        
        loadings.save = false;
        _appStore.locked = false;
    } else {
        scrollToError('formCompany', 250);
    }
}
```

### Manejo de Permisos
```js
const permissionsPage = {
    types: ['manager'],
    permissions: {
        'structure.companies': ['edit', 'show'],
    },
};
```

## Buenas Prácticas

1. **Siempre usar TypeScript** para imports de modelos
2. **Manejar estados de carga** para mejorar UX
3. **Validar formularios** antes de enviar
4. **Usar permisos** para controlar acceso
5. **Implementar navegación segura** con control de cambios
6. **Internacionalización** con useI18n para todos los textos
7. **Notificaciones** para feedback del usuario
8. **Manejo de errores** con mensajes descriptivos

## Ejemplos de Uso

### Declaración de Componente
```js
// Correcto
const refBasicInformation = ref(null);

// Incorrecto
const basicInformationRef = ref(null);
```

### Función Asíncrona
```js
// Correcto
async function getCompany() {
    if (!isNew) {
        data.company = await companyService.getCompany(uid_company, { deep: true });
        if (!data.company) navigateTo(routeBase);
    } else data.company = company.companyDefaultValues;
}

// Incorrecto
const getCompany = async () => {
    // lógica
}
```

### Computed
```js
// Correcto
const c_name = computed(() => {
    if (!data.company) return isNew ? 'New company' : t('loading...');
    return data.company.name;
});

// Incorrecto
const companyName = computed(() => {
    // lógica
});
```