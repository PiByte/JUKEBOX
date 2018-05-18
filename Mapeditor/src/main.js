/* Renderer Process */

// Disable middle-click scroll thingy
document.body.onmousedown = function(e) { if (e.button === 1) return false; }

const { remote } = require("electron"); // Remote
const fs = require("fs"); // Filesystem
const prompt = require("electron-prompt"); // Prompt

// Some data which the editor load up
var data_tileset;
var data_maps;

// Objects from other script files
var obj_map;
var obj_info;
var obj_menu;

// Misc.
var map_x = 0;
var map_y = 0;
var map_move_speed = 16;
var map_scale = 1;
var map_canvas;

var mouse_x = 0;
var mouse_y = 0;

var mouseFillFirstLoc = false;
var mouseFillLoc_x = 0;
var mouseFillLoc_y = 0;

var msg = "Hello!";

var current_tile = "80";
var current_layer = 0;

var last_screen = [];

// Flags
var minimap_open = false;
var tileselect_open = false;

function preload()
{
    // Loads tileset
    data_tileset = loadImage("res/tileset.png");
    data_icon = loadImage("res/icon.ico");
}

function setup()
{
    // Canvas
    createCanvas(800, 600);
    background(255, 0, 0);
    frameRate(30); // yup
    noSmooth();

    obj_map = new MapManager(data_tileset);
    obj_info = new InfoPanel(200, 400);
    obj_menu = new MenuPanel(800, 200);
    obj_tile = new TileSelectPanel(800, 600, data_tileset);

    obj_map.loadMap([1,1,0]); // Loads empty map
    obj_map.render(); // renders empty map
    obj_info.updateInfo(map_x / 16, map_y / 16, current_tile, 0, 0); 
    obj_menu.setup(data_icon);
    obj_tile.setup();

    obj_minimap = new MinimapPanel(obj_map.getCanvas());
}

function draw()
{
    // Draw map and ui
    background(127);

    map_canvas = obj_map.getCanvas(); // Makes it easier to deal with, kinda

    image(map_canvas, map_x * map_scale, map_y * map_scale, map_canvas.width * map_scale, map_canvas.height * map_scale);
    image(obj_info.getCanvas(), 600, 0);
    image(obj_menu.getCanvas(), 0, 400);

    if (tileselect_open)
        image(obj_tile.getCanvas(), 0, 0);

    if (minimap_open)
        image(obj_minimap.getCanvas(), 0, 0);

    // Move map
    if (keyIsPressed)
        moveMap();
    
    // Update infopanel with some info
    obj_info.updateInfo(Math.abs(map_x) / 16, Math.abs(map_y) / 16, current_tile, mouse_x, mouse_y, obj_map.getLayerCount() + 1, current_layer + 1, msg, map_scale); // Update infopanel

    // Update mouse
    mouse_x = roundDown(mouseX - map_x * map_scale, 16 * map_scale);
    mouse_y = roundDown(mouseY - map_y * map_scale, 16 * map_scale);
}

function moveMap()
{
    if (keyIsDown(LEFT_ARROW))
        map_x += map_move_speed;
    if (keyIsDown(RIGHT_ARROW))
        map_x -= map_move_speed;
    if (keyIsDown(UP_ARROW))
        map_y += map_move_speed;
    if (keyIsDown(DOWN_ARROW))
        map_y -= map_move_speed;
}

function mousePressed()
{

    // Check at first if the tile select window or minimap is open
    // Then check if one of the buttons at the bottom are pressed
    // And atlast it check if the mouse is over the map itself
    if (tileselect_open)
    {
        var tile = obj_tile.click();
        if (tile !== -1)
        {
            current_tile = tile;
            tileselect_open = false;
            return; // Escape!
        }
    }

    if (minimap_open)
    {
        var place = obj_minimap.click(obj_map.getCanvas());
        if (place !== -1)
        {
            map_x = ((0 - place[0] * 16) + 16 * 20);
            map_y = ((0 - place[1] * 16) + 16 * 10);
            minimap_open = false;
            return; // Escape!
        }
    }

    if (!minimap_open && !tileselect_open)
    {
        // Check for button press
        switch(obj_menu.update(0, 400))
        {
            case 0:
                var wh = null;

                prompt({
                    title: "New Map",
                    label: "Enter width/height:"
                }).then((r) => {
                    
                    wh = parseInt(r);
                    if (!isNaN(wh) && wh < 256 && wh > 0)
                    {
                        var map = [wh, 1];
                        for (i = 0; i < wh * wh; i++)
                        {
                            map.push(0x20);
                        }

                        // Reset layer counter
                        current_layer = 0;

                        // Save last
                        

                        //Load map
                        obj_map.loadMap(map);
                        obj_map.render(); // render
                    }
                }).catch(console.error);
            break;
            case 1:
                remote.dialog.showSaveDialog({ filters: [{ name: "JUKEBOX Map Files", extensions: ["jbm"] }] }, function(filename)
                {
                    if (filename != null)
                    {
                        console.log("Saving map...");
                        var stream = fs.createWriteStream(filename);
                        var buffer = Buffer.from(obj_map.saveMap());
                        stream.write(buffer);
                        stream.end();
                    }
                });
            break;
            case 2:
                remote.dialog.showOpenDialog({ filters: [{ name: "JUKEBOX Map Files", extensions: ["jbm"] }] }, function(filename)
                {
                    if (filename != null)
                    {
                        fs.readFile(filename[0], function(err, data)
                        {
                            if (err) throw err;
                            // last

                            console.log("Loading map...");
                            obj_map.loadMap(data);
                            obj_map.render(); // render
                        });
                    }
                });
            break;
            case 3: // fill
                obj_map.fill(current_layer, current_tile);
                obj_map.render(); // render
            break;
            case 4: // Change tile
                tileselect_open = true;
            break;
            case 5: // undo
                undo();
            break;
            case 6:
                // add layer

                obj_map.addLayer(current_layer + 1);
                obj_map.render(); // render
                current_layer++;
            break;
            case 7:
                // remove layer

                obj_map.removeLayer(current_layer);
                obj_map.render(); // render
                if (current_layer > obj_map.getLayerCount())
                    current_layer--;
            break;
            case 8:
                // up
                if (obj_map.getLayerCount() > current_layer)
                    current_layer++;
            break;
            case 9:
                // down
                if (current_layer > 0)
                    current_layer--;
            break;
            case 10: //clear

                obj_map.fill(current_layer, "00");
                obj_map.render(); // render
            break;
            case 11: // Hide
                if (obj_map.isHidden(current_layer))
                    obj_map.hidden(current_layer, false);
                else
                    obj_map.hidden(current_layer, true);


                obj_map.render();
            break;
            case 12:
                map_scale = 2;
            break;
            case 13:
                map_scale = 1;
            break;
            case 14:
                obj_minimap.render(obj_map.getCanvas()); // render minimap, before showing
                minimap_open = true;
            break;
            case 15: // reset
                map_x = 0;
                map_y = 0;
            break;
            case 16:
                remote.dialog.showMessageBox({message: "JUKEBOX Map Editor\n\n(c) Jacob Johansson 2018", title: "About"});
            break;
            case 17: // run
                remote.dialog.showMessageBox({message: "This button will open the map ingame", title: "..."});
            break;
            case -1: // change tile
                var canvas_width = obj_map.getCanvas().width;
                var canvas_height = obj_map.getCanvas().height;
                
                // Make sure mouse is over map
                if (mouseX > map_x && mouseX < (canvas_width + map_x) * map_scale && mouseY > map_y && mouseY < (canvas_height + map_y) * map_scale)
                {
                    // Check either right or left click

                    if (mouseButton === LEFT)
                    {
                        // Left button, add tile
                        if (obj_map.getTile(mouse_x, mouse_y, current_layer) != current_tile)
                        {

                            obj_map.setTile(mouse_x, mouse_y, current_layer, current_tile);
                            obj_map.render(); // render
                        }
                    }

                    if (mouseButton === RIGHT)
                    {
                        // Erase
                        if (obj_map.getTile(mouse_x, mouse_y, current_layer) != "00")
                        {

                            obj_map.setTile(mouse_x, mouse_y, current_layer, "00");
                            obj_map.render(); // render
                        }
                    }

                    if (mouseButton === CENTER)
                    {
                        // Right button, mouse fill

                        if (mouseFillFirstLoc)
                        {
                            mouseFill(mouse_x, mouse_y, mouseFillLoc_x, mouseFillLoc_y); // Fill
                            mouseFillFirstLoc = false;
                        }
                        else
                        {

                            obj_map.setTile(mouse_x, mouse_y, current_layer, "ff");
                            obj_map.render();
                            mouseFillLoc_x = mouse_x;
                            mouseFillLoc_y = mouse_y;
                        
                            mouseFillFirstLoc = true;
                        }
                    }
                }
            break;
        }
    }
}

function roundDown(num, multi)
{
    var _r = num % multi; // rounds down to closest multiple
    return (num - _r) / multi;
}

function mouseFill(x1, y1, x2, y2)
{
    // Swap values if x1/y1 if larger than x2/y2
    if (x2 < x1) { x2 = [x1, x1 = x2][0]; }
    if (y2 < y1) { y2 = [y1, y1 = y2][0]; }

    for (_x = x1; _x <= x2; _x++)
    {
        for (_y = y1; _y <= y2; _y++)
        {
            obj_map.setTile(_x, _y, current_layer, current_tile);
        }
    }

    obj_map.render();
}

function undo()
{
    obj_map._data = last_screen;
    obj_map.render();
}

// Error reporter
window.onerror = function windowError(msg, url, line)
{
    remote.dialog.showMessageBox({type: "error", title: "Error!", message: msg + " (" + url + ", Line " + line + ")"});
    return;
}