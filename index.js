(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

document.addEventListener('DOMContentLoaded', game)

function game () {
    const canvas = document.querySelector('#frame')
    const scoreElement = document.querySelector('.score')
    const buttonPause = document.querySelector('.js-pause')
    const buttonRestart = document.querySelector('.js-restart')
    const bestResultElement = document.querySelector('.js-best-result')
    let bestResult = parseInt(localStorage.getItem('best')) || 0
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const count = 25
    const speed = 200
    const cellSize = width / count
    let score = 0
    let snakeBody = []
    let food = []
    let diffX = 0
    let diffY = 0
    let isChangeDir = true
    let isPlay = true
    let timer = null
    bestResultElement.textContent = bestResult
    createGame()
    drawSnake(ctx, snakeBody, cellSize)
    drawFood(ctx, food, cellSize)
    const play = function() {
        if (timer) {
            clearTimeout(timer)
        }
        if (isPlay) {
            snakeBody = getNewSnakePosition(snakeBody, count, diffX, diffY)
            const isCrash = checkCrashSnake(snakeBody)
            if (isCrash) {
                alert('crash')
                return
            }
            clearRect(ctx, cellSize, snakeBody[0].x, snakeBody[0].y)
            const isEat = checkEat(snakeBody, food)
            if (isEat) {
                food = getNewFood(snakeBody, cellSize, count)
                drawFood(ctx, food, cellSize)
                score++
                scoreElement.textContent = score
                if (score > bestResult) {
                    localStorage.setItem('best', score)
                    bestResultElement.textContent = score
                    bestResult = score
                }

            } else {
                snakeBody.shift()
            }
            if (!isCrash) {
                drawSnake(ctx, snakeBody, cellSize)
            }
            timer = setTimeout(function () {
                requestAnimationFrame(play)
                isChangeDir = true
            }, speed)
        }

    }
    requestAnimationFrame(play)

    function createGame () {
        snakeBody = [
            {
                x: 0,
                y: 0,
            },
            {
                x: 1,
                y: 0,
            },
            {
                x: 2,
                y: 0,
            },
            {
                x: 3,
                y: 0,
            },
            {
                x: 4,
                y: 0,
            },
            {
                x: 5,
                y: 0,
            }
        ]
        score = 0
        food = getNewFood(snakeBody, count)
        diffX = 1
        diffY = 0
    }

    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 39) {
            if (diffX !== -1 && diffY !== 0 && isChangeDir && isPlay) {
                diffX = 1
                diffY = 0
                isChangeDir = false
            }
        } else if (event.keyCode === 37) {
            if (diffX !== 1 && diffY !== 0 && isChangeDir && isPlay) {
                diffX = -1
                diffY = 0
                isChangeDir = false
            }
        } else if (event.keyCode === 38) {
            if (diffX !== 0 && diffY !== 1 && isChangeDir && isPlay) {
                diffX = 0
                diffY = -1
                isChangeDir = false
            }
        } else if (event.keyCode === 40) {
            if (diffX !== 0 && diffY !== -1 && isChangeDir && isPlay) {
                diffX = 0
                diffY = 1
                isChangeDir = false
            }
        }
    })
    buttonPause.addEventListener('mousedown', function () {
        if (isPlay) {
            buttonPause.textContent = 'Play'
            isPlay = false
        } else {
            buttonPause.textContent = 'Pause'
            isPlay = true
            requestAnimationFrame(play)
        }
    })
    buttonRestart.addEventListener('mousedown', function () {
        ctx.clearRect(0, 0, width, height)
        scoreElement.textContent = 0
        createGame()
        drawSnake(ctx, snakeBody, cellSize)
        drawFood(ctx, food, cellSize)
        requestAnimationFrame(play)
    })
}

function getNewFood (snake, count) {
    const getNewPosition = function () {
        return {
            x: Math.floor(Math.random() * count),
            y: Math.floor(Math.random() * count),
        }
    }
    let newPosition = getNewPosition()
    for (let i = 0; i < snake.length; i++) {
        if (newPosition.x === snake[i].x && newPosition.y === snake[i].y) {
            newPosition = getNewPosition()
            i = 0
        }
    }
    return [newPosition]
}

function checkEat (snake, food) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food[0].x && snake[i].y === food[0].y) {
            return true
        }
    }
    return false
}

function getNewSnakePosition (snake, count, diffX, diffY) {
    const head = snake[snake.length - 1]
    let newX = head.x + diffX
    let newY = head.y + diffY
    if (newX < 0) {
        newX = count
    } else if (newX >= count) {
        newX = 0
    }
    if (newY < 0) {
        newY = count
    } else if (newY >= count) {
        newY = 0
    }
    return snake.concat({
        x: newX,
        y: newY,
    })
}

function drawSnake (ctx, snakeBody, cellSize) {
    ctx.fillStyle = 'green'
    for (let i = 0; i < snakeBody.length; i++) {
        if (i === snakeBody.length - 1) {
            ctx.fillStyle = 'darkgreen'
        }
        drawRect(ctx, cellSize, snakeBody[i].x, snakeBody[i].y)
    }
}

function drawFood (ctx, food, cellSize) {
    ctx.fillStyle = 'red'
    for (let i = 0; i < food.length; i++) {
        drawRect(ctx, cellSize, food[i].x, food[i].y)
    }
}

function checkCrashSnake (snake) {
    for (let i = 0; i < snake.length; i++) {
        const coord = snake[i]
        for (let j = i + 1; j < snake.length; j++) {
            if (snake[j].x === coord.x && snake[j].y === coord.y) {
                return true
            }
        }
    }
    return false
}

function drawRect (ctx, cellSize, x, y) {
    ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1)
}

function clearRect (ctx, cellSize, x, y) {
    ctx.clearRect(x * cellSize, y * cellSize, cellSize - 1, cellSize -1)
}