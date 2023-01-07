'use strict';

class KeyManager {
  constructor() {
    this.keys = {
        "Backspace": false
        ,"Tab": false
        ,"Enter": false
        ,"ShiftLeft": false
        ,"ShiftRight": false
        ,"ControlLeft": false
        ,"ControlRight": false
        ,"AltLeft": false
        ,"AltRight": false
        ,"Pause": false
        ,"CapsLock": false
        ,"Escape": false
        ,"Space": false
        ,"PageUp": false
        ,"PageDown": false
        ,"End": false
        ,"Home": false
        ,"ArrowLeft": false
        ,"ArrowUp": false
        ,"ArrowRight": false
        ,"ArrowDown": false
        ,"PrintScreen": false
        ,"Insert": false
        ,"Delete": false
        ,"Digit0": false
        ,"Digit1": false
        ,"Digit2": false
        ,"Digit3": false
        ,"Digit4": false
        ,"Digit5": false
        ,"Digit6": false
        ,"Digit7": false
        ,"Digit8": false
        ,"Digit9": false
        ,"KeyA": false
        ,"KeyB": false
        ,"KeyC": false
        ,"KeyD": false
        ,"KeyE": false
        ,"KeyF": false
        ,"KeyG": false
        ,"KeyH": false
        ,"KeyI": false
        ,"KeyJ": false
        ,"KeyK": false
        ,"KeyL": false
        ,"KeyM": false
        ,"KeyN": false
        ,"KeyO": false
        ,"KeyP": false
        ,"KeyQ": false
        ,"KeyR": false
        ,"KeyS": false
        ,"KeyT": false
        ,"KeyU": false
        ,"KeyV": false
        ,"KeyW": false
        ,"KeyX": false
        ,"KeyY": false
        ,"KeyZ": false
        ,"MetaLeft": false
        ,"MetaRight": false
        ,"ContextMenu": false
        ,"Numpad0": false
        ,"Numpad1": false
        ,"Numpad2": false
        ,"Numpad3": false
        ,"Numpad4": false
        ,"Numpad5": false
        ,"Numpad6": false
        ,"Numpad7": false
        ,"Numpad8": false
        ,"Numpad9": false
        ,"NumpadMultiply": false
        ,"NumpadAdd": false
        ,"NumpadSubtract": false
        ,"NumpadDecimal": false
        ,"NumpadDivide": false
        ,"F1": false
        ,"F2": false
        ,"F3": false
        ,"F4": false
        ,"F5": false
        ,"F6": false
        ,"F7": false
        ,"F8": false
        ,"F9": false
        ,"F10": false
        ,"F11": false
        ,"F12": false
        ,"NumLock": false
        ,"ScrollLock": false
        ,"Semicolon": false
        ,"Equal": false
        ,"Comma": false
        ,"Minus": false
        ,"Period": false
        ,"Slash": false
        ,"Backquote": false
        ,"BracketLeft": false
        ,"Backslash": false
        ,"BracketRight": false
        ,"Quote": false
    };
    window.addEventListener(
      "keydown", (e) => {
        this.keys[e.code] = true;
      },false
    );
    window.addEventListener(
      "keyup", (e) => {
        this.keys[e.code] = false;
      },false
    );
  };
  isPressed(key) {
    return this.keys[key];
  };
};
