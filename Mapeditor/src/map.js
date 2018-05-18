function MapManager(img)
{
    this._tiles = img;
    this._graphic = null;

    this._data = [];
    this._hidden = [];

    this._tile_wh = 16;
    this._layers = 0;
    this._map_wh = 0;


    this.loadMap = function(data) // Loads mapdata
    {
        if (typeof data == "string")
        {
            console.error("Maploading requires int array!");
            return;
        }

        // Clear old map
        this._data = [];
        this._hidden = [];

        console.log(data);
        this._map_wh = data[0]; // Load width, height and layers from file
        this._layers = data[1];

        // Create new graphics
        this._graphic = createGraphics(this._tile_wh * this._map_wh, this._tile_wh * this._map_wh);

        if (data.length >= 2 + (this._map_wh * this._map_wh) * this._layers) // Check if it's the right length
        {
            var value;

            for (layer = 0; layer < this._layers; layer++) // Load each byte into layer
            {   
                this._data.push([""]);
                this._hidden.push(false);

                for (tile = 0; tile < this._map_wh * this._map_wh; tile++)
                {
                    value = data[2 + (layer * this._map_wh * this._map_wh) + tile].toString(16);

                    if (value.length != 2)
                        value = "0" + value;

                    this._data[layer][tile] = value; // Add value
                }
            }
        }
        else
        {
            this._data.push([""]);
            this._hidden.push(false);
            this._layers = 1;
            console.error("Incorrect Length!");
            for (i = 0; i < this._map_wh * this._map_wh; i++)
                this._data[0][i] = "80"; // Adds empty space
        }
    }

    this.saveMap = function()
    {
        var final = new Uint8Array((this._map_wh * this._map_wh) * this._layers + 2); // Create crate & crap crape

        final[0] = this._map_wh;
        final[1] = this._layers; // Headers

        for (layer = 0; layer < this._layers; layer++)
        {
            for (tile = 0; tile < this._map_wh * this._map_wh; tile++)
            {
                final[layer * this._map_wh * this._map_wh + tile + 2] = parseInt(this._data[layer][tile], 16);
            }
        }

        return final;
    }

    this.render = function()
    {
        console.log("Rendering...");

        //clear map
        this._graphic.background(127);

        var _x;
        var _y;

        for (layer = 0; layer < this._layers; layer++)
        {
            
            if (this._hidden[layer])
                continue; // Skip if layer should be hidden

            for (y = 0; y < this._map_wh; y++)
            {      
                for (x = 0; x < this._map_wh; x++)
                {
                    _x = parseInt("0x" + this._data[layer][y * this._map_wh + x][0].toString(16)); // Get position of current tile on grid
                    _y = parseInt("0x" + this._data[layer][y * this._map_wh + x][1].toString(16));

                    this._graphic.image(this._tiles, x * this._tile_wh, y * this._tile_wh, this._tile_wh, this._tile_wh, _x * this._tile_wh, _y * this._tile_wh, this._tile_wh, this._tile_wh);
                }
            }
        }
    }

    this.getCanvas = function()
    {
        if (this._graphic != null)
            return this._graphic; // Return graphic
    }

    this.setTile = function(x, y, layer, tile)
    {
        if (this._data[layer]) // check if layer exists
        {
            this._data[layer][y * this._map_wh + x] = tile;
        }
    }

    this.getTile = function(x, y, layer)
    {
        return this._data[layer][y * this._map_wh + x]; // returns tile at position
    }

    this.addLayer = function(pos)
    {
        var value = [];
        for (i = 0; i < this._map_wh * this._map_wh; i++) // Add empty space
        {
            value[i] = "00";
        }
        this._data.splice(pos, 0, value);
        this._layers++;
    }

    this.removeLayer = function(pos)
    {
        if (this._layers > 0)
        {
            this._data.splice(pos, 1);
            this._layers--;
        }
    }

    this.getLayerCount = function()
    {
        return this._layers - 1; // y tho
    }

    this.fill = function(layer, tile)
    {
        if (this._data[layer])
        {
            for (i = 0; i < this._map_wh * this._map_wh; i++)
            {
                this._data[layer][i] = tile;
            }
        }
    }

    this.isHidden = function(layer)
    {
        return this._hidden[layer];
    }

    this.hidden = function(layer, value)
    {
        this._hidden[layer] = value;
    }

    this.getData = function()
    {
        return this._data;
    }

    this.isSolid = function(x, y, layer)
    {
        if (this._data[layer][y * this._map_wh + x] == "ff")
            return true;
        else
            return false;
    }
}