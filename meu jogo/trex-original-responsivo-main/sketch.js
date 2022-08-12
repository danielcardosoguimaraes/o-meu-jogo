var PLAY = 1
var END = 0
var gameState = PLAY

var backgroundImg

var trex, trex_running, trex_collided
var ground, invisibleGround, groundImage

var cloudsGroup, cloudImage
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6

var score = 0

var gameOver, restart

function preload() {
  trex_running = loadAnimation('astronauta_0.png','astronauta_1.png','astronauta_2.png','astronauta_3.png','astronauta_4.png','astronauta_5.png','astronauta_6.png','astronauta_7.png')
  trex_collided = loadAnimation('astronauta_0.png')

  groundImage = loadImage('ground2.png')

  cloudImage = loadImage('cloud.png')

  backgroundImg = loadImage('background.gif')

  obstacle1 = loadAnimation('sprite_0.png', 'sprite_1.png', 'sprite_2.png', 'sprite_3.png')
  obstacle2 = loadAnimation('sprite_4.png', 'sprite_5.png', 'sprite_6.png', 'sprite_7.png')
  obstacle3 = loadAnimation('sprite_8.png','sprite_9.png', 'sprite_10.png', 'sprite_11.png')
  obstacle4 = loadAnimation('sprite_12.png','sprite_13.png','sprite_14.png','sprite_15.png')
  obstacle5 = loadAnimation('sprite_16.png','sprite_17.png','sprite_18.png','sprite_19.png')
  obstacle6 = loadAnimation('sprite_20.png','sprite_21.png','sprite_22.png','sprite_23.png')

  gameOverImg = loadImage('gameOver.png')
  restartImg = loadImage('restart.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  trex = createSprite(50, height - 80, 20, 50)

  trex.addAnimation('running', trex_running)
  trex.addAnimation('collided', trex_collided)
  trex.scale = 1.5

  ground = createSprite(200, height - 10, 400, 20)
  ground.addImage('ground', groundImage)
  ground.x = ground.width / 2
  ground.velocityX = -(width + (3 * score) / 100)

  gameOver = createSprite(width / 2, height / 2)
  gameOver.addImage(gameOverImg)

  restart = createSprite(width / 2, height / 2 + 50)
  restart.addImage(restartImg)

  gameOver.scale = 0.5
  restart.scale = 0.5

  gameOver.visible = false
  restart.visible = false

  invisibleGround = createSprite(200, height - 5, 400, 10)
  invisibleGround.visible = false

  cloudsGroup = new Group()
  obstaclesGroup = new Group()

  score = 0
}

function draw() {
  //trex.debug = true;
  background(35,35,142)
  image(backgroundImg, 0, 0, width, height)

  text('Pontuação: ' + score, width - 100, 50)

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60)
    ground.velocityX = -(6 + (3 * score) / 100)

    if ((touches.length > 0 || keyDown('space')) && trex.y >= height - 90) {
      trex.velocityY = -12
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    trex.collide(invisibleGround)
    spawnClouds()
    spawnObstacles()

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END
    }
  } else if (gameState === END) {
    gameOver.visible = true
    restart.visible = true

    //defina a velocidade da cada objeto do jogo para 0
    ground.velocityX = 0
    trex.velocityY = 0
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)

    //mude a animação do trex
    trex.changeAnimation('collided', trex_collided)

    //defina o tempo de vida dos objetos para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)

    if (touches.length > 0 || mousePressedOver(restart)) {
      reset()
      touches = []
    }
  }

  drawSprites()
}

function spawnClouds() {
  //escreva o código aqui para fazer as nuvens surgirem
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width, 120, 40, 10)
    cloud.y = Math.round(random(100, height - 100))
    cloud.addImage(cloudImage)
    cloud.scale = 0.8
    cloud.velocityX = -3

    //designe tempo de vida para a variável
    cloud.lifetime = width

    //ajuste a profundidade
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1

    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud)
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, height - 65, 10, 40)
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + (3 * score) / 100)

    //gere um obstáculo aleatório
    var rand = Math.round(random(1, 6))
    switch (rand) {
      case 1:
        obstacle.addAnimation('alien1', obstacle1)
        break
      case 2:
        obstacle.addAnimation('alien2', obstacle2)
        break
      case 3:
        obstacle.addAnimation('alien3', obstacle3)
        break
      case 4:
        obstacle.addAnimation('alien4', obstacle4)
        break
      case 5:
        obstacle.addAnimation('alien5', obstacle5)
        break
      case 6:
        obstacle.addAnimation('alien6', obstacle6)
        break
      default:
        break
    }

    //designe o escalonamento e tempo de vida ao obstáculo
    obstacle.scale = 1.5
    obstacle.lifetime = width
    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle)
  }
}

function reset() {
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false

  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()

  trex.changeAnimation('running', trex_running)

  score = 0
}

