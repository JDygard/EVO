# EVO: Evolution
![alt text](/assets/images/readme/gameplan.png "Logo Title Text 1")
# The Game Plan
We're going to start with core features, creating a skeleton upon which the rest of the game can be built. 
The phases are arranged such that each phase rounds out a gameplay loop, and is thus a "complete game." This will allow us to turn in a complete project no matter which phase is completed, even the first.

## Phase 1, the skeleton
1. Rotating player

    i. Controls for rotation

    ii. Controls for locomotion

    iii. Physics for locomotion

2. Scrolling scene
3. Obstacles with bumping physics

    i. Floating obstacles, i.e. rocks

    ii. Static obstacles, i.e. rocks, environment boundary

4. Collectible plant food
5. EVO point tally
6. Other organisms
7. Ability to attack other organisms
8. Other organism behavior 

    i. Competitive gathering, i.e. herbivore/omnivore attempting to gather before the player

    ii. Aggressive behavior, i.e. carnivore/omnivore deciding whether to attack, and harming the player

    iii. Dropping collectibles

9. Graphics:

    i. Sprites

    ii. Animations

    iii. Environment

***
## Phase 2, Evolution

1. Proper UX

    i. EVO point tally
    
    ii. Health bar

    iii. Spending EVO points and menu

2. Upgrades

    i. Movement upgrades, stats and graphic representation

        a. Cilia (Small appendages on the sides that propel the organism. Moderate speed, moderate rotation)
        b. Flagellum (Long hairlike filament like on a sperm, high speed, poor rotation)
        c. Cytoplasmic flow (Rotation-independent free movement. Moderate speed.)
        d. Streamlined body (Requires size increase, gives more momentum to locomotion)
        e. Pseudofin (Requires size increase, high speed, high rotation)
        f. Swim bladder (Requires size increase, very high speed in bursts, poor rotation)

    ii. Defenses upgrades, stats and graphic representation

        a. Stiffened flanks (Incompatible with cilia and cytoplasmic flow, immunity to small sized creatures without jaws or spikes.)
        b. Chitinous shell (Requires size increase. Incompatible with cilia and cytoplasmic flow, immunity to similarly sized creatures without spikes, very reduced movement speed)
        c. Scales

    iii. Attack upgrades, stats and graphic representation

        a. Spike
        b. Poisoned spike (Requires size increase)
        c. Pseudoteeth
        d. Jaw (Requires size increase)
        e. Slime (Leaves a path of reduced movement speed behind, requires cytoplasmic flow or cilia)

    iv. Size upgrade
## Bugs
### Mouth sensor contact with world boundary causes crash
When the mouth sensor on the Player object makes contact with the world boundary, it assigns assigns a null value to one of the temporary variables within the querying function associated with the sensor. This crashes the game.
This bug has been tenacious as the sensor functions become more complex. We've had to implement a test before each if statement involving encountered variables. Another option would have been to give a value to the world boundary to eliminate
the problem of null values clogging up functions.

### Food target .destroy() bug crashes game.
This one was a doozy! After adding an enemy and giving them the ability to seek out food, I started getting a repetitive crash from the phaser library. I was destroying something the game was using. I assumed it had to do with the
code I had just added (the pairs loop .on('collisionstart' ) and had a difficult time figuring it out. I tried:
- Moving the foodSprite.destroy() function to the end of, and out of the for loop.
- Updating the entire Enemy class to differentiate it from the player
- Resetting the isSensor objects to differentiate them

It was only when I noticed that it was only the food being TARGETED by the enemy sprite that I realized the issue. When the targeted sprite was destroyed, the data object on the enemy became null. The game crashed because the control mechanism for the Enemy couldn't target null.

This was fixed by separating the destruction of the sprite into the update method, and forcing all enemy sprites to decide on a new target each time the garbage would empty. This is effective because the eaten food is removed from the targeting array as part of the collision process and thus cannot be retargeted.

### Adding the possibility to delete defeated enemies crashes the game
When a function discovers that an item has been eaten or that its 'hp' data point has been recuced to 0, it is flagged for garbage cleanup and removed from its object group/array, and assigning it to the garbage variable. Every frame tests the garbage variable for content and destroys it. In the case of eaten food, the garbage emptying function runs the findFood() method to prevent enemies from seeking destroyed food items. When adding the functionality to destroy enemy creatures, many methods started crashing the game. I tried:
- The lazy way out: adding a test to each crashing method to make sure nothing undefined got in

- Rearranging how the object arrays are written to
- Reorganizing the if statements that declare garbage

In the end, the issue was that even though the garbage variable destroyed its gameObject, it remained assigned to it, and would randomly destroy other objects as part of its functionality, because of how the statement tested the variable. A simple fix solved everything: Once the garbage is destroyed, reset the garbage variable == undefined.

### Crash in round 3
This may be the most tenacious bug I've yet discovered. Always in round 3, after two rounds have elapsed error-free, the game crashes. It happens when the moveToTarget() method is interrupted in trying to find the angle between the enemy and the target (food). It's almost certainly because it is targeting a food bit that doesn't exist, but I absolutely cannot find where the phantom food is coming from.

1. The food array is cleaned and replaced every round.
2. Food that is eaten is removed from the array before being removed from the game.
3. The targeting mechanic targets food using the array

### Enemy pathing results in driving loops
Occasionally when the enemy is pathing toward their target, they'll decide to perform an entire loop rather than go directly to their target.

## WebGL MAX_TEXTURE_SIZE
After converting my myriad textures into a master spritesheet, my sprites stopped rendering properly, appearing as small black boxes instead. I discovered that this is due to specific browser/hardware combinations having very low texture size limitations.

## Code credits

1. [Rex's virtual joystick plugin](https://codepen.io/rexrainbow/pen/oyqvQY)

    Rex's virtual joystick plugin provides the code for a sleek, easy to use joystick for use on mobile devices. We elected to use this for mobile accessibility because of our plans for a wide range of control types for the playable character.

2. [Michael Hadley's code example](https://codesandbox.io/s/5vlzl8j9vp?file=/js/player.js)

    This example was coded with a deprecated code simplifying library, and for an older version of the Phaser engine. However, much of the structure and entity interactions are carefully commented and helped immensely in learning about those systems.

3. [Rex's UI plugin](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/)

    Rex's UI plugin was used to build the "Evolve" menu. This made the code lighter, and eased the process of making a complex build menu.

4. [Emanuele Feranto's simple mask tutorial](https://www.emanueleferonato.com/2019/04/24/add-a-nice-time-bar-energy-bar-mana-bar-whatever-bar-to-your-html5-games-using-phaser-3-masks/)

    This was a simple tutorial on using masks. I almost wouldn't have credited it, but I did lift the concept of stepWidth directly from the tutorial.

## Visuals credits

1. Jess Vide's [Blue Ocean Blue Sky](https://www.pexels.com/photo/blue-ocean-under-blue-sky-and-white-clouds-4611748/). This image was disassembled and used for the menu screen animation.

## Acknowledgements

1. Richard Davey, aka Photonstorm, creator of the Phaser 3 library used extensively in this project. He, personally, tirelessly fielded my questions as an active member of his Discord community, and deserves much more than my humble thanks for all of his help.