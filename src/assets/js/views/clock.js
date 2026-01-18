// src/assets/js/views/clock.js

let clockInterval = null;

/**
 * Actualitza la posició de les agulles del rellotge i el display digital
 * Calcula els graus de rotació per a cada agulla basant-se en l'hora actual
 */
function updateClock() {
    const now = new Date();

    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Càlcul dels graus per a cada agulla
    const secondDeg = seconds * 6;                 // 360° / 60 segons = 6° per segon
    const minuteDeg = minutes * 6 + seconds * 0.1; // 6° per minut + moviment suau pels segons
    const hourDeg = (hours % 12) * 30 + minutes * 0.5; // 30° per hora + 0.5° per minut

    // Aplicar les transformacions a les agulles
    document.getElementById("second-hand").style.transform =
        `translateX(-50%) rotate(${secondDeg}deg)`;
    document.getElementById("minute-hand").style.transform =
        `translateX(-50%) rotate(${minuteDeg}deg)`;
    document.getElementById("hour-hand").style.transform =
        `translateX(-50%) rotate(${hourDeg}deg)`;
    
    // Actualitzar el display digital
    document.getElementById("hourNum").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minNum").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("secNum").textContent = seconds.toString().padStart(2, '0');
}

/**
 * Carrega i inicialitza el rellotge en el contenidor especificat
 * @param {HTMLElement} container - Element HTML on es renderitzarà el rellotge
 */
export function loadClock(container) {
    // Generar l'estructura HTML del rellotge
    container.innerHTML = `
        <h2 class="clockTitle">What time is it?</h2>
        <div class="clock">
            <span class="num n1">1</span>
            <span class="num n2">2</span>
            <span class="num n3">3</span>
            <span class="num n4">4</span>
            <span class="num n5">5</span>
            <span class="num n6">6</span>
            <span class="num n7">7</span>
            <span class="num n8">8</span>
            <span class="num n9">9</span>
            <span class="num n10">10</span>
            <span class="num n11">11</span>
            <span class="num n12">12</span>

            <div class="hand hour" id="hour-hand"></div>
            <div class="hand minute" id="minute-hand"></div>
            <div class="hand second" id="second-hand"></div>
            <div class="center-dot"></div>
        </div>
        <div class="numClock">
            <p>Son les: <span id="hourNum"></span>:<span id="minNum"></span>:<span id="secNum"></span></p>
        </div>
    `;

    // Actualitzar immediatament i configurar l'interval
    updateClock();

    // Netejar qualsevol interval previ (per evitar múltiples intervals)
    if (clockInterval) clearInterval(clockInterval);
    
    // Actualitzar el rellotge cada 5 segons (compromís entre precisió i rendiment)
    clockInterval = setInterval(updateClock, 5000);
}

/**
 * Atura i neteja l'interval del rellotge
 * Útil quan es canvia de pàgina per evitar fuites de memòria
 */
export function unloadClock() {
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}