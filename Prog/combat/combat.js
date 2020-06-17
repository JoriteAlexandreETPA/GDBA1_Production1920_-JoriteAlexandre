var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 400,
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
var player;
var cursors;
var scoreText;
var ennemi;


function preload(){
	this.load.image('background','asset/decor.png');
	this.load.image('ground','asset/sol.png');
	this.load.spritesheet('perso','asset/nincatc.png',{frameWidth: 40, frameHeight:70});
	this.load.spritesheet('ennemi','asset/ennemi.png',{frameWidth: 40, frameHeight:70});
}


function create(){
	this.add.image(800,400 'background');

	platforms = this.physics.add.staticGroup();
	platforms.create(800,400 'sol').refreshBody();
	
	player = this.physics.add.sprite(244,285,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(80);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 5, end: 4}),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key:'up',
		frames: this.anims.generateFrameNumbers('perso', {start: 3, end: 0}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:5}],
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

	if(cursors.down.isDown){
		player.anims.play('up', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.up.isDown){
		player.setVelocityX(300);
		player.anims.play('up', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	} 
	
}
function hitPlayer(player, ennemi){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	life = 3;
	if (player.hitBomb(life =-1))
	gameOver=true;

}

function hitEnnemis(ennemi, player){
	ennemi.disableBody(true,true);
	score += 1;
	scoreText.setText('score: '+score);
	if(ennemi.countActive(true)===0){
		ennemi.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(0,100):
			Phaser.Math.Between(0,300);
		var ennemi = bombs.create(x, 1, 'ennemi');
		ennemi.setBounce(1);
		ennemi.setCollideWorldBounds(true);
		ennemi.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}
