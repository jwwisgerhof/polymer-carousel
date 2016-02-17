(function() {
  Polymer({
    is: 'polymer-carousel',
    properties: {
      activeSlide: {
        type: Number,
        value: 1
      },
      autoPlay: {
        type: Object,
        value: true
      },
      slideDuration: {
        type: Number,
        value: 3000
      },
      slides: {
        type: Array,
        observer: '_slidesChanged',
        value: []
      },
      transitionDuration: {
        type: Number,
        value: 500
      },
      _interval: {
        type: Object
      },
      _initialized: {
        type: Boolean,
        value: false
      }
    },
    ready: function () {
      var self = this;

      if (this.autoPlay) {
        if (this.slides.length > 0) {
          self._initialized = true;
          self._startAutoPlay();
        }
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

      // Check if the carousel was initialized
      if (this._initialized !== true && this.slides.length > 0) {
        if (this.activeSlide > this.slides.length) { this.activeSlide = 1; }

        // Start auto play and
        if (this.autoPlay) { this._startAutoPlay(); }
        this._initialized = true;
      }
    },
    /**
     * @description Navigates to the slide provided by the event model
     * @param e
     * @private
     */
    _navigateToSlide: function(e) {
      // Reset timeout on interval
      if (this.autoPlay) {
        this._stopAutoPlay();
        this._startAutoPlay();
      }

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
        newSlide = (this.activeSlide == this.slides.length ? 1 : this.activeSlide + 1);
      }

      this._fadeOut(this.activeSlide);
      this._fadeIn(newSlide);

      this._activateSlide(newSlide);
    },
    /**
     * @description Activates the given slide - toggling classes
     * @param newSlide
     * @private
     */
    _activateSlide: function (newSlide) {
      this.activeSlide = newSlide;
      document.querySelector('.slider-nav-icon.active').classList.remove('active');
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
      if (!this.autoPlay) {
        this._startAutoPlay();
      } else {
        this._stopAutoPlay();
      }
      this.autoPlay = !this.autoPlay;
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
    },
    _fadeIn: function (slideNr) {
      var el = document.querySelector('.slide[data-slide="'+slideNr+'"]');
      el.style.opacity = 0;
      el.style.display = "block";

      var self = this;

      (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
          el.style.opacity = val;
          setTimeout(function() {
            requestAnimationFrame(fade);
          }, self.transitionDuration / 10);
        }
      })();
    },
    _fadeOut: function (slideNr) {
      var el = document.querySelector('.slide[data-slide="'+slideNr+'"]');

      var self = this;

      (function fade() {
        if ((el.style.opacity -= .1) < 0) {
          el.style.display = "none";
        } else {
          setTimeout(function () {
            requestAnimationFrame(fade);
          }, (self.transitionDuration / 10));
        }
      })();
    }
  })
})();