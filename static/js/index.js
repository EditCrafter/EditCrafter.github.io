window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

    var qualitativeResultsOptions = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

    var qualitativeResultsSingleItemOptions = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: false,
			infinite: false,
			autoplay: false,
			autoplaySpeed: 3000,
    }

    function normalizeCarousels(instances) {
      if (!instances) {
        return [];
      }
      return Array.isArray(instances) ? instances : [instances];
    }

    function attachQualitativeResultsCarousels() {
      var elements = Array.prototype.slice.call(document.querySelectorAll('.qualitative-results-carousel-active'));
      var initialized = [];

      elements.forEach(function(element) {
        var slideCount = element.querySelectorAll(':scope > .item').length;
        var carouselOptions = slideCount > 1
          ? qualitativeResultsOptions
          : qualitativeResultsSingleItemOptions;

        initialized = initialized.concat(normalizeCarousels(bulmaCarousel.attach(element, carouselOptions)));
      });

      return initialized;
    }

		// Initialize carousels with section-specific behavior
    var defaultCarousels = normalizeCarousels(bulmaCarousel.attach('.carousel:not(.qualitative-results-carousel)', options));
    var qualitativeResultsCarousels = attachQualitativeResultsCarousels();
    var carousels = defaultCarousels.concat(qualitativeResultsCarousels);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    var overlay = document.getElementById('lightbox-overlay');
    var lightboxGrid = document.getElementById('lightbox-grid');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var lightboxCards = [];
    var lightboxIndex = 0;

    function showLightboxSlide(index) {
      if (index < 0 || index >= lightboxCards.length) return;
      lightboxIndex = index;
      var grid = lightboxCards[index].querySelector('.qualitative-results-card-grid');
      if (!grid) return;
      lightboxGrid.innerHTML = '';
      grid.querySelectorAll('.qualitative-results-panel').forEach(function(fig) {
        var clone = fig.cloneNode(true);
        clone.querySelector('img').style.maxWidth = '100%';
        lightboxGrid.appendChild(clone);
      });
    }

    document.addEventListener('click', function(e) {
      var img = e.target.closest('.qualitative-results-panel img');
      if (!img) return;
      e.stopPropagation();
      var card = img.closest('.qualitative-results-card');
      if (!card) return;
      var carousel = card.closest('.qualitative-results-carousel');
      if (!carousel) return;
      lightboxCards = Array.from(carousel.querySelectorAll('.slider-item .qualitative-results-card'));
      lightboxIndex = lightboxCards.indexOf(card);
      if (lightboxIndex === -1) lightboxIndex = 0;
      showLightboxSlide(lightboxIndex);
      overlay.style.display = '';
      document.body.style.overflow = 'hidden';
    });

    lightboxGrid.addEventListener('mousemove', function(e) {
      var img = e.target.closest('.lightbox-grid img');
      if (!img) return;
      var rect = img.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      lightboxGrid.querySelectorAll('img').forEach(function(i) {
        i.style.transform = 'scale(3)';
        i.style.transformOrigin = x + '% ' + y + '%';
      });
    });

    lightboxGrid.addEventListener('mouseleave', function() {
      lightboxGrid.querySelectorAll('img').forEach(function(i) {
        i.style.transform = '';
        i.style.transformOrigin = '';
      });
    });

    lightboxGrid.addEventListener('mouseout', function(e) {
      if (e.target.tagName === 'IMG') {
        lightboxGrid.querySelectorAll('img').forEach(function(i) {
          i.style.transform = '';
          i.style.transformOrigin = '';
        });
      }
    });

    lightboxPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      if (lightboxIndex > 0) showLightboxSlide(lightboxIndex - 1);
    });

    lightboxNext.addEventListener('click', function(e) {
      e.stopPropagation();
      if (lightboxIndex < lightboxCards.length - 1) showLightboxSlide(lightboxIndex + 1);
    });

    overlay.addEventListener('click', function(e) {
      if (e.target.closest('.lightbox-grid img')) return;
      if (e.target.closest('.lightbox-nav')) return;
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', function(e) {
      if (overlay.style.display === 'none') return;
      if (e.key === 'Escape') {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      } else if (e.key === 'ArrowLeft' && lightboxIndex > 0) {
        showLightboxSlide(lightboxIndex - 1);
      } else if (e.key === 'ArrowRight' && lightboxIndex < lightboxCards.length - 1) {
        showLightboxSlide(lightboxIndex + 1);
      }
    });

})
