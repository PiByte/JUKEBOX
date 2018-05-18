// This class will handle all types of sprites
// Note: this does not support animated sprites, as the game wont really make use of them

function Sprite(tile, x, y, w, h)
{
    this._tile = tile;
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;

    this.move = function(x, y)
    {
        // Move cordinates of sprite
        this._x = x;
        this._y = y;
    }

    this.draw = function(_canvas = null)
    {
        // Draw to screen

        _x = parseInt("0x" + this._tile[0].toString(16)); // Get x and y of tile
        _y = parseInt("0x" + this._tile[1].toString(16));

        if (!_canvas)
            canvas.image(img_tileset, this._x, this._y, this._w, this._h, _x * 16, _y * 16, this._w, this._h);
        else
            _canvas.image(img_tileset, this._x, this._y, this._w, this._h, _x * 16, _y * 16, this._w, this._h);
    }

    this.mirror = function()
    {
        // mirrors sprite
    }

    this.changeGraphic = function(newTile)
    {
        // Change graphic of sprite
        this._tile = newTile;

        // You will have to redraw sprite in order to change graphic
    }
}