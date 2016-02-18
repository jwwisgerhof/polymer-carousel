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
       * Determines whether the carousel item should start of as hidden
       */
      startHidden: {
        type: Object,
        value: true
      },
      /**
       * Used internally to set the "hidden" class
       */
      _hiddenClass: {
        type: String,
        value: ''
      },
      /**
       * Determines if the image has been loaded
       */
      imageLoaded: {
        type: Boolean,
        value: false
      }
    },
    listeners: {
      // this event is fired when the animation finishes
      'neon-animation-finish': '_onNeonAnimationFinish'
    },
    attached: function () {
      if (this.startHidden) {
        this.$.slide.classList.add('hidden');
      }

      this.async(function () {
        if (this.link && this.imageLoaded) {
          this.$$('.slide a').setAttribute('tabindex', '-1');
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

      if (this.link && this.imageLoaded) {
        this.$$('.slide a').setAttribute('tabindex', (animHandler === 'show' ? '0' : '-1'));
      }
    }
  });
})();