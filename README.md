
# EL POLLO LOCO - Jump'n'Run Game

 The game is built entirely in Vanilla JavaScript using an object-oriented class hierarchy rendered on an HTML5 Canvas. An additional task in this project was to develop the game logic and to supplement the provided illustrations with custom images and styles.

![Start page](el-pollo-loco_readme.jpg)

## TechStack

* Vanilla Javascript
* CSS

## Structure

```text
el-pollo-loco/
├─ audio
├─ fonts
├─ img
├─ js
└─ models/
    ├─ Level
    ├─ Keyboard
    ├─ HighscoreManager
    ├─ AudioManager
    └─ World/
        └─ DrawableObject/
              ├─ CollectableObject
              ├─ CountableItem
              ├─ Bottle
              ├─ Coin
              ├─ MovableObject/
              │  ├─ movingBackground
              │  ├─ Clouds
              │  ├─ Chicken
              │  ├─ MiniChicken
              │  ├─ Endboss
              │  ├─ Pepe
              │  ├─ CollidableObject
              │  └─ ThrowableObject
              └─ StaticObject/
                    ├─ staticBackground
                    ├─ StatusBarChilli
                    ├─ StatusBarCoin
                    ├─ StatusBarEndboss
                    └─ StatusBarPepe
```
