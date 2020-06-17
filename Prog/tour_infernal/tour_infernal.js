var config = {
	type: Phaser.AUTO,
	width: 400,
	height: 800,
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },

	scene: {
		
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var platforms;
var player;
var cursors;
var scoreText;
var flame;

function preload(){
	this.load.image('background','asset/tour.png');
	this.load.image('platform','asset/poutre.png');
	this.load.image('bomb','asset/flame.png');
	this.load.spritesheet('perso','asset/nincat.png',{frameWidth: 40, frameHeight:70});
}


function create(){
	this.add.image(400,800,'background');

	platforms = this.physics.add.staticGroup();
	platforms.create('platform').refreshBody();
	
	player = this.physics.add.sprite(312,239,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(80);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 5, end: 1}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:0}],
		frameRate: 20
	});
	

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update(){
	if(cursors.right.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.left.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	} 
	
}
function hitBomb(player, bomb){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	life = 3;
	if (player.hitBomb(life =-1))
	gameOver=true;

}

function collectPieces(player, piece){
	piece.disableBody(true,true);
	score += 1;
	scoreText.setText('score: '+score);
	if(pieces.countActive(true)===0){
		pieces.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}