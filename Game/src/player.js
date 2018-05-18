// This class will handle the player, ie keyboard controls, health, current unit and their position, what they're carrying, and so on

function Player()
{
    this._units = []; // Array of current units (objects of other classes)
    this._currentUnit = 0;
    this._tabmode = false; // Wheater player is in tabmode (ie can select other units or look at materials etc)

    this._speed = 0; // Pixels per second (this will change depending on unit)
    // WARNING! MUST BE A MULTIPLE OF SIXTEEN.
    // If the speed isn't a multiple of sixteen, the vehicle will start moving forever in which ever direction you chose

    this._moving = false;
    this._movingDirection = [0, 0]; // x&y
    this._movingLeft = 16; // Tile width, change later on

    this.update = function()
    {
        // Keyboard, collision detection, moving sprite, wheather in tab mode or not

        // Check for collisions with sprites and worldmap

        // Check if key is pressed and if player is already moving
        if (keyIsPressed && !this._moving)
        {
            switch (keyCode)
            {
                case settings.controls.up[settings.controlScheme]:
                    this._movingDirection = [0, -1];
                    this._moving = true;
                break;
                case settings.controls.down[settings.controlScheme]:
                    this._movingDirection = [0, 1];
                    this._moving = true;
                break;
                case settings.controls.left[settings.controlScheme]:
                    this._movingDirection = [-1, 0];
                    this._moving = true;
                break;
                case settings.controls.right[settings.controlScheme]:
                    this._movingDirection = [1, 0];
                    this._moving = true;
                break;

                case 49:
                    this._currentUnit = 0;
                break;
                case 50:
                    this._currentUnit = 1;
                break;
            }
        }

        if (this._moving)
        {
            if (this._movingLeft !== 0)
            {
                // Moving player
                this._units[this._currentUnit].move(this._units[this._currentUnit]._sprite._x += (this._movingDirection[0] * this._units[this._currentUnit]._speed), this._units[this._currentUnit]._sprite._y += (this._movingDirection[1] * this._units[this._currentUnit]._speed));

                // Moving camera as well
                obj_camera.moveCameraInstantly(this._units[this._currentUnit]._sprite._x * -1, this._units[this._currentUnit]._sprite._y * -1);

                this._movingLeft -= this._units[this._currentUnit]._speed;
            }
            else
            {
                // Resetting
                this._moving = false;
                this._movingDirection = [0, 0]; // x&y
                this._movingLeft = 16; // Tile width, change later on
            }
            
        }
    }

    this.drawUnits = function()
    {
        // Renders all units onto screen

        for (i = 0; i < this._units.length; i++)
        {
            this._units[i].draw();
        }
    }

    this.setup = function()
    {
        // Create example tank (will be replaced in future with probably a builder)
        this._units[0] = new Tank(0, 0);

        this._units[1] = new Tank(16, 16);
    }

    this.setup();
}