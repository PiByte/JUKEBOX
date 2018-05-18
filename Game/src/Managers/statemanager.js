// Will handle states in the game

// This gets called from main.js

function StateManager()
{
    this._states = [];
    this._names = [];
    this._current = 0;

    this.add = function(name, state)
    {
        this._states.push(state);
        this._names.push(name);
    }

    this.remove = function(name)
    {
        // Go through every state
        for (i = 0; i < this._states.length; i++)
        {
            // Check if name matches
            if (name == this._names[i])
            {
                // Remove
                /* TO DO! */
            }
        }
    }

    this.change = function(name)
    {
        // Go through every state
        for (i = 0; i < this._states.length; i++)
        {
            // Check if name matches
            if (name == this._names[i])
            {
                this._current = i;
                break;
            }
        }

        return false;
    }

    this.getState = function()
    {
        if (this._states.length > 0)
            return this._states[this._current];
    }

    this.getCurrent = function()
    {
        return this._current;
    }

    this.clear = function()
    {
        this._states = [];
        this._names = [];
        this._current = 0;
    }
}