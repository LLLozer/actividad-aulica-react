# Implementation Plan: Random Anime

**Branch**: `001-random-anime` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

## Summary

Prototipo móvil que recomienda un anime al azar dentro de cuatro géneros (Isekai,
Mecha, Slice of Life, Spokon), permite explorar el catálogo, ver el detalle de cada
título y mantener una lista personal de pendientes con altas manuales validadas y bajas
con confirmación.

**Enfoque técnico:** aplicación Expo con navegación por archivos (`expo-router`) y
**sin backend**. Los datos reales de anime se obtienen una única vez mediante un script
de Node que consume la API pública de Jikan y genera un JSON semilla commiteado al
repositorio. En runtime, una capa de servicios simulada sirve esos datos con latencia
artificial de 500 a 1000 ms, con la misma forma que tendría un cliente HTTP real.

## Technical Context

**Language/Version**: TypeScript 5.x sobre React Native 0.81 / React 19.1 / Expo SDK 54-56

**Primary Dependencies**: `expo-router`, `@react-native-async-storage/async-storage`, `@expo/vector-icons`

**Storage**: AsyncStorage, solo para "Mi Lista". Catálogo en JSON estático dentro del bundle.

## Project Structure

```text
app/                              # rutas (expo-router)
├── _layout.tsx                   # Stack raíz
├── (tabs)/
│   ├── _layout.tsx               # Tabs: Descubrir | Catálogo | Mi Lista
│   ├── index.tsx                 # P1 Descubrir
│   ├── catalogo.tsx              # P2 Catálogo
│   └── mi-lista.tsx              # P4 Mi Lista
├── anime/
│   └── [id].tsx                  # P3 Detalle
└── mi-lista/
    └── nuevo.tsx                 # P5 Formulario

components/
├── TarjetaAnime.tsx
├── ItemLista.tsx
├── SelectorGenero.tsx
├── EstadoCargando.tsx
├── EstadoVacio.tsx
├── EstadoError.tsx
├── CampoTexto.tsx
└── Boton.tsx

services/
├── simulacion.ts                 # demorar() + flags SIMULAR_VACIO / SIMULAR_ERROR
├── animeService.ts               # listarPorGenero, obtenerPorId, sortearPorGenero
├── miListaService.ts             # listar, agregar, eliminar, existeTitulo
└── data/
    └── animes.json               # dataset semilla, generado una vez

models/
├── Anime.ts
├── ItemDeMiLista.ts
└── Genero.ts

constants/
├── colores.ts
├── tipografia.ts
├── espaciado.ts
└── generos.ts

utils/
└── validarItem.ts                # validación pura del formulario
```
