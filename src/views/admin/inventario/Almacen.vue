<template>
  <v-container fluid class="py-6">
    <v-card rounded="lg" elevation="3">
      <v-toolbar flat color="transparent" density="comfortable">
        <v-icon icon="mdi-warehouse" color="primary" class="ms-4"></v-icon>
        <v-toolbar-title class="font-weight-bold">Gestión de almacenes</v-toolbar-title>

        <v-btn
          color="primary"
          rounded="lg"
          prepend-icon="mdi-plus"
          @click="abrirCrear"
        >
          Nuevo almacén
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-text-field
          v-model="buscar"
          label="Buscar por nombre o descripción"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="mb-4"
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="almacenes"
          :search="buscar"
          :loading="cargando"
          item-value="id"
          hover
          no-data-text="No hay almacenes registrados"
        >
          <template v-slot:item.sucursal_id="{ item }">
            <v-chip size="small" color="primary" variant="tonal">
              {{ nombreSucursal(item) }}
            </v-chip>
          </template>

          <template v-slot:item.descripcion="{ item }">
            <span v-if="item.descripcion">{{ item.descripcion }}</span>
            <span v-else class="text-medium-emphasis">—</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              color="primary"
              size="small"
              variant="text"
              @click="abrirEditar(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              color="error"
              size="small"
              variant="text"
              @click="abrirEliminar(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Formulario -->
    <v-dialog v-model="dialog" max-width="560" persistent>
      <v-form @submit.prevent="guardar">
        <v-card rounded="lg">
          <v-card-title class="font-weight-bold">
            {{ editando ? 'Editar almacén' : 'Nuevo almacén' }}
          </v-card-title>
          <v-card-subtitle>
            {{
              editando
                ? 'Modifica los datos del almacén'
                : 'Registra un nuevo almacén'
            }}
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-card-text>
            <v-text-field
              v-model="form.nombre"
              label="Nombre"
              prepend-inner-icon="mdi-warehouse"
              variant="outlined"
              density="comfortable"
              :error-messages="errores.nombre"
              autofocus
            ></v-text-field>

            <v-textarea
              v-model="form.descripcion"
              label="Descripción"
              prepend-inner-icon="mdi-text-box-outline"
              variant="outlined"
              density="comfortable"
              rows="2"
              auto-grow
              :error-messages="errores.descripcion"
            ></v-textarea>

            <v-select
              v-model="form.sucursal_id"
              :items="sucursales"
              item-title="nombre"
              item-value="id"
              label="Sucursal"
              prepend-inner-icon="mdi-store-outline"
              variant="outlined"
              density="comfortable"
              :error-messages="errores.sucursal_id"
              no-data-text="Primero registra una sucursal"
            ></v-select>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-btn variant="text" @click="cerrar">Cancelar</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              color="primary"
              prepend-icon="mdi-content-save"
              :loading="guardando"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Confirmar eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="font-weight-bold">Eliminar almacén</v-card-title>
        <v-card-text>
          ¿Seguro que deseas eliminar
          <strong>{{ aEliminar?.nombre }}</strong>? Esta acción no se puede
          deshacer.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn
            color="error"
            prepend-icon="mdi-delete"
            :loading="eliminando"
            @click="confirmarEliminar"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  funListar as funListarAlmacenes,
  funGuardar as funGuardarAlmacen,
  funModificar as funModificarAlmacen,
  funEliminar as funEliminarAlmacen,
} from '@/router/services/almacen.service';
import { funListar as funListarSucursales } from '@/router/services/sucursal.service';
import type { Almacen } from '@/router/services/interfaces/Almacen';
import type { Sucursal } from '@/router/services/interfaces/Sucursal';

interface AlmacenForm {
  id?: number;
  nombre: string;
  descripcion: string;
  sucursal_id: number | null;
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'NOMBRE', key: 'nombre' },
  { title: 'DESCRIPCIÓN', key: 'descripcion' },
  { title: 'SUCURSAL', key: 'sucursal_id' },
  { title: 'ACCIONES', key: 'actions' },
];

const almacenes = ref<Almacen[]>([]);
const sucursales = ref<Sucursal[]>([]);
const buscar = ref<string>('');
const cargando = ref<boolean>(true);

const dialog = ref<boolean>(false);
const guardando = ref<boolean>(false);
const editando = ref<boolean>(false);
const errores = ref<Record<string, string | string[]>>({});

const dialogEliminar = ref<boolean>(false);
const eliminando = ref<boolean>(false);
const aEliminar = ref<Almacen | null>(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

const form = ref<AlmacenForm>({
  nombre: '',
  descripcion: '',
  sucursal_id: null,
});

onMounted(async () => {
  await Promise.all([listarAlmacenes(), listarSucursales()]);
});

async function listarAlmacenes() {
  cargando.value = true;
  try {
    const { data } = await funListarAlmacenes();
    almacenes.value = Array.isArray(data) ? data : (data?.data ?? []);
  } catch (error: any) {
    notificar(
      error?.response?.data?.message ?? 'No se pudieron cargar los almacenes',
      'error',
    );
  } finally {
    cargando.value = false;
  }
}

async function listarSucursales() {
  try {
    const { data } = await funListarSucursales();
    sucursales.value = Array.isArray(data) ? data : (data?.data ?? []);
  } catch (error: any) {
    notificar(
      error?.response?.data?.message ?? 'No se pudieron cargar las sucursales',
      'error',
    );
  }
}

function nombreSucursal(almacen: Almacen) {
  return (
    almacen.sucursal?.nombre ??
    sucursales.value.find((s) => s.id === almacen.sucursal_id)?.nombre ??
    'Sin sucursal'
  );
}

function abrirCrear() {
  form.value = { nombre: '', descripcion: '', sucursal_id: null };
  errores.value = {};
  editando.value = false;
  dialog.value = true;
}

function abrirEditar(almacen: Almacen) {
  form.value = {
    id: almacen.id,
    nombre: almacen.nombre ?? '',
    descripcion: almacen.descripcion ?? '',
    sucursal_id: almacen.sucursal_id ?? null,
  };
  errores.value = {};
  editando.value = true;
  dialog.value = true;
}

function cerrar() {
  dialog.value = false;
  errores.value = {};
}

async function guardar() {
  errores.value = {};

  const nuevosErrores: Record<string, string[]> = {};
  if (!form.value.nombre.trim()) {
    nuevosErrores.nombre = ['El nombre es obligatorio'];
  }
  if (!form.value.sucursal_id) {
    nuevosErrores.sucursal_id = ['Selecciona una sucursal'];
  }
  if (Object.keys(nuevosErrores).length) {
    errores.value = nuevosErrores;
    return;
  }

  const payload: Almacen = {
    nombre: form.value.nombre.trim(),
    descripcion: form.value.descripcion.trim(),
    sucursal_id: form.value.sucursal_id as number,
  };

  guardando.value = true;
  try {
    if (form.value.id) {
      await funModificarAlmacen(form.value.id, payload);
      notificar('Almacén actualizado correctamente');
    } else {
      await funGuardarAlmacen(payload);
      notificar('Almacén registrado correctamente');
    }
    dialog.value = false;
    await listarAlmacenes();
  } catch (error: any) {
    aplicarErrores(error);
  } finally {
    guardando.value = false;
  }
}

function abrirEliminar(almacen: Almacen) {
  aEliminar.value = almacen;
  dialogEliminar.value = true;
}

async function confirmarEliminar() {
  if (!aEliminar.value?.id) return;

  eliminando.value = true;
  try {
    await funEliminarAlmacen(aEliminar.value.id);
    dialogEliminar.value = false;
    aEliminar.value = null;
    notificar('Almacén eliminado correctamente');
    await listarAlmacenes();
  } catch (error: any) {
    notificar(
      error?.response?.data?.message ?? 'No se pudo eliminar el almacén',
      'error',
    );
  } finally {
    eliminando.value = false;
  }
}

function aplicarErrores(error: any) {
  const data = error?.response?.data;
  if (error?.response?.status === 422 && data?.errors) {
    errores.value = data.errors;
    notificar(data.message ?? 'Revisa los datos del formulario', 'warning');
  } else {
    notificar(data?.message ?? 'Ocurrió un error inesperado', 'error');
  }
}

function notificar(text: string, color = 'success') {
  snackbar.value = { show: true, text, color };
}
</script>
