// This thing handles the camera class, which i guess is important
// This class will move the entire canvas whenever the player moves, and when the player changes unit and so on

function CameraManager(_canvas)
{
    this._scale = 2;
    this._canvas = _canvas;
 
    this._maxX = settings.width - canvas.width * this._scale; // pixels
    this._maxY = settings.height - canvas.height * this._scale;


    this._object = null;

    this._x = 0;
    this._y = 0;
    this._canvasWidth = this._canvas.width * this._scale;
    this._canvasHeight = this._canvas.height * this._scale;

    this._marginLeft = Math.floor((this._canvas.width / (16 * this._scale)) / 2) * (16 * this._scale); // Basically middle tile where the main player will ideally be
    this._marginTop = Math.floor((this._canvas.height / (16 * this._scale)) / 2) * (16 * this._scale);

    this.update = function()
    {
        // draw canvas
        image(canvas, this._x, this._y, this._canvasWidth, this._canvasHeight);

        // Check for differences in object (if its assigned)
        // Update them (with margin)

        // Check if position is too close to corner (if it is engage corner mode which will keep camera from moving offscreen)
        // This also checks if player on the margin "point", and will deactivate corner mode

        // Also check if _object is null or not

        if (this._object._x !== this._x || this._object._y !== this._y) // Checking for differences
        {
            // Updating
            this.moveCamera(this._object._x, this._object._y);
        }

        // Check if camera is in corner, and will therefore wtop moving



    }

    this.moveCamera = function(x, y)
    {
        // Will basically teleport the camera
    
        this._x = x;
        this._y = y;    
    }

    this.follow = function(object)
    {
        // Error out if object with no xy cordinates is found
        if (!object._x || !object._y)
        {
            console.error("No XY cordinates found in object!");
            return -1;
        }
        else
        {
            this._object = object;
        }
    }
}