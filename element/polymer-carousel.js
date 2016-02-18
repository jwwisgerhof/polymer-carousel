(function() {
  Polymer({
    is: 'polymer-carousel',
    properties: {
      /**
       * Slide that is currently active. Can be used on initialization
       */
      activeSlide: {
        type: Number,
        value: 1
      },
      /**
       * Sets the status of Auto Play. Setting this to false effectively "pauses" the carousel
       */
      autoPlay: {
        type: Object,
        value: true
      },
      heightRatio: {
        type: Number,
        value: 1.5
      },
      /**
       * The duration each slide is active (in milliseconds)
       */
      slideDuration: {
        type: Number,
        value: 3000
      },
      /**
       * Slides
       */
      slides: {
        type: Array,
        observer: '_slidesChanged',
        value: []
      },
      /**
       * How long the transition animation lasts
       */
      transitionDuration: {
        type: Number,
        value: 500
      },
      /**
       * Tracked interval for internal use only
       */
      _interval: {
        type: Object
      },
      /**
       * Keeps track of the items loaded
       */
      _itemsLoaded: {
        type: Number,
        value: 0
      },
      /**
       * A list of images that need to be loaded
       */
      _imagesToBeLoaded: {
        type: Array,
        value: []
      }
    },
    listeners: {
      'polymer-carousel-item-loaded': '_itemLoaded'
    },
    attached: function () {
      // Placeholder
      this._preloadImages();
    },
    _preloadImages: function () {
      // Build list of all indexes
      this._imagesToBeLoaded = [];
      for (var i = 0; i < this.slides.length; i++) {
        if ((this.activeSlide - 1) != i) {
          this._imagesToBeLoaded.push(this.slides[i]);
        }
      }
      this._imagesToBeLoaded.unshift(this.slides[this.activeSlide - 1]);

      // Start preloading
      this._preloadImage();
    },
    _preloadImage: function () {
      var self = this;

      if (this._imagesToBeLoaded.length > 0) {
        var image = self._imagesToBeLoaded.shift();

        var img = new Image();
        img.src = image.image.href;
        img.onload = function () {
          self.$$('.item-'+image.index).imageLoaded = true;

          self._preloadImage();
        };
      }
    },
    /**
     * Fired whenever a carousel-item is loaded
     * @private
     */
    _itemLoaded: function () {
      this._itemsLoaded++;

      if (this._itemsLoaded == this.slides.length) {
        this._activate();
      }
    },
    /**
     * Fired when all carousel items are loaded
     * @private
     */
    _activate: function () {
      this.$$('.item-' + this.activeSlide).show();

      if (this.autoPlay) {
        this._startAutoPlay();
      }
    },
    /**
     * Reloads slides when the slides array changes.
     * @private
     */
    _slidesChanged: function () {
      this._itemsLoaded = 0;

      for (var i = 0; i < this.slides.length; i++) {
        this.slides[i].index = i + 1;
      }

      if (this.slides.length > 0 && this.activeSlide > this.slides.length) {
        this.activeSlide = 1;
      }
    },
    /**
     * Navigates to the slide provided by the event model
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
     * Transitions to the given slide (or the next if no parameter is passed)
     * @param newSlide (optional)
     * @private
     */
    _transitionToSlide: function (newSlide) {
      if (typeof(newSlide) === 'undefined') {
        // Default increment the slide by 1
        newSlide = (this.activeSlide == this.slides.length ? 1 : this.activeSlide + 1);
      }

      this.$$('.item-' + this.activeSlide).hide();
      this.$$('.item-' + newSlide).show();

      this._activateSlide(newSlide);
    },
    /**
     * Activates the given slide - toggling classes
     * @param newSlide
     * @private
     */
    _activateSlide: function (newSlide) {
      this.activeSlide = newSlide;
      document.querySelector('.slider-nav-icon.active').classList.remove('active');
      document.querySelector('.slider-nav-icon[data-slide="'+newSlide+'"]').classList.add("active");
    },
    /**
     * Starts the auto play interval
     * @private
     */
    _startAutoPlay: function () {
      var self = this;

      this._interval = setInterval(function () {
        self._transitionToSlide();
      }, this.slideDuration);
    },
    /**
     * Stops the slider from auto playing slides
     * @private
     */
    _stopAutoPlay: function () {
      clearInterval(this._interval);
    },
    /**
     * Toggles auto play
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
     * Returns "active" when the given slide is currently selected
     * @param slide
     * @returns {string}
     */
    _slideClass: function (slide) {
      if (slide.index == this.activeSlide) {
        return "active";
      }
    },
    /**
     * Provides a class for the navigation bullets
     * @param slide
     * @returns {string}
     */
    _navClass: function (slide) {
      if (slide.index == this.activeSlide) {
        return "active";
      }
    }
  });
})();