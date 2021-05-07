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

## Code credits

1. [Rex's virtual joystick plugin](https://codepen.io/rexrainbow/pen/oyqvQY)

    Rex's virtual joystick plugin provides the code for a sleek, easy to use joystick for use on mobile devices. We elected to use this for mobile accessibility because of our plans for a wide range of control types for the playable character.

2. [Michael Hadley's code example](https://codesandbox.io/s/5vlzl8j9vp?file=/js/player.js)

    This example was coded with a deprecated code simplifying library, and for an older version of the Phaser engine. However, much of the structure and entity interactions are carefully commented and helped immensely in learning about those systems.

3. [Rex's UI plugin](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/)

    Rex's UI plugin was used to build the "Evolve" menu. This made the code lighter, and eased the process of making a complex build menu.

## Visuals credits

1. Jess Vide's [Blue Ocean Blue Sky](https://www.pexels.com/photo/blue-ocean-under-blue-sky-and-white-clouds-4611748/). This image was disassembled and used for the menu screen animation.

## Acknowledgements

1. Richard Davey, aka Photonstorm, creator of the Phaser 3 library used extensively in this project. He, personally, tirelessly fielded my questions as an active member of his Discord community, and deserves much more than my humble thanks for all of his help.