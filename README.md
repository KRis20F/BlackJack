# 🎰 BLCKJCK

https://kris20f.github.io/BlackJack/

# 🖥️ Backend

https://github.com/alvarfs/BlackJackApi/

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

## Justificación y Motivación del Proyecto

Este proyecto de BlackJack nace de la necesidad de crear una experiencia de juego moderna y accesible que combine:

- **Diseño Retro**: Estética pixel art que evoca la nostalgia de los juegos clásicos
- **Jugabilidad Moderna**: Interfaz intuitiva y responsive con animaciones fluidas
- **Accesibilidad**: Implementación web que permite jugar desde cualquier dispositivo
- **Educación**: Ayuda a entender conceptos matemáticos de probabilidad y toma de decisiones

## Esquema de Arquitectura

El proyecto sigue una arquitectura Model-Vista-Controlador (MVC) implementada con React:

```
BlackJack/
├── src/
│   ├── components/         # Vista (Components)
│   │   ├── Game.jsx       # Vista principal del juego
│   │   ├── PlayerCards.jsx
│   │   └── DealerCards.jsx
│   ├── context/           # Modelo (Context)
│   │   └── GameContext.jsx
│   ├── controllers/       # Controlador
│   │   └── GameController.jsx
│   └── assets/           # Recursos estáticos
│       ├── Cards/
│       ├── Chips/
│       └── Actions/
```

## Explicación MVC Detallada

### Modelo (Context)
- **GameContext.jsx**: 
  - Gestiona el estado global del juego
  - Mantiene el estado de las cartas, apuestas y dinero
  - Proporciona métodos para modificar el estado
  - Implementa la lógica de persistencia de datos

### Vista (Components)
- **Game.jsx**: 
  - Renderiza la interfaz principal
  - Maneja la interacción del usuario
  - Muestra las animaciones y efectos visuales
  - Implementa el diseño responsive

- **PlayerCards.jsx & DealerCards.jsx**:
  - Componentes especializados para mostrar cartas
  - Manejan animaciones específicas
  - Implementan lógica de visualización de cartas

### Controlador
- **GameController.jsx**:
  - Implementa la lógica del juego
  - Maneja las reglas del BlackJack
  - Procesa las acciones del jugador
  - Calcula resultados y pagos
  - Gestiona el flujo del juego

## Propuestas de Mejora y Nuevas Funcionalidades

### Funcionalidad de Split (En Desarrollo) 🔄
- Permitir dividir pares de cartas iguales
- Jugar dos manos simultáneamente
- Implementar apuestas independientes por mano
- Añadir animaciones específicas para el split

### Otras Mejoras Propuestas
1. **Multijugador**
   - Implementar salas de juego
   - Sistema de chat en tiempo real
   - Ranking de jugadores

2. **Personalización**
   - Temas visuales alternativos
   - Diseños de cartas personalizables
   - Fichas personalizadas

3. **Características Avanzadas**
   - Sistema de logros
   - Estadísticas detalladas
   - Tutorial interactivo
   - Modo torneo

4. **Optimizaciones**
   - Mejora del rendimiento
   - Soporte offline
   - Adaptación a dispositivos móviles
   - Internacionalización

### Roadmap de Desarrollo
1. ✅ Implementación base del juego
2. ✅ Sistema de apuestas
3. ✅ Animaciones y efectos visuales
4. 🔄 Funcionalidad de Split
5. 📋 Sistema de logros
6. �� Modo multijugador
