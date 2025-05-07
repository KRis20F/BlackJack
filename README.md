# 🃏 Gameplay

## 🔹 Antes de empezar la ronda
- No hay cartas en juego.
- El jugador solo puede **arrastrar fichas al área de apuesta**.
- La acción **BET** se muestra solo si hay **al menos una ficha** en el recuadro.

## 🔹 Ronda 1 (inicio de la mano)
- Se reparten **2 cartas** al jugador y **2 al crupier** (una boca abajo).
- Tras el reparto, se muestran las siguientes acciones posibles:

### ✅ HIT / STAND
- **HIT:** Robas una carta adicional.
- **STAND:** Te plantas con tu puntuación actual.

### ✅ DROP
- Te retiras voluntariamente y recuperas parte de tu apuesta:
  - En la ronda inicial recuperas el **50%**.
  - Por cada carta extra robada, el valor recuperable se reduce progresivamente (ej: 25%, 12.5%, etc.).
  - No se permite hacer DROP si el valor a recuperar es **menor a 1€**.

### ✅ DOUBLE
- Doblas tu apuesta inicial.
- Recibes **una sola carta adicional**.
- Tu turno termina automáticamente.

### ✅ SPLIT
- Solo disponible si tus 2 cartas tienen el mismo valor.
- Doblas tu apuesta inicial.
- Divides tu mano en 2 manos independientes, cada una con una nueva carta.
- **Limitaciones para ases:** tras dividir A's, normalmente solo recibes **una carta por mano** y no puedes seguir pidiendo.

## 🔹 Ronda 2+
- Si no te has plantado ni has hecho **DOUBLE**:
  - Solo puedes realizar: **HIT**, **STAND** o **DROP**.

---

## ⚙️ Detalles a tener en cuenta

- 📊 Se muestran los siguientes contadores:
  - Tu **saldo actual**
  - Lo que has **apostado en mesa**
  - Tu **puntuación** actual
  - La **puntuación visible** del crupier (una carta)
  
- 💰 Pagos:
  - **Blackjack natural (A + 10/J/Q/K):** 3:2
  - **Victoria normal:** 1:1
  - **Empate:** Recuperas el dinero apostado
  - **Derrota** Pierdes el dinero apostado

- 💸 Requisitos de saldo:
  - No puedes usar **DOUBLE** ni **SPLIT** si no tienes suficiente saldo para doblar tu apuesta inicial.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
