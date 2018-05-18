// This is the main game, all the main game code will run from here

// This gets called from main.js

function GameState()
{
    this._topLayer = 0;

    // Objects
    this.obj_terrainmanager = null;
    this.obj_player = null;

    this.setup = function()
    {
        // Load map & hide first layer (which is used to store some info about map)
        obj_map.loadMap(data_map1.bytes); // Change later on

        this._topLayer = obj_map._layers - 1; // Gettop layer (which is the one the game hides)

        obj_map.hidden(this._topLayer, true); // Hide top layer
        obj_map.render(); // Render as well

        
        // Generate greenery for map

        this.obj_terrainmanager = new TerrainManager(); // Create new manager

        for (y = 0; y < obj_map._map_wh; y++)
        {
            for (x = 0; x < obj_map._map_wh; x++)
            {
                this.obj_terrainmanager.addTerrain(x, y, this._topLayer);
            }
        }

        this.obj_terrainmanager.render(); // render canvas
        
        // The player
        this.obj_player = new Player();

    }

    this.update = function()
    {
        canvas.image(obj_map.getCanvas(), 0, 0); // Draw map
        canvas.image(this.obj_terrainmanager.getCanvas(), 0, 0); // Draw greenery


        // Update and draw player
        this.obj_player.update();
        this.obj_player.drawUnits();

    }

    this.setup();
}