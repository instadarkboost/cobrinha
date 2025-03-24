const canvas = document.getElementById('jogoCanvas'); 
const ctx = canvas.getContext('2d');

let pontos = 0;

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};

document.addEventListener('keydown', (e) => {
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(e.code)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

function reiniciarJogo() {
    pontos = 0;
    cobra = new Cobra(100, 200, 20, 20);
    comida = new Comida();
    loop();  // reinicia o loop do jogo
}

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }
    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura, 'blue');
        this.velocidade = 5;
        this.corpo = [{ x: x, y: y }];
        this.viva = true;
    }
    atualizar() {
        if (!this.viva) return;
        let novaCabeca = { x: this.corpo[0].x, y: this.corpo[0].y };
        if (teclasPressionadas.KeyW) novaCabeca.y -= this.velocidade;
        if (teclasPressionadas.KeyS) novaCabeca.y += this.velocidade;
        if (teclasPressionadas.KeyA) novaCabeca.x -= this.velocidade;
        if (teclasPressionadas.KeyD) novaCabeca.x += this.velocidade;
        if (
            novaCabeca.x < 0 || novaCabeca.x + this.largura > canvas.width ||
            novaCabeca.y < 0 || novaCabeca.y + this.altura > canvas.height
        ) {
            this.viva = false;
            alert("game over!!!!");
            reiniciarJogo();
            return;
        }
        
        this.corpo.unshift(novaCabeca);
        this.corpo.pop();
    }
    desenhar() {
        if (!this.viva) return;
        this.corpo.forEach(parte => {
            ctx.fillStyle = this.cor;
            ctx.fillRect(parte.x, parte.y, this.largura, this.altura);
        });
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Pontos: ${pontos}`, 10, 20);
    }
    verificarColisao(comida) {
        if (!this.viva) return;
        if (
            this.corpo[0].x < comida.x + comida.largura &&
            this.corpo[0].x + this.largura > comida.x &&
            this.corpo[0].y < comida.y + comida.altura &&
            this.corpo[0].y + this.altura > comida.y
        ) {
            this.corpo.push({});
            comida.reposicionar();
            pontos++;
        }
    }
}

class Comida extends Entidade {
    constructor() {
        super(
            Math.floor(Math.random() * (canvas.width - 20)),
            Math.floor(Math.random() * (canvas.height - 20)),
            20,
            20,
            'red'
        );
    }
    reposicionar() {
        this.x = Math.floor(Math.random() * (canvas.width - 20));
        this.y = Math.floor(Math.random() * (canvas.height - 20));
    }
}

let cobra = new Cobra(100, 200, 20, 20);
let comida = new Comida();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cobra.atualizar();
    cobra.desenhar();
    comida.desenhar();
    cobra.verificarColisao(comida);
    if (cobra.viva) {
        requestAnimationFrame(loop);
    }
}
loop();
