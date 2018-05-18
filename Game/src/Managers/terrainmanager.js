// Class that handles the growing of trees, bushes and other vegetation when map generates
// Will also generate "empty spots" in forests where bases can spawn

// This gets called from gameState.js

function TerrainManager()
{
    this._terrain = []; // Sprites
    this._canvas = null; // Canvas which eveything renders to. I've done it like this so the sprites won't have to rerender every frame

    // These arrays tell the biomemanager how often it'll appear when generating a new map.
    // For example, 07|50 means that tile 0x07 has a 50% chance of spawning

    this._plain = ["07|10", "17|15", "06|15"];
    this._forest = ["07|50", "17|50", "77|25", "06|25"];
    this._denseforest = ["07|75", "17|75", "67|15", "77|25", "06|45"];
    this._swamp = ["57|75", "67|10", "77|15", "06|20"];
    this._desert = ["37|50", "47|50", "67|10", "77|15", "06|20", "16|40"];
    this._snow = ["27|75", "77|25", "06|35"]; // external file

    this.addTerrain = function(x, y, layer)
    {
        // Takes x, y according to worldgrid
        // Generate biome specific items depending on current biome
        // Either adds new sprite with random texture or nothing

        var _biome = obj_map.getTile(x, y, layer);
        var _vegetation = null;

        switch (_biome)
        {
            case "8e": _vegetation = this._plain[round(rndWSeed(0, this._plain.length))]; // Plain
            break;
            case "9e": _vegetation = this._forest[round(rndWSeed(0, this._forest.length))]; // Forest
            break; 
            case "ae": _vegetation = this._denseforest[round(rndWSeed(0, this._denseforest.length))]; // Dense Forest
            break;
            case "8f": _vegetation = this._swamp[round(rndWSeed(0, this._swamp.length))]; // Swamp
            break;
            case "9f": _vegetation = this._desert[round(rndWSeed(0, this._desert.length))]; // Desert
            break;
            case "af": _vegetation = this._snow[round(rndWSeed(0, this._snow.length))];  // Snow
            break;
        }

        if (_vegetation)
        {
            var object = this.randomTerrain(_vegetation, x, y);
            if (object)
                this._terrain.push(object); // Add thing to list
        }
    }

    this.randomTerrain = function(object, x, y)
    {
        var _tile = object.split("|")[0]; // Which tile
        var _chance = parseInt(object.split("|")[1]); // The chances of that tile rendering

        var _r = null; // Sprite (will return null if nothing was generated)

        if (round(rndWSeed(0, 100)) < _chance)
        {
            _r = new Sprite(_tile, x * 16, y * 16, 16, 16); // Might change later on
        }

        return _r;
    }

    this.addSpace = function(x, y, w, h)
    {
        // Will generate empty space for stuff like buildings and others stuff
        // Might also be called under game, when building stuff
    }

    this.render = function()
    {
        if (this._canvas)
            this._canvas.remove();

        this._canvas = createGraphics(obj_map._map_wh * 16, obj_map._map_wh * 16); // Create new canvas and delete the old one

        for (i = 0; i < this._terrain.length; i++)
        {
            this._terrain[i].draw(this._canvas);
        }
    }

    this.getVegetationAt = function(x, y)
    {
        // Get the sprite at position x, y

        for (i = 0; i < this._terrain.length; i++)
        {
            if (this._terrain[i]._x === x * 16 && this._terrain[i]._y === y * 16)
                return this._terrain[i];
        }

        return null;
    }

    this.getCanvas = function()
    {
        if (this._canvas != null)
            return this._canvas; // Return graphic
    }

}

/*
Types of biomes and what to place:
* Plain - 8e (07, 17, 06)
* Forest - 9e (07, 17, 77, 06)
* Dense Forest - ae (07, 17, 67, 77, 06)
* Swamp - 8f (57, 67, 77, 06)
* Desert - 9f (37, 47, 67, 77, 06, 16)
* Snow - af (27, 77, 06)



*/