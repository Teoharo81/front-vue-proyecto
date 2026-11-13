<template>
  <v-container fluid class="py-6">
    <v-card rounded="lg" elevation="3">
      <v-toolbar flat color="transparent" density="comfortable">
        <v-icon icon="mdi-store-outline" color="primary" class="ms-4"></v-icon>
        <v-toolbar-title class="font-weight-bold">Gestión de sucursales</v-toolbar-title>

        <v-btn
          color="primary"
          rounded="lg"
          prepend-icon="mdi-plus"
          @click="abrirCrear"
        >
          Nueva sucursal
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-text-field
          v-model="buscar"
          label="Buscar por nombre, dirección o teléfono"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="mb-4"
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="sucursales"
          :search="buscar"
          :loading="cargando"
          item-value="id"
          hover
          no-data-text="No hay sucursales registradas"
        >
          <template v-slot:item.telefono="{ item }">
            <span v-if="item.telefono">{{ item.telefono }}</span>
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
            {{ editando ? 'Editar sucursal' : 'Nueva sucursal' }}
          </v-card-title>
          <v-card-subtitle>
            {{
              editando
                ? 'Modifica los datos de la sucursal'
                : 'Registra una nueva sucursal'
            }}
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-card-text>
            <v-text-field
              v-model="form.nombre"
              label="Nombre"
              prepend-inner-icon="mdi-store"
              variant="outlined"
              density="comfortable"
              :error-messages="errores.nombre"
              autofocus
            ></v-text-field>

            <v-text-field
              v-model="form.direccion"
              label="Dirección"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              density="comfortable"
              :error-messages="errores.direccion"
            ></v-text-field>

            <v-text-field
              v-model="form.telefono"
              label="Teléfono"
              prepend-inner-icon="mdi-phone"
              variant="outlined"
              density="comfortable"
              :error-messages="errores.telefono"
            ></v-text-field>
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
        <v-card-title class="font-weight-bold">Eliminar sucursal</v-card-title>
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
  funListar,
  funGuardar,
  funModificar,
  funEliminar,
} from '@/router/services/sucursal.service';
import type { Sucursal } from '@/router/services/interfaces/Sucursal';

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'NOMBRE', key: 'nombre' },
  { title: 'DIRECCIÓN', key: 'direccion' },
  { title: 'TELÉFONO', key: 'telefono' },
  { title: 'ACCIONES', key: 'actions' },
];

const sucursales = ref<Sucursal[]>([]);
const buscar = ref<string>('');
const cargando = ref<boolean>(true);

const dialog = ref<boolean>(false);
const guardando = ref<boolean>(false);
const editando = ref<boolean>(false);
const errores = ref<Record<string, string | string[]>>({});

const dialogEliminar = ref<boolean>(false);
const eliminando = ref<boolean>(false);
const aEliminar = ref<Sucursal | null>(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

const form = ref<Sucursal>({ nombre: '', direccion: '', telefono: '' });

onMounted(listarSucursales);

async function listarSucursales() {
  cargando.value = true;
  try {
    const { data } = await funListar();
    sucursales.value = Array.isArray(data) ? data : (data?.data ?? []);
  } catch (error: any) {
    notificar(
      error?.response?.data?.message ?? 'No se pudieron cargar las sucursales',
      'error',
    );
  } finally {
    cargando.value = false;
  }
}

function abrirCrear() {
  form.value = { nombre: '', direccion: '', telefono: '' };
  errores.value = {};
  editando.value = false;
  dialog.value = true;
}

function abrirEditar(sucursal: Sucursal) {
  form.value = {
    id: sucursal.id,
    nombre: sucursal.nombre ?? '',
    direccion: sucursal.direccion ?? '',
    telefono: sucursal.telefono ?? '',
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

  if (!form.value.nombre.trim()) {
    errores.value = { nombre: ['El nombre es obligatorio'] };
    return;
  }

  guardando.value = true;
  try {
    if (form.value.id) {
      await funModificar(form.value.id, form.value);
      notificar('Sucursal actualizada correctamente');
    } else {
      await funGuardar(form.value);
      notificar('Sucursal registrada correctamente');
    }
    dialog.value = false;
    await listarSucursales();
  } catch (error: any) {
    aplicarErrores(error);
  } finally {
    guardando.value = false;
  }
}

function abrirEliminar(sucursal: Sucursal) {
  aEliminar.value = sucursal;
  dialogEliminar.value = true;
}

async function confirmarEliminar() {
  if (!aEliminar.value?.id) return;

  eliminando.value = true;
  try {
    await funEliminar(aEliminar.value.id);
    dialogEliminar.value = false;
    aEliminar.value = null;
    notificar('Sucursal eliminada correctamente');
    await listarSucursales();
  } catch (error: any) {
    notificar(
      error?.response?.data?.message ?? 'No se pudo eliminar la sucursal',
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
