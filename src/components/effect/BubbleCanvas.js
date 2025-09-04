import React, { useEffect, useRef } from 'react';

const BubbleCanvas = () => {
    const canvasRef = useRef(null);
    const bubbles = useRef([]);

    const createBubble = () => {
        const radius = Math.random() * 20 + 10; // 随机半径
        const x = Math.random() * canvasRef.current.width;
        const y = canvasRef.current.height + radius; // 从底部生成
        const speed = Math.random() * 2 + 1; // 随机速度
        bubbles.current.push({ x, y, radius, speed });
    };

    const drawBubbles = (ctx) => {
        if(!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        for (const bubble of bubbles.current) {
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // 半透明气泡颜色
            ctx.fill();
            ctx.closePath();
            bubble.y -= bubble.speed; // 气泡上升
        }
        // 移除超出画布的气泡
        bubbles.current = bubbles.current.filter(bubble => bubble.y + bubble.radius > 0);
    };

    const animate = () => {
        const ctx = canvasRef.current.getContext('2d');
        drawBubbles(ctx);
        requestAnimationFrame(animate);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const intervalId = setInterval(createBubble, 300); // 每300毫秒生成一个气泡
        animate();

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ display: 'block', background: '#87CEEB' }} />;
};

export default BubbleCanvas;