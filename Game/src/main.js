/*
Boring things to finish:
    * Clean up map.js
    * Finish Map editor
    * Port this shit to nodejs
    * Finish Statemanager.remove(name);
    * Add these controls to JSON settingsfile (not limited to):
        * TAB mode (hint hint)
        * Quick switching between units
        * Menus within units
    * Make tiles and res scalable (and review hardcoded values in general)
    * Standardize variable names, function names and structure in files
    * Add scaling (like window scaling)
*/

// Initializes statemanager

// This gets called from the main process (electron)

// Disable middle-click scroll thingy
document.body.onmousedown = function(e) { if (e.button === 1) return false; }

/* this comes later when i enable node
const { remote } = require("electron"); // Remote
const fs = require("fs"); // Filesystem
*/

// Objects and managers
var obj_statemanager;
var obj_map;
var obj_camera;

var obj_menuState;
var obj_gameState;

// Data
var img_tileset;
var data_map1;

// Misc
var rnd_seed;

// Main canvas
var canvas;

function preload()
{
    // Load tileset and maps
    img_tileset = loadImage("res/tileset.png");
    data_map1 = loadBytes("res/biometest.jbm");
    settings = loadJSON("settings.json");
}

function setup()
{
    // Setup canvas
    createCanvas(settings.width, settings.height); // Canvas height and width
    background(255, 0, 0);
    frameRate(settings.fps);
    noSmooth();

    // RNG
    rnd_seed = settings.seed;

    // Init managers
    obj_statemanager = new StateManager();
    obj_map = new MapManager(img_tileset);

    // Init gamestates
    obj_menuState = new MenuState();
    obj_gameState = new GameState();
    
    // Add to statemanager
    obj_statemanager.add("menu", obj_menuState);
    obj_statemanager.add("game", obj_gameState);

    // Load first state
    obj_statemanager.change("game");

    // Main canvas
    canvas = createGraphics(obj_map._map_wh * 16, obj_map._map_wh * 16);
    canvas.background(0);

    // Camera
    obj_camera = new CameraManager(canvas);
}

function draw()
{
    background(0); // Clear background

    // Let camera view scene (render through camera class)
    obj_camera.update();

    // Get current state and execute code from state
    obj_statemanager.getState().update();
}

// Seeded random number generator (used when generating terrain and others)
function rndWSeed(min, max)
{
    max = max || 1;
    min = min || 0;
 
    rnd_seed = (rnd_seed * 9301 + 49297) % 233280;
    var rnd = rnd_seed / 233280;
 
    return min + rnd * (max - min);
}