import { useState, useEffect } from 'react';

export function useDraggableChip() {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleDragStart = (e) => {
        setIsDragging(true);
        // Guarda la posición inicial del cursor relativa al elemento
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer.setData('text/plain', JSON.stringify({ offsetX, offsetY }));
        
        // Crea una imagen fantasma personalizada para el arrastre
        const dragImage = e.target.cloneNode(true);
        dragImage.style.opacity = '0.5';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    const handleDrag = (e) => {
        if (!e.clientX) return; // Ignora eventos inválidos
        setPosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
        // Verifica si la ficha se soltó en el área de apuestas
        const betArea = document.querySelector('.bet-area');
        if (betArea) {
            const betAreaRect = betArea.getBoundingClientRect();
            if (
                e.clientX >= betAreaRect.left &&
                e.clientX <= betAreaRect.right &&
                e.clientY >= betAreaRect.top &&
                e.clientY <= betAreaRect.bottom
            ) {
                // La ficha se soltó en el área de apuestas
                console.log('Chip dropped in bet area!');
            }
        }
    };

    return {
        isDragging,
        position,
        handlers: {
            onDragStart: handleDragStart,
            onDrag: handleDrag,
            onDragEnd: handleDragEnd
        }
    };
} 