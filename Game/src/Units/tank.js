// This is a unit, more specifically a tank.
// It will have the ability to shoot with it's cannon, act as a turret/enemy detector
// And it will have a selfdestruct method (BOOM!)

function Tank(startX, startY)
{
    this._sprite = null; // Actual sprite object
    this._tile = "80"; // Tile #

    this._width = 16;
    this._height = 16;

    this._speed = 0.5;

    this._direction = [0, 0]; // [0, 0] = looking to right


    this._turret = false;
    this._turretTile = "ff";

    this.setup = function()
    {
        this._sprite = new Sprite(this._tile, startX, startY, this._width, this._height); // Create a brand new sprite
    }

    this.draw = function()
    {
        // Draw sprite (use native sprite function)
        this._sprite.draw();
    }

    this.move = function(x, y)
    {
        // This also uses the normal builtin sprite function
        this._sprite.move(x, y);
    }

    this.shoot = function()
    {

    }

    this.turretMode = function()
    {

    }

    this.selfDestruct = function()
    {

    }

    this.setup();
}