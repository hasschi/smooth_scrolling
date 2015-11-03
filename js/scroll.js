(function () {

    "use strict";

    var a = function (fn) {
       
        var self;
        
        self = this;

        this._start = false;

        this.fn = function () {

            if (self._start) {

                fn();
            
                requestAnimationFrame(self.fn);

            } 
        };

    };

    a.prototype = {

        constructor: a,

        start: function () {

            this._start = true;

            requestAnimationFrame(this.fn);

        },
        stop: function () {

            this._start = false;
        }

    }

    

    window.MinosAnimation = a;             

})();


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
function easeOutQuad(elapsed, initialValue, amountOfChange, duration) {
    return -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue;
}

(function () {

    "use strict";

    var
        startX, startY, dx, dy,
        _pressed,
        _autoScrolling,
        timestamp, timenow, speed,

        target,
        SpeedTest, AutoScroll,
        elapsed, initialValue, destinationValue, amountOfChange, duration;


    startX = startY = dx = dy = 0;
    _pressed = false;
    _autoScrolling = false;  
    
    target = document.getElementById('content');

    document.getElementById('content').style.overflow = "initial";
    target = document.body;
    

    SpeedTest = new MinosAnimation(_scrollSpeed);      
    AutoScroll = new MinosAnimation(_doScroll);

    function start(event) {

        event.preventDefault();

        AutoScroll.stop();

        startX = event.clientX;
        startY = event.clientY;

        _pressed = true;
                   
        timestamp = timenow = Date.now();

        SpeedTest.start();
    };

    function toXY(x, y) {

        dx = (x - startX) * 0.6;
        dy = (y - startY) * 0.6;

        startX = x;
        startY = y;

        scrollY(dy);        
    }
    function move(event) {

        var x, y;

        if (_pressed) {

            toXY(event.clientX, event.clientY);

            scrollY(dy);                                  
                                            
            //autoscroll setting
            initialValue = target.scrollTop;
        }

    };

    function end(event) {

        var x, y;

        if (_pressed) {
                     
            toXY(event.clientX, event.clientY);

            SpeedTest.stop();                

            //autoscroll setting
            timestamp = timenow = Date.now();

            AutoScroll.start();

        }
    
        _pressed = false;
    };

    function scrollY(dy) {

        target.scrollTop -= dy;

    }

    function _scrollSpeed() {

        var dt,
            dec,
            v1, v2, a, t, x, v;                         

        timenow = Date.now();
        dt = timenow - timestamp;
        timestamp = timenow;

        if (dt == 0) {return;}

        dec = dy < 0;

        v1 = Math.abs(dy / dt * 1000);

        //Issue: #1
        if (!window.isFinite(v1)) {
            return;
        }                                                      
        
        a = -1000;
        t = v1 / -a;                    
        x = v1 * t + (0.5 * a * t * t);
                                     
        duration = t * 1000;
        amountOfChange = dec ? x : -x;

        dx = dy = 0;                   

    }

    function _doScroll() {

        var y;

        _autoScrolling = true;

        timenow = Date.now();
        elapsed = timenow - timestamp;


        if (elapsed > duration) {

            _autoScrolling = false;

            AutoScroll.stop();

            return;
        }

        //Easing: EaseOutQuad, by Fenix 2015/10/30        
        y = easeOutQuad(elapsed, initialValue, amountOfChange, duration);

        target.scrollTop = y;

        if (y < 0 || y > target.scrollHeight - target.offsetHeight) {

            _autoScrolling = false;

            AutoScroll.stop();            
        }

    }
    
    target.addEventListener("mousedown", start, false);
    
    document.addEventListener("mousedown", function () { if (!_pressed) { AutoScroll.stop(); } }, false);
    document.addEventListener("mousewheel", function () { AutoScroll.stop();  }, false);
    document.addEventListener("mousemove", move, false);
    document.addEventListener("mouseup", end, false);

    //target.addEventListener("mouseleave", function () { }, false); 

})();