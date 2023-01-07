'use strict';

class MouseManager {
    constructor(canvasElement) {
        this.x = 0;
        this.y = 0;
        this.buttonLeft = false;
        this.buttonRight = false;
        // Add Event Listeners
        canvasElement.addEventListener(
        "mousemove", (e) => {
            let canvasRect = canvasElement.getBoundingClientRect();
            let scaleX = canvasElement.width / canvasRect.width;
            let scaleY = canvasElement.height / canvasRect.height;
            this.x = Math.min(Math.max(Math.floor((e.clientX - canvasRect.left) * scaleX), 0), canvasElement.width);
            this.y = Math.min(Math.max(Math.floor((e.clientY - canvasRect.top) * scaleY), 0), canvasElement.height);
        },false
        );
        canvasElement.addEventListener(
        "mousedown", (e) => {
            e.preventDefault();
            if (e.button === 0) {
            this.buttonLeft = true;
            } else if (e.button === 2) {
            this.buttonRight = true;
            }
        },false
        );
        canvasElement.addEventListener(
        "mouseup", (e) => {
            e.preventDefault();
            if (e.button === 0) {
            this.buttonLeft = false;
            } else if (e.button === 2) {
            this.buttonRight = false;
            }
        },false
        );
        canvasElement.addEventListener(
        "touchstart", (e) => {
            e.preventDefault();
            this.buttonLeft = true;
            let canvasRect = canvasElement.getBoundingClientRect();
            let scaleX = canvasElement.width / canvasRect.width;
            let scaleY = canvasElement.height / canvasRect.height;
            this.x = Math.min(Math.max(Math.floor((e.touches[0].clientX - canvasRect.left) * scaleX), 0), canvasElement.width);
            this.y = Math.min(Math.max(Math.floor((e.touches[0].clientY - canvasRect.top) * scaleY), 0), canvasElement.height);
        }, false
        );
        canvasElement.addEventListener(
        "touchmove", (e) => {
            e.preventDefault();
        }, false
        );
        canvasElement.addEventListener(
        "touchend", (e) => {
            e.preventDefault();
            this.buttonLeft = false;
        }, false
        );
	};
};