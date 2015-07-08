// epilog.js
// Copyright (C) 2013-2014 by Jeff Gold.
//
// This program is free software: you can redistribute it and/or
// modify it under the terms of the GNU General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see
// <http://www.gnu.org/licenses/>.
//
// ---------------------------------------------------------------------
// Inspired by Dennis Caswell's Impossible Mission.
//
// Generate rooms from data
// { "platforms": [
//       { "xs": 4, "xe": 6, "y": 4 },
//       { "xs": 4, "xe": 6 }],
//   "doors": [ "tr", "tl", "br", "bl" ],
//   "robots": [ {"x": 5, "y": 5] }
//
// We need the following states:
// - Elevator
// - Room
//
// Sounds:
// - RobotNoise
// - ZapNoise
// - Fall
// - Zapped
// - AnotherVisitor
// - HaHaHa
// - NoNoNo
//
// Sprites:
// - Player
//   * idle
//   * walk
//   * flip
// - Lift
// - Robot
// - Zap
// - Ball
// - Searchable
// - Terminal
// - FinalDoor
// - Note
(function(exports) {
    exports.go = function($, parent) {

        var myState = new Kiwi.State('myState');
        myState.preload = function() {
            Kiwi.State.prototype.preload.call(this);
            this.addSpriteSheet('characterSprite', 'character.png', 160, 120);
            this.addImage('background', 'jungle.png');
        }
        myState.create = function() {
            var keycodes = Kiwi.Input.Keycodes;
            Kiwi.State.prototype.create.call(this);
 
            this.background = new Kiwi.GameObjects.StaticImage(
                this, this.textures['background'], 0, 0);
            this.character = new Kiwi.GameObjects.Sprite(
                this, this.textures['characterSprite'], 350, 330);
            this.leftKey = this.game.input.keyboard.addKey(keycodes.A);
            this.rightKey = this.game.input.keyboard.addKey(keycodes.D);
            this.downKey = this.game.input.keyboard.addKey(keycodes.S);
            this.leftArrowKey = this.game.input.keyboard.addKey(keycodes.LEFT);
            this.rightArrowKey = this.game.input.keyboard.addKey(keycodes.RIGHT);
            this.downArrowKey = this.game.input.keyboard.addKey(keycodes.DOWN);

            this.character.animation.add('idleright', [0], 0.1, false);
            this.character.animation.add('crouchright', [1], 0.1, false);
            this.character.animation.add('moveright', [2, 3, 4, 5, 6, 7], 0.1, true);
            this.character.animation.add('idleleft', [8], 0.1, false);
            this.character.animation.add('crouchleft', [9], 0.1, false);
            this.character.animation.add('moveleft', [10, 11, 12, 13, 14, 15], 0.1, true);
 
            this.facing = 'right';
 
            this.character.animation.play('idleright');
            this.addChild(this.background);
            this.addChild(this.character);
        };

        myState.update = function() {
            Kiwi.State.prototype.update.call(this);
            if (this.downKey.isDown || this.downArrowKey.isDown) {
                if (this.character.animation.currentAnimation.name !=
                    ('crouch' + this.facing))
                    this.character.animation.play('crouch' + this.facing);
            } else if (this.leftKey.isDown || this.leftArrowKey.isDown) {
                this.facing = 'left';
                if (this.character.transform.x > 3)
                    this.character.transform.x -= 3;
                if (this.character.animation.currentAnimation.name !=
                    'moveleft')
                    this.character.animation.play('moveleft');
            } else if (this.rightKey.isDown || this.rightArrowKey.isDown) {
                this.facing = 'right';
                if (this.character.transform.x < 600)
                    this.character.transform.x += 3;
                if (this.character.animation.currentAnimation.name != 'moveright')
                    this.character.animation.play('moveright');
            } else {
                if (this.character.animation.currentAnimation.name != 'idle' + this.facing)
                    this.character.animation.play('idle' + this.facing);
            }
        }


        var myGame = new Kiwi.Game(null, 'epilog', myState, {
            debug: Kiwi.DEBUG_OFF,
            renderer: Kiwi.RENDERER_CANVAS,
            width: 800, height: 600,
            scaleType: Kiwi.Stage.SCALE_NONE, //SCALE_STRETCH,
            plugins: []
        });
        myGame.states.addState(myState);
        myGame.states.switchState('myState');
    };
})(typeof exports === 'undefined'? this['epilog'] = {}: exports);
