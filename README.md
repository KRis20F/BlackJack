# 🎰 Juego de BlackJack

## 📝 Descripción
Una implementación moderna del clásico juego de casino BlackJack construida con React. Esta aplicación web presenta una interfaz con estilo pixel art, animaciones fluidas y jugabilidad en tiempo real.

## ✨ Características
- 🎮 Mecánicas completas de BlackJack
- 💰 Sistema de apuestas con fichas
- 🎲 Múltiples acciones (Pedir, Plantarse, Doblar, Dividir, Retirarse)
- 💾 Estado del juego persistente con localStorage
- 🔐 Sistema de autenticación de usuarios
- 💫 Animaciones y transiciones suaves
- 🎨 Interfaz estilo pixel art

## 🏗️ Estructura del Juego

### 📦 Componentes

#### `Game.jsx`
El componente principal del juego que maneja:
- Gestión del estado del juego
- Mecánicas de apuestas
- Visualización y animación de cartas
- Acciones del jugador (Pedir, Plantarse, Doblar, Dividir, Retirarse)
- Cálculo de puntuación y condiciones de victoria

#### `GameController.jsx`
Gestiona la lógica central del juego:
- Gestión del mazo de cartas
- Control de fases del juego (apuestas, juego, finalizado)
- Cálculos de valor de manos
- Comportamiento de la IA del crupier
- Verificación de condiciones de victoria

#### `PlayerCards.jsx` y `DealerCards.jsx`
Manejan la renderización y animación de cartas para:
- Mano(s) del jugador
- Mano del crupier
- Manos divididas cuando corresponda

### 🎮 Mecánicas de Juego

#### Sistema de Apuestas
- Múltiples denominaciones de fichas (1, 5, 20, 50, 100)
- Interfaz de apuestas basada en pilas
- Máximo 5 fichas por denominación
- Retroalimentación visual para pilas máximas

#### Acciones del Jugador
1. **Pedir (Hit)**
   - Solicitar carta adicional
   - Disponible durante fase de juego
   - Deshabilitado después de Doblar

2. **Plantarse (Stand)**
   - Finalizar turno del jugador
   - Activa el juego del crupier
   - Disponible durante fase de juego

3. **Doblar (Double Down)**
   - Doblar la apuesta actual
   - Recibir exactamente una carta más
   - Disponible solo en mano inicial
   - Requiere fondos suficientes

4. **Dividir (Split)**
   - Dividir pares en dos manos
   - Disponible cuando las cartas iniciales tienen el mismo valor
   - Requiere igualar la apuesta original

5. **Retirarse (Drop)**
   - Rendirse en la mano actual
   - Recuperar 50% de la apuesta
   - Disponible durante fase de juego

### 🔄 Fases del Juego
1. **Fase de Apuestas**
   - Colocar fichas
   - Modificar cantidad apostada
   - Iniciar ronda

2. **Fase de Juego**
   - Tomar decisiones
   - Jugar mano(s)
   - Usar acciones disponibles

3. **Fase Final**
   - Mostrar carta oculta del crupier
   - Calcular puntuaciones finales
   - Determinar ganador
   - Mostrar mensaje de resultado
   - Actualizar fondos del jugador

### 📊 Gestión de Estado
- Dinero del jugador persistente en localStorage
- Seguimiento de fase de juego
- Seguimiento de cantidad apostada
- Gestión de manos de cartas
- Manejo de manos divididas
- Estado de apuesta doble

### 🎨 Elementos Visuales
- Diseños de cartas en pixel art
- Botones de acción animados
- Visualización de pilas de fichas
- Animaciones de victoria/derrota
- Efectos de transición de fase

## 🔧 Implementación Técnica

### Sistema de Cartas
- Mazo estándar de 52 cartas
- Valores: A(1/11), 2-10, J(10), Q(10), K(10)
- Sistema de palos: Corazones, Diamantes, Tréboles, Picas
- Optimización automática del valor del As (1 u 11)

### Lógica de Puntuación
- Blackjack (As + carta de valor 10)
- Pasarse (Más de 21)
- Empate (Push)
- Condiciones de victoria:
  - Blackjack del jugador
  - Crupier se pasa
  - Jugador mayor valor que crupier
  - Empate (valores iguales)

### Interfaz de Usuario
- Diseño responsivo
- Controles táctiles
- Retroalimentación visual clara
- Colocación intuitiva de fichas
- Valores de cartas fáciles de leer
- Botones de acción prominentes

### Sistema de Autenticación
- Registro/inicio de sesión de usuario
- Gestión de sesiones
- Persistencia de fondos
- Guardado de estado de juego

## 🚀 Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/yourusername/blackjack.git
```

2. Instalar dependencias:
```bash
cd blackjack
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm start
```

4. Construir para producción:
```bash
npm run build
```

## 📚 Dependencias
- React
- React Router DOM
- Tailwind CSS
- Otras dependencias listadas en package.json

## 🤝 Contribuir
Se aceptan issues y solicitudes de mejoras.

## 📄 Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para detalles.

# 🖥️ Backend

https://github.com/alvarfs/BlackJackApi/

# 🎲 Reglas del Juego

## 🔹 Antes de empezar la ronda
- No hay cartas en juego.
- El jugador solo puede **arrastrar fichas al área de apuesta**.
- La acción **BET** se muestra solo si hay **al menos una ficha** en el recuadro.

## 🔹 Ronda 1 (inicio de la mano)
- Se reparten **2 cartas** al jugador y **2 al crupier** (una boca abajo).
- Tras el reparto, se muestran las siguientes acciones posibles:

### ✅ PEDIR / PLANTARSE
- **PEDIR:** Robas una carta adicional.
- **PLANTARSE:** Te plantas con tu puntuación actual.

### ✅ RETIRARSE
- Te retiras voluntariamente y recuperas parte de tu apuesta:
  - En la ronda inicial recuperas el **50%**.
  - Por cada carta extra robada, el valor recuperable se reduce progresivamente (ej: 25%, 12.5%, etc.).
  - No se permite retirarse si el valor a recuperar es **menor a 1€**.

### ✅ DOBLAR
- Doblas tu apuesta inicial.
- Recibes **una sola carta adicional**.
- Tu turno termina automáticamente.

### ✅ DIVIDIR
- Solo disponible si tus 2 cartas tienen el mismo valor.
- Doblas tu apuesta inicial.
- Divides tu mano en 2 manos independientes, cada una con una nueva carta.
- **Limitaciones para ases:** tras dividir A's, normalmente solo recibes **una carta por mano**.

## 🔹 Ronda 2+
- Si no te has plantado ni has doblado:
  - Solo puedes realizar: **PEDIR**, **PLANTARSE** o **RETIRARSE**.

---

## ⚙️ Detalles Importantes

- 📊 Información visible:
  - Tu **saldo actual**
  - **Apuesta en mesa**
  - Tu **puntuación** actual
  - **Puntuación visible** del crupier
  
- 💰 Pagos:
  - **Blackjack natural (A + 10/J/Q/K):** 3:2
  - **Victoria normal:** 1:1
  - **Empate:** Recuperas la apuesta
  - **Derrota:** Pierdes la apuesta

- 💸 Requisitos de saldo:
  - No puedes usar **DOBLAR** ni **DIVIDIR** si no tienes suficiente saldo para doblar tu apuesta inicial.
