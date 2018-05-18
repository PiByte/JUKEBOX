function InfoPanel(width, height)
{
    // Canvas
    this._width = width;
    this._height = height;
    
    this._graphic = createGraphics(this._width, this._height);

    this.updateInfo = function(x, y, tile, mx, my, l, cl, ms, sc)
    {
        // Reset graphic
        this._graphic.background(255);

        // Draw border around panel
        this._graphic.strokeWeight(0);
        this._graphic.stroke(0);
        this._graphic.rect(0, 0, this._width, this._height);

        this._graphic.strokeWeight(0);

        // Render text
        textSize(32);
        this._graphic.text("X: " + x, 10, 30);
        this._graphic.text("Y: " + y, 10, 60);
        this._graphic.text("Tile: 0x" + tile, 10, 90);
        this._graphic.text("Mouse X: " + mx, 10, 120);
        this._graphic.text("Mouse Y: " + my, 10, 150);
        this._graphic.text("Layers: " + l, 10, 180);
        this._graphic.text("Current Layer: " + cl, 10, 210);
        this._graphic.text("Scale: " + sc, 10, 240);
        this._graphic.text("FPS: " + Math.round(frameRate()), 10, 300);
        this._graphic.text(ms, 10, 360);
    }

    this.getCanvas = function()
    {
        if (this._graphic != null)
            return this._graphic; // Return graphic
    }
}

function MenuPanel(width, height)
{
    // Canvas
    this._width = width;
    this._height = height;
    
    this._graphic = createGraphics(this._width, this._height);

    this._buttons = [];

    this.setup = function(icon)
    {
        // Create buttons
        this._buttons[0] = new UIButton(10, 10, 100, 30, "New");
        this._buttons[1] = new UIButton(120, 10, 100, 30, "Save");
        this._buttons[2] = new UIButton(230, 10, 100, 30, "Load");
        this._buttons[3] = new UIButton(340, 10, 100, 30, "Fill");
        this._buttons[4] = new UIButton(450, 10, 100, 30, "Change Tile");
        this._buttons[5] = new UIButton(560, 10, 100, 30, "Undo");

        this._buttons[6] = new UIButton(10, 50, 100, 30, "Add Layer");
        this._buttons[7] = new UIButton(120, 50, 100, 30, "Remove Layer");
        this._buttons[8] = new UIButton(230, 50, 100, 30, "Layer +");
        this._buttons[9] = new UIButton(340, 50, 100, 30, "Layer -");
        this._buttons[10] = new UIButton(450, 50, 100, 30, "Clear Layer");
        this._buttons[11] = new UIButton(560, 50, 100, 30, "Hide/Show");

        this._buttons[12] = new UIButton(10, 90, 100, 30, "Zoom in");
        this._buttons[13] = new UIButton(120, 90, 100, 30, "Zoom out");
        this._buttons[14] = new UIButton(230, 90, 100, 30, "Minimap");
        this._buttons[15] = new UIButton(340, 90, 100, 30, "Reset Position");
        this._buttons[16] = new UIButton(450, 90, 100, 30, "About");
        this._buttons[17] = new UIButton(560, 90, 100, 30, "Run");

        // Reset graphic
        this._graphic.background(255);

        // Draw border around panel
        this._graphic.strokeWeight(0);
        this._graphic.stroke(0);
        this._graphic.rect(0, 0, this._width, this._height);

        this._graphic.strokeWeight(0); // Reset

        // Render buttons
        for (i = 0; i < this._buttons.length; i++)
        {
            this._buttons[i].draw(this._graphic);
        }

        // Add icon
        this._graphic.image(icon, 690, 50 - 16, 64, 64);
    }

    this.update = function(x, y)
    {
        // Check for keypress
        for (i = 0; i < this._buttons.length; i++)
        {
            if (this._buttons[i].click(mouseX - x, mouseY - y))
                return i;
        }

        return -1;
    }

    this.getCanvas = function()
    {
        if (this._graphic != null)
            return this._graphic; // Return graphic
    }
}

function MinimapPanel(map)
{
    this._width = width;
    this._height = height;

    this._margin = 5;

    this._graphic = null;

    this._x = 0;
    this._y = 0;

    this._w = 0;
    this._h = 0;

    this.render = function(_map)
    {
        this._w = _map.width; // width and height of map
        this._h = _map.height;

        this._x = this._width/2 - round(_map.width/16/2);
        this._y = this._height/2 - round(_map.height/16/2);
        
        this._graphic = createGraphics(this._width, this._height);
        this._graphic.rect(this._x, this._y, this._w / 16 + this._margin * 2, this._h / 16 + this._margin * 2); // Draw rectangle
        this._graphic.image(_map, this._x + this._margin, this._y + this._margin, this._w / 16, this._h / 16); // Draw minimap
    }

    this.click = function()
    {
        var r = -1;

        if (mouseX > this._x && mouseX < this._w + this._x  && mouseY > this._y && mouseY < this._h + this._y) // Make sure mouse is over tileset
        {
            r = [mouseX - this._x, mouseY - this._y];
        }
        
        return r;
    }

    this.getCanvas = function()
    {
        if (this._graphic != null)
            return this._graphic; // Return graphic
    }

    this.render(map);
}

function TileSelectPanel(width, height, tileset)
{
    // Canvas
    this._width = width;
    this._height = height;

    this._margin = 5;

    this._graphic = createGraphics(this._width, this._height);

    this._tileset = tileset;

    this._x = this._width/2 - this._tileset.width/2;
    this._y = this._height/2 - this._tileset.height/2;

    this.setup = function()
    {
        this._graphic.rect(this._x - this._margin, this._y - this._margin, this._tileset.width + (this._margin * 2), this._tileset.height + (this._margin * 2)); // Draw rectangle
        this._graphic.image(this._tileset, this._x, this._y); // Draw all tiles
    }

    this.click = function()
    {
        var r = -1;

        if (mouseX > this._x && mouseX < this._tileset.width + this._x  && mouseY > this._y && mouseY < this._tileset.height + this._y) // Make sure mouse is over tileset
        {
            r = this.roundDown(mouseX - this._x, 16).toString(16) + this.roundDown(mouseY - this._y, 16).toString(16);
        }
        
        return r;
    }

    this.roundDown = function(num, multi)
    {
        var _r = num % multi; // rounds down to closest multiple
        return (num - _r) / multi;
    }

    this.getCanvas = function()
    {
        if (this._graphic != null)
            return this._graphic; // Return graphic
    }
}

function UIButton(x, y, width, height, text)
{
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._text = text;

    this._graphic = createGraphics(this._width, this._height);

    this.click = function(x, y)
    {
        if (x > this._x && x < this._width + this._x  && y > this._y && y < this._height + this._y)
            return true;
        else
            return false;
    }

    this.draw = function(canvas)
    {
        canvas.strokeWeight(1);
        canvas.stroke(0);
        canvas.rect(this._x, this._y, this._width, this._height);
        canvas.strokeWeight(0);
        canvas.text(this._text, this._x + 10, this._y + 20);
    }
}