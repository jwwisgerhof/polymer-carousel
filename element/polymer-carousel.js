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
       * Keeps track of image preloading
       */
      _preloaded: {
        type: Boolean,
        value: false
      }
    },
    listeners: {
      'polymer-carousel-item-loaded': '_itemLoaded'
    },
    attached: function () {
      // Placeholder
      this._preload();
    },
    _preload: function () {
      var images = [];
      for (var i = 0; i < this.slides.length; i++) {
        images.push(this.slides[i].image.href);
      }

      var self = this;
      preloadimages(images).done(function (e) {
        self._preloaded = true;
      });
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

  /**
   * Helper function to preload images
   *
   * @param arr
   * @returns {{done: done}}
   */
  function preloadimages(arr){
    var newimages=[], loadedimages=0;
    var postaction=function(){};
    var arr=(typeof arr!="object")? [arr] : arr;
    function imageloadpost(){
      loadedimages++
      if (loadedimages==arr.length){
        postaction(newimages); //call postaction and pass in newimages array as parameter
      }
    }
    for (var i=0; i<arr.length; i++){
      newimages[i]=new Image();
      newimages[i].src=arr[i];
      newimages[i].onload=function(){
        imageloadpost();
      };
      newimages[i].onerror=function(){
        imageloadpost();
      };
    }
    return { //return blank object with done() method
      done:function(f){
        postaction=f || postaction;
      }
    }
  }
})();