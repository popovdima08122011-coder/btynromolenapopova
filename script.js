// ========== 1. 3D ФОН ==========
function init3DBackground() {
    const container = document.getElementById('bg3dSlider');
    if (!container) return;
    container.innerHTML = '';

    // СВОИ ФОТКИ ДЛЯ 3D ФОНА ДОБАВЛЯЙ СЮДА
    const photos = [
        "IMG_3877.PNG",
        "IMG_1826.PNG",
        "IMG_3878.PNG",
        "IMG_3879.PNG",
        "IMG_3880.PNG",
        "IMG_3882.PNG",
        "IMG_1267.PNG",
        "IMG_1269.PNG"
    ];

    const radius = 580;
    const count = photos.length;

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.backgroundImage = `url('${photos[i]}')`;
        slide.style.transform = `translate3d(${x}px, ${Math.sin(angle * 2) * 50}px, ${z}px) rotateY(${angle}rad)`;
        slide.style.left = `calc(50% - 120px)`;
        slide.style.top = `calc(50% - 80px)`;
        container.appendChild(slide);
    }
}

// ========== 2. КЛИК ПО КАРТОЧКЕ ==========
const overlay = document.getElementById('expandedOverlay');
const expandedCard = document.getElementById('expandedCardContent');

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const bgImage = window.getComputedStyle(card).backgroundImage;
        expandedCard.style.backgroundImage = bgImage;
        overlay.classList.add('active');
    });
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
    }
});

const closeBtn = document.createElement('button');
closeBtn.innerHTML = '✕';
closeBtn.className = 'close-btn';
closeBtn.onclick = () => overlay.classList.remove('active');
overlay.appendChild(closeBtn);

init3DBackground();
// ========== 3. ПРЕСЛЕДОВАТЕЛЬ (ХВОСТ ЗА КУРСОРОМ) ==========
(function initTrailingCursor() {
    // Настройки
    const TRAIL_COUNT = 12;      // Количество элементов в хвосте
    const SPACING = 18;          // Расстояние между элементами
    const SIZE = 24;             // Размер каждого элемента (px)

    // ВРЕМЕННАЯ КАРТИНКА (круг с эффектом). ПОТОМ ЗАМЕНИШЬ НА СВОЮ!
    // Чтобы заменить на свою картинку, раскомментируй строку с backgroundImage
    // и закомментируй строки backgroundColor + border + borderRadius

    let elements = [];

    // Создаём хвост
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'trail-element';
        el.style.position = 'fixed';
        el.style.width = {SIZE};
        el.style.height = {SIZE};
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.transition = 'opacity 0.2s';

        // --- ВРЕМЕННЫЙ СТИЛЬ (красивый блестящий круг) ---
        // ↓↓↓ ЗАМЕНИ ЭТО НА СВОЮ КАРТИНКУ ↓↓↓
        el.style.backgroundColor = '#d4a373';
        el.style.borderRadius = '50%';
        el.style.border = '1px solid rgba(255,255,255,0.8)';
        el.style.boxShadow = '0 0 8px rgba(212,163,115,0.6)';
        // ↑↑↑ ВРЕМЕННЫЙ СТИЛЬ ↑↑↑

        /*
        // --- КОГДА БУДЕТ ТВОЯ КАРТИНКА - РАСКОММЕНТИРУЙ ЭТО:
        el.style.backgroundColor = 'transparent';
        el.style.borderRadius = '0';
        el.style.border = 'none';
        el.style.boxShadow = 'none';
        el.style.backgroundImage = "url('твоя_картинка.png')";
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        */

        document.body.appendChild(el);
        elements.push({
            dom: el,
            x: 0,
            y: 0
        });
    }

    // Текущая позиция мыши
    let mouseX = 0, mouseY = 0;
    let positions = []; // массив позиций для хвоста

    // Заполняем начальными позициями
    for (let i = 0; i < TRAIL_COUNT; i++) {
        positions.push({ x: mouseX, y: mouseY });
    }

    // Отслеживаем движение мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Прячем хвост, когда мышь уходит с окна
    document.addEventListener('mouseleave', () => {
        elements.forEach(el => {
            el.dom.style.opacity = '0';
        });
    });

    document.addEventListener('mouseenter', () => {
        elements.forEach(el => {
            el.dom.style.opacity = '1';
        });
    });

    // Анимация хвоста (как змейка)
    function animateTrail() {
        // Добавляем текущую позицию мыши в начало массива
        positions.unshift({ x: mouseX, y: mouseY });
        // Удаляем последнюю
        positions.pop();

        // Обновляем позиции каждого элемента
        for (let i = 0; i < elements.length; i++) {
            // Берём позицию из массива с отступом
            const idx = Math.min(i * 1.2, positions.length - 1);
            const pos = positions[Math.floor(idx)];

            if (pos) {
                // Плавное движение
                elements[i].x += (pos.x - elements[i].x) * 0.35;
                elements[i].y += (pos.y - elements[i].y) * 0.35;

                elements[i].dom.style.left = elements[i].x + 'px';
                elements[i].dom.style.top = elements[i].y + 'px';

                // Эффект затухания для дальних элементов
                const opacity = 1 - (i / elements.length) * 0.5;
                elements[i].dom.style.opacity = opacity;
            }
        }

        requestAnimationFrame(animateTrail);
    }

    // Заполняем начальные позиции
    for (let i = 0; i < 30; i++) {
        positions.push({ x: mouseX, y: mouseY });
    }

    animateTrail();
})();
// ========== 3. ПРЕСЛЕДОВАТЕЛЬ (ХВОСТ ЗА КУРСОРОМ) ==========
(function initTrailingCursor() {
    // Настройки
    const TRAIL_COUNT = 12;      // Количество элементов в хвосте
    const SIZE = 24;             // Размер каждого элемента (px)

    let elements = [];

    // Создаём хвост
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'trail-element';
        el.style.position = 'fixed';
        el.style.width = SIZE + 'px';
        el.style.height = SIZE + 'px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.transition = 'opacity 0.2s';

        // ВРЕМЕННЫЙ СТИЛЬ (красивый блестящий круг)
        el.style.backgroundColor = '#d4a373';
        el.style.borderRadius = '50%';
        el.style.border = '1px solid rgba(255,255,255,0.8)';
        el.style.boxShadow = '0 0 8px rgba(212,163,115,0.6)';

        /*
        // КОГДА БУДЕТ ТВОЯ КАРТИНКА - РАСКОММЕНТИРУЙ ЭТОТ БЛОК:
        el.style.backgroundColor = 'transparent';
        el.style.borderRadius = '0';
        el.style.border = 'none';
        el.style.boxShadow = 'none';
        el.style.backgroundImage = "url('твоя_картинка.png')";
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        */

        document.body.appendChild(el);
        elements.push({
            dom: el,
            x: 0,
            y: 0
        });
    }

    // Текущая позиция мыши
    let mouseX = 0, mouseY = 0;
    let positions = [];

    // Заполняем начальными позициями
    for (let i = 0; i < TRAIL_COUNT + 5; i++) {
        positions.push({ x: mouseX, y: mouseY });
    }

    // Отслеживаем движение мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Прячем хвост, когда мышь уходит с окна
    document.addEventListener('mouseleave', () => {
        elements.forEach(el => {
            el.dom.style.opacity = '0';
        });
    });

    document.addEventListener('mouseenter', () => {
        elements.forEach(el => {
            el.dom.style.opacity = '1';
        });
    });

    // Анимация хвоста
    function animateTrail() {
        // Добавляем текущую позицию мыши в начало массива
        positions.unshift({ x: mouseX, y: mouseY });
        // Удаляем последнюю
        positions.pop();

        // Обновляем позиции каждого элемента
        for (let i = 0; i < elements.length; i++) {
            const idx = Math.min(Math.floor(i * 1.5), positions.length - 1);
            const pos = positions[idx];

            if (pos) {
                elements[i].x += (pos.x - elements[i].x) * 0.35;
                elements[i].y += (pos.y - elements[i].y) * 0.35;

                elements[i].dom.style.left = elements[i].x + 'px';
                elements[i].dom.style.top = elements[i].y + 'px';

                // Эффект затухания
                const opacity = 1 - (i / elements.length) * 0.5;
                elements[i].dom.style.opacity = opacity;
            }
        }

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
})();
// ========== 3. ПРЕСЛЕДОВАТЕЛЬ (ХВОСТ ЗА КУРСОРОМ) ==========
(function initTrailingCursor() {
    // Настройки
    const TRAIL_COUNT = 12;
    const SIZE = 24;

    let elements = [];

    // Создаём хвост
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'trail-element';
        el.style.position = 'fixed';
        el.style.width = SIZE + 'px';
        el.style.height = SIZE + 'px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.transition = 'opacity 0.2s';

        // Временный стиль (круг)
        el.style.backgroundColor = '#d4a373';
        el.style.borderRadius = '50%';
        el.style.border = '1px solid rgba(255,255,255,0.8)';
        el.style.boxShadow = '0 0 8px rgba(212,163,115,0.6)';

        document.body.appendChild(el);
        elements.push({
            dom: el,
            x: 0,
            y: 0
        });
    }

    let mouseX = 0, mouseY = 0;
    let positions = [];

    for (let i = 0; i < TRAIL_COUNT + 5; i++) {
        positions.push({ x: mouseX, y: mouseY });
    }

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', function() {
        for (var i = 0; i < elements.length; i++) {
            elements[i].dom.style.opacity = '0';
        }
    });

    document.addEventListener('mouseenter', function() {
        for (var i = 0; i < elements.length; i++) {
            elements[i].dom.style.opacity = '1';
        }
    });

    function animateTrail() {
        positions.unshift({ x: mouseX, y: mouseY });
        positions.pop();

        for (var i = 0; i < elements.length; i++) {
            var idx = Math.min(Math.floor(i * 1.5), positions.length - 1);
            var pos = positions[idx];

            if (pos) {
                elements[i].x += (pos.x - elements[i].x) * 0.35;
                elements[i].y += (pos.y - elements[i].y) * 0.35;

                elements[i].dom.style.left = elements[i].x + 'px';
                elements[i].dom.style.top = elements[i].y + 'px';

                var opacity = 1 - (i / elements.length) * 0.5;
                elements[i].dom.style.opacity = opacity;
            }
        }

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
})();// ========== 3. ХВОСТ ЗА КУРСОРОМ ==========
(function() {
    var TRAIL_COUNT = 12;
    var SIZE = 24;
    var elements = [];
    var mouseX = 0, mouseY = 0;
    var positions = [];

    // Создаём элементы хвоста
    for (var i = 0; i < TRAIL_COUNT; i++) {
        var el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.width = SIZE + 'px';
        el.style.height = SIZE + 'px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.backgroundColor = '#d4a373';
        el.style.borderRadius = '50%';
        el.style.border = '1px solid rgba(255,255,255,0.8)';
        el.style.boxShadow = '0 0 8px rgba(212,163,115,0.6)';
        document.body.appendChild(el);
        elements.push(el);
    }

    // Заполняем начальные позиции
    for (var i = 0; i < TRAIL_COUNT + 10; i++) {
        positions.push({ x: mouseX, y: mouseY });
    }

    // Следим за мышью
    document.onmousemove = function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    // Когда мышь уходит с окна
    document.onmouseleave = function() {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '0';
        }
    };

    // Когда мышь возвращается
    document.onmouseenter = function() {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '1';
        }
    };

    // Анимация
    var positionsX = [];
    var positionsY = [];

    for (var i = 0; i < TRAIL_COUNT + 10; i++) {
        positionsX.push(0);
        positionsY.push(0);
    }

    function animate() {
        // Добавляем текущую позицию мыши
        positionsX.unshift(mouseX);
        positionsY.unshift(mouseY);
        positionsX.pop();
        positionsY.pop();

        // Обновляем каждый элемент
        for (var i = 0; i < elements.length; i++) {
            var idx = i * 2;
            if (idx >= positionsX.length) idx = positionsX.length - 1;

            var targetX = positionsX[idx];
            var targetY = positionsY[idx];

            var currentX = parseFloat(elements[i].style.left) || 0;
            var currentY = parseFloat(elements[i].style.top) || 0;

            var newX = currentX + (targetX - currentX) * 0.3;
            var newY = currentY + (targetY - currentY) * 0.3;

            elements[i].style.left = newX + 'px';
            elements[i].style.top = newY + 'px';

            elements[i].style.opacity = 1 - (i / elements.length) * 0.6;
        }

        requestAnimationFrame(animate);
    }

    animate();
})();// ========== 3. ХВОСТ ЗА КУРСОРОМ (ПОЛНОСТЬЮ ИСПРАВЛЕННЫЙ) ==========

const TRAIL_COUNT = 12;
const SIZE = 24;

let elements = [];

// Создаём хвост
for (let i = 0; i < TRAIL_COUNT; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.width = SIZE + 'px';
    el.style.height = SIZE + 'px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.backgroundColor = '#d4a373';
    el.style.borderRadius = '50%';
    el.style.border = '1px solid rgba(255, 255, 255, 0.8)';
    el.style.boxShadow = '0 0 8px rgba(212, 163, 115, 0.6)';
    document.body.appendChild(el);
    elements.push(el);
}

let mouseX = 0, mouseY = 0;
let posX = [];
let posY = [];

// Заполняем массив позиций
for (let i = 0; i < TRAIL_COUNT + 10; i++) {
    posX.push(0);
    posY.push(0);
}

// Следим за мышью
document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Прячем хвост, когда мышь уходит
document.addEventListener('mouseleave', function() {
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = '0';
    }
});

// Показываем хвост, когда мышь возвращается
document.addEventListener('mouseenter', function() {
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = '1';
    }
});

// Анимация
function animateTrail() {
    // Добавляем текущую позицию мыши
    posX.unshift(mouseX);
    posY.unshift(mouseY);
    posX.pop();
    posY.pop();

    // Обновляем каждый элемент хвоста
    for (let i = 0; i < elements.length; i++) {
        let idx = i * 2;
        if (idx >= posX.length) idx = posX.length - 1;

        let targetX = posX[idx];
        let targetY = posY[idx];

        let currentX = parseFloat(elements[i].style.left) || 0;
        let currentY = parseFloat(elements[i].style.top) || 0;

        let newX = currentX + (targetX - currentX) * 0.3;
        let newY = currentY + (targetY - currentY) * 0.3;

        elements[i].style.left = newX + 'px';
        elements[i].style.top = newY + 'px';

        // Затухание хвоста
        let opacity = 1 - (i / elements.length) * 0.6;
        elements[i].style.opacity = opacity;
    }

    requestAnimationFrame(animateTrail);
}

animateTrail();// ========== ХВОСТ ЗА КУРСОРОМ ==========
(function() {
    var TRAIL_COUNT = 12;
    var SIZE = 24;
    var elements = [];
    var mouseX = 0, mouseY = 0;
    var posX = [], posY = [];

    for (var i = 0; i < TRAIL_COUNT; i++) {
        var el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.width = SIZE + 'px';
        el.style.height = SIZE + 'px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.backgroundColor = '#d4a373';
        el.style.borderRadius = '50%';
        el.style.border = '1px solid rgba(255,255,255,0.8)';
        el.style.boxShadow = '0 0 8px rgba(212,163,115,0.6)';
        document.body.appendChild(el);
        elements.push(el);
    }

    for (var i = 0; i < TRAIL_COUNT + 10; i++) {
        posX.push(0);
        posY.push(0);
    }

    document.onmousemove = function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    document.onmouseleave = function() {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '0';
        }
    };

    document.onmouseenter = function() {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '1';
        }
    };

    function animate() {
        posX.unshift(mouseX);
        posY.unshift(mouseY);
        posX.pop();
        posY.pop();

        for (var i = 0; i < elements.length; i++) {
            var idx = i * 2;
            if (idx >= posX.length) idx = posX.length - 1;

            var currentX = parseFloat(elements[i].style.left) || 0;
            var currentY = parseFloat(elements[i].style.top) || 0;

            elements[i].style.left = (currentX + (posX[idx] - currentX) * 0.3) + 'px';
            elements[i].style.top = (currentY + (posY[idx] - currentY) * 0.3) + 'px';
            elements[i].style.opacity = 1 - (i / elements.length) * 0.6;
        }

        requestAnimationFrame(animate);
    }

    animate();
})();// ========== ЛЕТЯЩИЕ БРОВКИ ЗА КУРСОРОМ ==========
(function() {
    // Настройки
    const COUNT = 10;        // Количество бровок в хвосте
    const SIZE = 28;         // Размер каждой бровки

    let elements = [];
    let mouseX = 0, mouseY = 0;
    let posX = [];
    let posY = [];

    // Создаём SVG-бровку (красивую дугу)
    function createEyebrow() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", SIZE);
        svg.setAttribute("height", SIZE / 2);
        svg.setAttribute("viewBox", "0 0 60 30");

        // Рисуем бровь (дуга)
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 5 15 Q 30 0 55 15");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#d4a373");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke-linecap", "round");

        // Добавляем маленькие волосинки
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", "15");
        line1.setAttribute("y1", "8");
        line1.setAttribute("x2", "12");
        line1.setAttribute("y2", "3");
        line1.setAttribute("stroke", "#b5835a");
        line1.setAttribute("stroke-width", "1.5");
        line1.setAttribute("stroke-linecap", "round");

        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", "30");
        line2.setAttribute("y1", "4");
        line2.setAttribute("x2", "30");
        line2.setAttribute("y2", "-2");
        line2.setAttribute("stroke", "#b5835a");
        line2.setAttribute("stroke-width", "1.5");
        line2.setAttribute("stroke-linecap", "round");

        const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line3.setAttribute("x1", "45");
        line3.setAttribute("y1", "8");
        line3.setAttribute("x2", "48");
        line3.setAttribute("y2", "3");
        line3.setAttribute("stroke", "#b5835a");
        line3.setAttribute("stroke-width", "1.5");
        line3.setAttribute("stroke-linecap", "round");

        svg.appendChild(path);
        svg.appendChild(line1);
        svg.appendChild(line2);
        svg.appendChild(line3);

        return svg;
    }

    // Создаём хвост из бровок
    for (let i = 0; i < COUNT; i++) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.width = SIZE + 'px';
        el.style.height = (SIZE / 2) + 'px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.left = '0px';
        el.style.top = '0px';

        const brow = createEyebrow();
        el.appendChild(brow);

        document.body.appendChild(el);
        elements.push(el);
    }

    // Заполняем массивы позиций
    for (let i = 0; i < COUNT + 10; i++) {
        posX.push(0);
        posY.push(0);
    }

    // Следим за мышью
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Прячем хвост
    document.addEventListener('mouseleave', function() {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '0';
        }
    });

    document.addEventListener('mouseenter', function() {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '1';
        }
    });

    // Анимация
    function animate() {
        posX.unshift(mouseX);
        posY.unshift(mouseY);
        posX.pop();
        posY.pop();

        for (let i = 0; i < elements.length; i++) {
            let idx = i * 1.5;
            if (idx >= posX.length) idx = posX.length - 1;

            let currentX = parseFloat(elements[i].style.left) || 0;
            let currentY = parseFloat(elements[i].style.top) || 0;

            let newX = currentX + (posX[Math.floor(idx)] - currentX) * 0.25;
            let newY = currentY + (posY[Math.floor(idx)] - currentY) * 0.25;

            elements[i].style.left = newX + 'px';
            elements[i].style.top = newY + 'px';

            // Поворот бровки в зависимости от направления движения
            if (i > 0 && posX[0] && posX[1]) {
                let angle = Math.atan2(posY[0] - posY[1], posX[0] - posX[1]) * 180 / Math.PI;
                angle = Math.min(30, Math.max(-30, angle));
                elements[i].style.transform = 'rotate(' + angle + 'deg)';
            }

            // Затухание хвоста
            let opacity = 1 - (i / elements.length) * 0.5;
            elements[i].style.opacity = opacity;
        }

        requestAnimationFrame(animate);
    }

    animate();
})();// ========== ЛЕТЯЩИЕ БРОВКИ ЗА КУРСОРОМ ==========
(function() {
    // Настройки
    const COUNT = 10;        // Количество бровок в хвосте
    const SIZE = 28;         // Размер каждой бровки

    let elements = [];
    let mouseX = 0, mouseY = 0;
    let posX = [];
    let posY = [];

    // Создаём SVG-бровку (красивую дугу)
    function createEyebrow() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", SIZE);
        svg.setAttribute("height", SIZE / 2);
        svg.setAttribute("viewBox", "0 0 60 30");

        // Рисуем бровь (дуга)
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 5 15 Q 30 0 55 15");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#d4a373");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke-linecap", "round");

        // Добавляем маленькие волосинки
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", "15");
        line1.setAttribute("y1", "8");
        line1.setAttribute("x2", "12");
        line1.setAttribute("y2", "3");
        line1.setAttribute("stroke", "#b5835a");
        line1.setAttribute("stroke-width", "1.5");
        line1.setAttribute("stroke-linecap", "round");

        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", "30");
        line2.setAttribute("y1", "4");
        line2.setAttribute("x2", "30");
        line2.setAttribute("y2", "-2");
        line2.setAttribute("stroke", "#b5835a");
        line2.setAttribute("stroke-width", "1.5");
        line2.setAttribute("stroke-linecap", "round");

        const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line3.setAttribute("x1", "45");
        line3.setAttribute("y1", "8");
        line3.setAttribute("x2", "48");
        line3.setAttribute("y2", "3");
        line3.setAttribute("stroke", "#b5835a");
        line3.setAttribute("stroke-width", "1.5");
        line3.setAttribute("stroke-linecap", "round");

        svg.appendChild(path);
        svg.appendChild(line1);
        svg.appendChild(line2);
        svg.appendChild(line3);

        return svg;
    }

    // Создаём хвост из бровок
    for (let i = 0; i < COUNT; i++) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.width = SIZE + 'px';
        el.style.height = (SIZE / 2) + 'px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.left = '0px';
        el.style.top = '0px';

        const brow = createEyebrow();
        el.appendChild(brow);

        document.body.appendChild(el);
        elements.push(el);
    }

    // Заполняем массивы позиций
    for (let i = 0; i < COUNT + 10; i++) {
        posX.push(0);
        posY.push(0);
    }

    // Следим за мышью
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Прячем хвост
    document.addEventListener('mouseleave', function() {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '0';
        }
    });

    document.addEventListener('mouseenter', function() {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '1';
        }
    });

    // Анимация
    function animate() {
        posX.unshift(mouseX);
        posY.unshift(mouseY);
        posX.pop();
        posY.pop();

        for (let i = 0; i < elements.length; i++) {
            let idx = i * 1.5;
            if (idx >= posX.length) idx = posX.length - 1;

            let currentX = parseFloat(elements[i].style.left) || 0;
            let currentY = parseFloat(elements[i].style.top) || 0;

            let newX = currentX + (posX[Math.floor(idx)] - currentX) * 0.25;
            let newY = currentY + (posY[Math.floor(idx)] - currentY) * 0.25;

            elements[i].style.left = newX + 'px';
            elements[i].style.top = newY + 'px';

            // Поворот бровки в зависимости от направления движения
            if (i > 0 && posX[0] && posX[1]) {
                let angle = Math.atan2(posY[0] - posY[1], posX[0] - posX[1]) * 180 / Math.PI;
                angle = Math.min(30, Math.max(-30, angle));
                elements[i].style.transform = 'rotate(' + angle + 'deg)';
            }

            // Затухание хвоста
            let opacity = 1 - (i / elements.length) * 0.5;
            elements[i].style.opacity = opacity;
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
// ========== ПРЕЛОАДЕР: ВХОД ПО СКРОЛЛУ ВНИЗ (БОЛЬШОЕ ПРИБЛИЖЕНИЕ) ==========
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderImg = document.getElementById('preloader-img');
    if (!preloader) return;

    let opened = false;
    let currentScale = 1;
    let animationId = null;

    function openSite() {
        if (opened) return;
        opened = true;

        // Плавно скрываем прелоадер
        preloader.classList.add('hide');

        // Удаляем из DOM после анимации
        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.remove();
            }
        }, 1500);
    }

    function updateZoom(targetScale) {
        if (opened) return;

        currentScale = targetScale;
        if (preloaderImg) {
            preloaderImg.style.transform = `scale(${currentScale})`;
            preloaderImg.style.transition = 'transform 0.15s ease-out';
        }

        // Когда приближение достигло максимума (1.8) — открываем сайт
        if (currentScale >= 1.8) {
            openSite();
        }
    }

    // ОТСЛЕЖИВАЕМ СКРОЛЛ (ЧЕМ БОЛЬШЕ КРУТИШЬ — ТЕМ БОЛЬШЕ ПРИБЛИЖЕНИЕ)
    let scrollAccumulator = 0;

    window.addEventListener('wheel', function(e) {
        if (opened) return;

        // Только скролл ВНИЗ
        if (e.deltaY > 0) {
            e.preventDefault();

            // Накопление скролла для плавного приближения
            scrollAccumulator += e.deltaY;

            // Чем больше скролл — тем сильнее приближение
            // Максимум 1.8, минимум 1.0
            let targetScale = Math.min(1.8, 1 + scrollAccumulator / 400);

            updateZoom(targetScale);
        }
    }, { passive: false });

    // Запасной вариант: через 10 секунд открывается автоматически
    setTimeout(() => {
        if (!opened) {
            openSite();
        }
    }, 10000);
})();
// ========== ГЛОБУС (CSS-версия, без конфликтов) ==========
(function initSimpleGlobe() {
    setTimeout(function() {
        const container = document.getElementById('realGlobe');
        if (!container) return;

        // Создаём HTML-глобус
        container.innerHTML = `
            <div class="css-globe">
                <div class="globe-surface"></div>
                <div class="globe-clouds"></div>
            </div>
        `;

        container.style.cursor = 'pointer';
        container.addEventListener('click', function() {
            window.open('https://www.google.com/maps?q=59.9139,10.7522', '_blank');
        });

        // Анимация вращения через CSS
        const style = document.createElement('style');
        style.textContent = `
            .css-globe {
                width: 100%;
                height: 100%;
                position: relative;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 20px 35px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.2);
                animation: rotateGlobeCss 12s infinite linear;
                background: url('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
                background-size: cover;
                background-position: center;
            }
            
            .globe-surface {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 70%);
                pointer-events: none;
            }
            
            .globe-clouds {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: url('https://threejs.org/examples/textures/planets/earth_clouds_1024.png');
                background-size: cover;
                animation: rotateClouds 20s infinite linear;
                opacity: 0.15;
                pointer-events: none;
            }
            
            @keyframes rotateGlobeCss {
                0% { background-position: 0% center; }
                100% { background-position: 100% center; }
            }
            
            @keyframes rotateClouds {
                0% { background-position: 0% center; }
                100% { background-position: 100% center; }
            }
        `;
        document.head.appendChild(style);

    }, 1500);
})();

// Кнопка геолокации
const locationBtn = document.getElementById('locationBtn');
if (locationBtn) {
    locationBtn.addEventListener('click', function() {
        window.open('https://maps.app.goo.gl/xqPc75jfGyoMWu2y9?g_st=it', '_blank');
    });
}
// ========== КАРУСЕЛЬ: 1 КАРТОЧКА → ПОТОМ ВСЕ (2+2+1 НА ТЕЛЕФОНЕ) ==========
(function carouselFixed() {
    // ==========================================
    // ↓↓↓ ТВОИ 5 ФОТОК ↓↓↓
    // ==========================================
    const photos = [
        "IMG_1267.PNG",
        "IMG_1269.PNG",
        "IMG_1826.PNG",
        "IMG_2080.JPG",
        "IMG_3875.PNG"
    ];
    // ==========================================

    const wrapper = document.getElementById('carouselWrapper');
    if (!wrapper) return;

    let isExpanded = false;
    let cards = [];

    // 1. СОЗДАЁМ 5 КАРТОЧЕК
    photos.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        if (idx !== 2) card.classList.add('hidden');

        const img = document.createElement('img');
        img.src = photo;
        img.className = 'carousel-card-img';
        card.appendChild(img);
        wrapper.appendChild(card);
        cards.push(card);
    });

    // 2. ГАЛЕРЕЯ (ТЕ ЖЕ 5 ФОТОК)
    let currentIndex = 0;
    let galleryModal = null;

    function buildGallery() {
        if (document.getElementById('carouselGalleryFinal')) return;

        const html = `
            <div id="carouselGalleryFinal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 999999; align-items: center; justify-content: center;">
                <button id="cgfClose" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">✕</button>
                <button id="cgfPrev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 2rem; padding: 10px 15px; cursor: pointer; border-radius: 50%;">‹</button>
                <button id="cgfNext" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 2rem; padding: 10px 15px; cursor: pointer; border-radius: 50%;">›</button>
                <img id="cgfImage" style="max-width: 90%; max-height: 75%; border-radius: 20px; object-fit: contain;" src="">
                <div id="cgfCounter" style="position: absolute; bottom: 40px; color: white; background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 20px;"></div>
                <div style="position: absolute; bottom: 15px; color: rgba(255,255,255,0.3); font-size: 0.7rem;">← листай пальцем →</div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        galleryModal = document.getElementById('carouselGalleryFinal');

        document.getElementById('cgfClose').onclick = () => galleryModal.style.display = 'none';
        document.getElementById('cgfPrev').onclick = () => {
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;
            document.getElementById('cgfImage').src = photos[currentIndex];
            document.getElementById('cgfCounter').innerText = `${currentIndex+1}/${photos.length}`;
        };
        document.getElementById('cgfNext').onclick = () => {
            currentIndex = (currentIndex + 1) % photos.length;
            document.getElementById('cgfImage').src = photos[currentIndex];
            document.getElementById('cgfCounter').innerText = `${currentIndex+1}/${photos.length}`;
        };

        let startX = 0;
        galleryModal.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; });
        galleryModal.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].screenX;
            if (endX < startX - 40) document.getElementById('cgfNext').click();
            if (endX > startX + 40) document.getElementById('cgfPrev').click();
        });

        document.addEventListener('keydown', (e) => {
            if (galleryModal.style.display !== 'flex') return;
            if (e.key === 'ArrowLeft') document.getElementById('cgfPrev').click();
            if (e.key === 'ArrowRight') document.getElementById('cgfNext').click();
            if (e.key === 'Escape') galleryModal.style.display = 'none';
        });
    }

    function openGallery() {
        buildGallery();
        currentIndex = 0;
        document.getElementById('cgfImage').src = photos[0];
        document.getElementById('cgfCounter').innerText = `1/${photos.length}`;
        galleryModal.style.display = 'flex';
    }

    function expandCards() {
        if (isExpanded) return;
        isExpanded = true;
        cards.forEach(card => card.classList.remove('hidden'));
        const hint = document.getElementById('carouselHint');
        if (hint) hint.textContent = 'Klikk på et bilde for å se mer';
        cards.forEach(card => {
            card.removeEventListener('click', expandCards);
            card.addEventListener('click', openGallery);
        });
    }

    if (cards[2]) cards[2].addEventListener('click', expandCards);
})();
// ========== ПРОСТОЙ ЛАЙТБОКС ТОЛЬКО ДЛЯ ВЫБРАННЫХ ФОТО ==========
(function simpleLightbox() {
    // Найди все фото, которые должны открываться (добавь свои классы)
    const targetImages = document.querySelectorAll('.img-p_text, .about-image img, .box-img img, .column-card img');

    if (targetImages.length === 0) return;

    // Собираем URL этих фото
    const imageUrls = [];
    targetImages.forEach(img => {
        if (img.src && !imageUrls.includes(img.src)) {
            imageUrls.push(img.src);
        }
    });

    let currentIndex = 0;

    function createLightbox() {
        if (document.getElementById('simpleLightboxModal')) return;

        const html = `
            <div id="simpleLightboxModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 999999; justify-content: center; align-items: center; flex-direction: column;">
                <button id="slClose" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">✕</button>
                <button id="slPrev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 2rem; padding: 10px 15px; cursor: pointer; border-radius: 50%;">‹</button>
                <button id="slNext" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 2rem; padding: 10px 15px; cursor: pointer; border-radius: 50%;">›</button>
                <img id="slImage" style="max-width: 90%; max-height: 75%; border-radius: 20px; object-fit: contain;" src="">
                <div id="slCounter" style="position: absolute; bottom: 40px; color: white; background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 20px;"></div>
                <div style="position: absolute; bottom: 15px; color: rgba(255,255,255,0.3); font-size: 0.7rem;">← листай пальцем →</div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        document.getElementById('slClose').onclick = () => {
            document.getElementById('simpleLightboxModal').style.display = 'none';
        };
        document.getElementById('slPrev').onclick = () => {
            currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
            document.getElementById('slImage').src = imageUrls[currentIndex];
            document.getElementById('slCounter').innerText = `${currentIndex+1}/${imageUrls.length}`;
        };
        document.getElementById('slNext').onclick = () => {
            currentIndex = (currentIndex + 1) % imageUrls.length;
            document.getElementById('slImage').src = imageUrls[currentIndex];
            document.getElementById('slCounter').innerText = `${currentIndex+1}/${imageUrls.length}`;
        };

        let startX = 0;
        const modal = document.getElementById('simpleLightboxModal');
        modal.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; });
        modal.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].screenX;
            if (endX < startX - 40) document.getElementById('slNext').click();
            if (endX > startX + 40) document.getElementById('slPrev').click();
        });

        document.addEventListener('keydown', (e) => {
            if (modal.style.display !== 'flex') return;
            if (e.key === 'ArrowLeft') document.getElementById('slPrev').click();
            if (e.key === 'ArrowRight') document.getElementById('slNext').click();
            if (e.key === 'Escape') modal.style.display = 'none';
        });
    }

    function openLightbox(src) {
        createLightbox();
        const index = imageUrls.indexOf(src);
        if (index !== -1) currentIndex = index;
        document.getElementById('slImage').src = imageUrls[currentIndex];
        document.getElementById('slCounter').innerText = `${currentIndex+1}/${imageUrls.length}`;
        document.getElementById('simpleLightboxModal').style.display = 'flex';
    }

    // Вешаем клик только на выбранные фото
    targetImages.forEach(img => {
        img.removeEventListener('click', (e) => openLightbox(e.target.src));
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(e.target.src);
        });
        img.style.cursor = 'pointer';
    });
})();