(function() {
  Polymer({
    is: 'polymer-carousel-item',
    behaviors: [
      Polymer.NeonAnimationRunnerBehavior
    ],
    properties: {
      /**
       * The image link
       */
      link: {
        type: String
      },
      /**
       * Source for the carousel-item image
       */
      image: {
        type: String
      },
      /**
       * Accessibility description for the item
       */
      description: {
        type: String
      },
      /**
       * Slide number. Used for events firing
       */
      slideNumber: {
        type: Number,
        value: 0
      },
      /**
       * Transition duration
       */
      transitionDuration: {
        type: Number,
        value: 1000
      },
      animationConfig: {
        type: Object,
        value: function () {
          return {
            'show': {
              name: 'fade-in-animation',
              node: this.$.slide,
              timing: {
                duration: 1000
              }
            },
            'hide': {
              name: 'fade-out-animation',
              node: this.$.slide,
              timing: {
                duration: 1000
              }
            }
          }
        }
      },
      /**
       * Determines if the image has been loaded
       */
      imageLoaded: {
        type: Boolean,
        value: false,
        observer: "_imageLoaded"
      },
      _currentlyHidden: {
        type: Boolean,
        value: true
      }
    },
    listeners: {
      // this event is fired when the animation finishes
      'neon-animation-finish': '_onNeonAnimationFinish'
    },
    attached: function () {
      this.async(function () {
        // Set preloader height
        if (!this.imageLoaded) {
          var el = this.$$('.loading-container');
          el.style.height = (el.offsetWidth / this.heightRatio) + "px";
        }

        this.animationConfig['show'].timing.duration = this.transitionDuration;
        this.animationConfig['hide'].timing.duration = this.transitionDuration;

        /**
         * Fire of the loaded event so the Carousel knows this item is loaded
         * @event polymer-carousel-item-loaded
         */
        this.fire("polymer-carousel-item-loaded");
      });
    },
    _imageLoaded: function () {
      if (!this._currentlyHidden && this.imageLoaded && this.link) {
        this.async(function () {
          this.$$('.slide a').setAttribute('tabindex', '0');
        }, 1);
      }
    },
    /**
     * Shows the carousel item
     */
    show: function () {
      this.playAnimation('show', 'show');
    },
    /**
     * Hides the carousel item
     */
    hide: function () {
      this.playAnimation('hide', 'hide');
    },
    /**
     * "Sticks" the state of the carousel item
     * @param e
     * @param animHandler
     * @private
     */
    _onNeonAnimationFinish: function (e, animHandler) {
      this.$.slide.classList.toggle('hidden');
      this._currentlyHidden = (animHandler === 'show' ? false : true);

      if (this.link && this.imageLoaded) {
        this.$$('.slide a').setAttribute('tabindex', (this._currentlyHidden ? '-1' : '0'));
      }
    },
    /**
     * Fires an event
     * @param e
     * @private
     */
    _linkClicked: function () {
      this.fire("polymer-carousel-link-clicked", { "slideNumber": this.slideNumber });
    }
  });
})();