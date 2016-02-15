(function() {
    Polymer({
        is: 'jw-carousel',
        properties: {
            slides: {
                type: Array,
                observer: '_slidesChanged'
            },
            slideDuration: {
                type: Number,
                value: 3000
            },
            autoPlay: {
                type: Object,
                value: true
            },
            paused: {
                type: Object,
                value: false
            },
            activeSlide: {
                type: Number,
                value: 1
            },
            _interval: {
                type: Object
            }
        },
        ready: function () {
            var self = this;

            if (this.autoPlay) {
                self._startAutoPlay();
            }
        },
        /**
         * @description Reloads slides when the slides array changes.
         * @private
         */
        _slidesChanged: function () {
            // Add indexes
            for (var i = 0; i < this.slides.length; i++) {
                this.slides[i].index = i + 1;
            }

            if (this.activeSlide > this.slides.length) { this.activeSlide = 1; }
        },
        /**
         * @description Navigates to the slide provided by the event model
         * @param e
         * @private
         */
        _navigateToSlide: function(e) {
            if (e.model.item.index != this.activeSlide) {
                this._transitionToSlide(e.model.item.index);
            }
        },
        /**
         * @description Transitions to the given slide (or the next if no parameter is passed)
         * @param newSlide (optional)
         * @private
         */
        _transitionToSlide: function (newSlide) {
            if (typeof(newSlide) === 'undefined') {
                // Default increment the slide by 1
                var newSlide = (this.activeSlide == this.slides.length ? 1 : this.activeSlide + 1);
            }

            console.log(newSlide);

            this._activateSlide(newSlide);

            var self = this;
            setTimeout(function () {
                self.activeSlide = newSlide;
            }, 700);
        },
        /**
         * @description Activates the given slide - toggling classes
         * @param newSlide
         * @private
         */
        _activateSlide: function (newSlide) {
            document.querySelector('li.active').classList.remove('active');
            document.querySelector('.slider-nav-icon.active').classList.remove('active');

            document.querySelector('li[data-slide="'+newSlide+'"]').classList.add("active");
            document.querySelector('.slider-nav-icon[data-slide="'+newSlide+'"]').classList.add("active");
        },
        /**
         * @description Starts the auto play interval
         * @private
         */
        _startAutoPlay: function () {
            var self = this;

            this._interval = setInterval(function () {
                self._transitionToSlide();
            }, this.slideDuration);
        },
        /**
         * @description Stops the slider from auto playing slides
         * @private
         */
        _stopAutoPlay: function () {
            clearInterval(this._interval);
        },
        /**
         * @description Toggles autoplay
         * @private
         */
        _togglePause: function () {
            if (this.paused) {
                this._startAutoPlay();
            } else {
                this._stopAutoPlay();
            }
            this.paused = !this.paused;
        },
        /**
         * @description Returns "active" when the given slide is currently selected
         * @param slide
         * @returns {string}
         */
        slideClass: function (slide) {
            if (slide.index == this.activeSlide) {
                return "active";
            }
        },
        /**
         * @description Provides a class for the navigation bullets
         * @param slide
         * @returns {string}
         */
        navClass: function (slide) {
            if (slide.index == this.activeSlide) {
                return "active";
            }
        }
    })
})();