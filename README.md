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


## Code credits

1. [Rex's virtual joystick plugin](https://codepen.io/rexrainbow/pen/oyqvQY)

    Rex's virtual joystick plugin provides the code for a sleek, easy to use joystick for use on mobile devices. We elected to use this for mobile accessibility because of our plans for a wide range of control types for the playable character.

2. [Michael Hadley's matterCollision plugin](https://github.com/mikewesthad/phaser-matter-collision-plugin#usage)

    Michael Hadley's matterCollision plugin takes the standard MatterJS collision detection system and make it modular and user-friendly. As we are using some of his examples to work from, this will be essential as well as useful.