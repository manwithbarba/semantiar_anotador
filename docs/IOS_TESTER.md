# SemantIAr App para iOS - rama tester

Esta rama prepara SemantIAr App para iPhone y iPad mediante Capacitor. La
interfaz, el formato de los JSON y la telemetría de anotación son los mismos
que en la versión web y Android para los lotes de anotación asistida.

## Qué incluye

- Proyecto nativo `ios/` de Capacitor con identificador
  `ar.org.semantiar.app`.
- Plugins para guardar/compartir el JSON de avance (`Filesystem` y `Share`).
- Esquema HTTPS coherente con Android para cargar recursos de la aplicación.
- Comandos de sincronización para actualizar el proyecto Xcode desde Angular.

## Preparación en macOS

Se requiere una Mac con Xcode actualizado y una cuenta de Apple Developer para
instalar en dispositivos propios, usar TestFlight o publicar en App Store.

```bash
npm ci
npm run ios:open
```

El segundo comando compila el front-end, copia los archivos al proyecto iOS y
abre `ios/App/App.xcworkspace` en Xcode. Desde allí:

1. Seleccione el destino (un simulador o un iPhone conectado).
2. En **Signing & Capabilities**, elija el equipo de desarrollo.
3. Ejecute la aplicación con el botón de reproducción de Xcode.
4. Para distribuir una versión tester, use **Product > Archive** y cargue el
   resultado a TestFlight.

## Flujo de trabajo

Después de cambios en Angular, ejecute `npm run ios:sync` antes de abrir o
compilar en Xcode. No edite los archivos generados en `ios/App/App/public`:
se reemplazan durante cada sincronización.

## Alcance

La validación de compilación, firma e instalación iOS debe realizarse en macOS;
Windows no puede generar un `.ipa` firmado. Los lotes **Core Blind** se
mantienen restringidos a la página web del investigador principal.
