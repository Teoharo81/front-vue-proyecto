<template>
  <v-container class="py-8" max-width="960">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="perfil-card" rounded="xl" elevation="6">
          <!-- Cabecera -->
          <div class="perfil-header">
            <v-avatar size="96" class="perfil-avatar">
              <span class="text-h4 font-weight-bold text-primary">{{ iniciales }}</span>
            </v-avatar>

            <div class="text-h5 font-weight-bold mt-4">
              {{ perfil.name || 'Sin nombre' }}
            </div>
            <div class="text-body-1 perfil-subtitulo">
              {{ perfil.email || 'Sin correo' }}
            </div>

            <v-chip
              class="mt-4"
              color="white"
              variant="flat"
              size="small"
              prepend-icon="mdi-shield-account"
            >
              Cuenta de administrador
            </v-chip>
          </div>

          <!-- Datos -->
          <v-card-text class="pt-2 pb-0">
            <v-skeleton-loader
              v-if="cargando"
              type="list-item-two-line@3"
              class="bg-transparent"
            />

            <v-list v-else lines="two" class="bg-transparent">
              <v-list-item prepend-icon="mdi-account-outline">
                <v-list-item-title class="text-caption text-medium-emphasis">
                  Nombre
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-1 text-high-emphasis">
                  {{ perfil.name || '—' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-1"></v-divider>

              <v-list-item prepend-icon="mdi-email-outline">
                <v-list-item-title class="text-caption text-medium-emphasis">
                  Correo electrónico
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-1 text-high-emphasis">
                  {{ perfil.email || '—' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-1"></v-divider>

              <v-list-item prepend-icon="mdi-calendar-clock">
                <v-list-item-title class="text-caption text-medium-emphasis">
                  Miembro desde
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-1 text-high-emphasis">
                  {{ fechaCreacion }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions class="pa-6 pt-2">
            <v-btn
              block
              color="error"
              variant="flat"
              rounded="lg"
              prepend-icon="mdi-logout"
              :loading="saliendo"
              @click="funSalir"
            >
              Cerrar sesión
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerPerfil } from '@/router/services/auth.service';

const perfil = ref<any>({});
const cargando = ref<boolean>(true);
const saliendo = ref<boolean>(false);
const router = useRouter();

const iniciales = computed(() => {
  const nombre = (perfil.value.name ?? '').trim();
  if (!nombre) return '?';
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((parte: string) => parte.charAt(0).toUpperCase())
    .join('');
});

const fechaCreacion = computed(() => {
  if (!perfil.value.created_at) return '—';
  const fecha = new Date(perfil.value.created_at);
  if (Number.isNaN(fecha.getTime())) return perfil.value.created_at;
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
});

onMounted(async () => {
  try {
    const { data } = await obtenerPerfil();
    perfil.value = data;
  } finally {
    cargando.value = false;
  }
});

async function funSalir() {
  saliendo.value = true;
  localStorage.removeItem('access_token');
  await router.push({ name: 'login' });
}
</script>

<style scoped>
.perfil-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 24px 32px;
  color: white;
  background-image: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary-darken-2)) 100%
  );
}

.perfil-avatar {
  border: 4px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  background-color: white;
}

.perfil-subtitulo {
  opacity: 0.85;
}
</style>
