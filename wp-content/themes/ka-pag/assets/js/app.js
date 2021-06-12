/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  'use strict';
  var Slick = window.Slick || {};

  Slick = (function () {
    var instanceUid = 0;

    function Slick(element, settings) {
      var _ = this,
        dataSettings;

      _.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow:
          '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function (slider, i) {
          return $('<button type="button" />').text(i + 1);
        },
        dots: false,
        dotsClass: 'slick-dots',
        draggable: true,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: false,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1000,
      };

      _.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false,
      };

      $.extend(_, _.initials);

      _.activeBreakpoint = null;
      _.animType = null;
      _.animProp = null;
      _.breakpoints = [];
      _.breakpointSettings = [];
      _.cssTransitions = false;
      _.focussed = false;
      _.interrupted = false;
      _.hidden = 'hidden';
      _.paused = true;
      _.positionProp = null;
      _.respondTo = null;
      _.rowCount = 1;
      _.shouldClick = true;
      _.$slider = $(element);
      _.$slidesCache = null;
      _.transformType = null;
      _.transitionType = null;
      _.visibilityChange = 'visibilitychange';
      _.windowWidth = 0;
      _.windowTimer = null;

      dataSettings = $(element).data('slick') || {};

      _.options = $.extend({}, _.defaults, settings, dataSettings);

      _.currentSlide = _.options.initialSlide;

      _.originalSettings = _.options;

      if (typeof document.mozHidden !== 'undefined') {
        _.hidden = 'mozHidden';
        _.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        _.hidden = 'webkitHidden';
        _.visibilityChange = 'webkitvisibilitychange';
      }

      _.autoPlay = $.proxy(_.autoPlay, _);
      _.autoPlayClear = $.proxy(_.autoPlayClear, _);
      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
      _.changeSlide = $.proxy(_.changeSlide, _);
      _.clickHandler = $.proxy(_.clickHandler, _);
      _.selectHandler = $.proxy(_.selectHandler, _);
      _.setPosition = $.proxy(_.setPosition, _);
      _.swipeHandler = $.proxy(_.swipeHandler, _);
      _.dragHandler = $.proxy(_.dragHandler, _);
      _.keyHandler = $.proxy(_.keyHandler, _);

      _.instanceUid = instanceUid++;

      // A simple way to check for HTML strings
      // Strict HTML recognition (must start with <)
      // Extracted from jQuery v1.11 source
      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

      _.registerBreakpoints();
      _.init(true);
    }

    return Slick;
  })();

  Slick.prototype.activateADA = function () {
    var _ = this;

    _.$slideTrack
      .find('.slick-active')
      .attr({
        'aria-hidden': 'false',
      })
      .find('a, input, button, select')
      .attr({
        tabindex: '0',
      });
  };

  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (
    markup,
    index,
    addBefore
  ) {
    var _ = this;

    if (typeof index === 'boolean') {
      addBefore = index;
      index = null;
    } else if (index < 0 || index >= _.slideCount) {
      return false;
    }

    _.unload();

    if (typeof index === 'number') {
      if (index === 0 && _.$slides.length === 0) {
        $(markup).appendTo(_.$slideTrack);
      } else if (addBefore) {
        $(markup).insertBefore(_.$slides.eq(index));
      } else {
        $(markup).insertAfter(_.$slides.eq(index));
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(_.$slideTrack);
      } else {
        $(markup).appendTo(_.$slideTrack);
      }
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index);
    });

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.animateHeight = function () {
    var _ = this;
    if (
      _.options.slidesToShow === 1 &&
      _.options.adaptiveHeight === true &&
      _.options.vertical === false
    ) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
      _.$list.animate(
        {
          height: targetHeight,
        },
        _.options.speed
      );
    }
  };

  Slick.prototype.animateSlide = function (targetLeft, callback) {
    var animProps = {},
      _ = this;

    _.animateHeight();

    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft;
    }
    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate(
          {
            left: targetLeft,
          },
          _.options.speed,
          _.options.easing,
          callback
        );
      } else {
        _.$slideTrack.animate(
          {
            top: targetLeft,
          },
          _.options.speed,
          _.options.easing,
          callback
        );
      }
    } else {
      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -_.currentLeft;
        }
        $({
          animStart: _.currentLeft,
        }).animate(
          {
            animStart: targetLeft,
          },
          {
            duration: _.options.speed,
            easing: _.options.easing,
            step: function (now) {
              now = Math.ceil(now);
              if (_.options.vertical === false) {
                animProps[_.animType] = 'translate(' + now + 'px, 0px)';
                _.$slideTrack.css(animProps);
              } else {
                animProps[_.animType] = 'translate(0px,' + now + 'px)';
                _.$slideTrack.css(animProps);
              }
            },
            complete: function () {
              if (callback) {
                callback.call();
              }
            },
          }
        );
      } else {
        _.applyTransition();
        targetLeft = Math.ceil(targetLeft);

        if (_.options.vertical === false) {
          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
        } else {
          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
        }
        _.$slideTrack.css(animProps);

        if (callback) {
          setTimeout(function () {
            _.disableTransition();

            callback.call();
          }, _.options.speed);
        }
      }
    }
  };

  Slick.prototype.getNavTarget = function () {
    var _ = this,
      asNavFor = _.options.asNavFor;

    if (asNavFor && asNavFor !== null) {
      asNavFor = $(asNavFor).not(_.$slider);
    }

    return asNavFor;
  };

  Slick.prototype.asNavFor = function (index) {
    var _ = this,
      asNavFor = _.getNavTarget();

    if (asNavFor !== null && typeof asNavFor === 'object') {
      asNavFor.each(function () {
        var target = $(this).slick('getSlick');
        if (!target.unslicked) {
          target.slideHandler(index, true);
        }
      });
    }
  };

  Slick.prototype.applyTransition = function (slide) {
    var _ = this,
      transition = {};

    if (_.options.fade === false) {
      transition[_.transitionType] =
        _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
    } else {
      transition[_.transitionType] =
        'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
    }

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.autoPlay = function () {
    var _ = this;

    _.autoPlayClear();

    if (_.slideCount > _.options.slidesToShow) {
      _.autoPlayTimer = setInterval(
        _.autoPlayIterator,
        _.options.autoplaySpeed
      );
    }
  };

  Slick.prototype.autoPlayClear = function () {
    var _ = this;

    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }
  };

  Slick.prototype.autoPlayIterator = function () {
    var _ = this,
      slideTo = _.currentSlide + _.options.slidesToScroll;

    if (!_.paused && !_.interrupted && !_.focussed) {
      if (_.options.infinite === false) {
        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
          _.direction = 0;
        } else if (_.direction === 0) {
          slideTo = _.currentSlide - _.options.slidesToScroll;

          if (_.currentSlide - 1 === 0) {
            _.direction = 1;
          }
        }
      }

      _.slideHandler(slideTo);
    }
  };

  Slick.prototype.buildArrows = function () {
    var _ = this;

    if (_.options.arrows === true) {
      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

      if (_.slideCount > _.options.slidesToShow) {
        _.$prevArrow
          .removeClass('slick-hidden')
          .removeAttr('aria-hidden tabindex');
        _.$nextArrow
          .removeClass('slick-hidden')
          .removeAttr('aria-hidden tabindex');

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows);
        }

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows);
        }

        if (_.options.infinite !== true) {
          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        }
      } else {
        _.$prevArrow
          .add(_.$nextArrow)

          .addClass('slick-hidden')
          .attr({
            'aria-disabled': 'true',
            tabindex: '-1',
          });
      }
    }
  };

  Slick.prototype.buildDots = function () {
    var _ = this,
      i,
      dot;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$slider.addClass('slick-dotted');

      dot = $('<ul />').addClass(_.options.dotsClass);

      for (i = 0; i <= _.getDotCount(); i += 1) {
        dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
      }

      _.$dots = dot.appendTo(_.options.appendDots);

      _.$dots.find('li').first().addClass('slick-active');
    }
  };

  Slick.prototype.buildOut = function () {
    var _ = this;

    _.$slides = _.$slider
      .children(_.options.slide + ':not(.slick-cloned)')
      .addClass('slick-slide');

    _.slideCount = _.$slides.length;

    _.$slides.each(function (index, element) {
      $(element)
        .attr('data-slick-index', index)
        .data('originalStyling', $(element).attr('style') || '');
    });

    _.$slider.addClass('slick-slider');

    _.$slideTrack =
      _.slideCount === 0
        ? $('<div class="slick-track"/>').appendTo(_.$slider)
        : _.$slides.wrapAll('<div class="slick-track"/>').parent();

    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();
    _.$slideTrack.css('opacity', 0);

    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1;
    }

    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

    _.setupInfinite();

    _.buildArrows();

    _.buildDots();

    _.updateDots();

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    if (_.options.draggable === true) {
      _.$list.addClass('draggable');
    }
  };

  Slick.prototype.buildRows = function () {
    var _ = this,
      a,
      b,
      c,
      newSlides,
      numOfSlides,
      originalSlides,
      slidesPerSection;

    newSlides = document.createDocumentFragment();
    originalSlides = _.$slider.children();

    if (_.options.rows > 0) {
      slidesPerSection = _.options.slidesPerRow * _.options.rows;
      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement('div');
        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement('div');
          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target =
              a * slidesPerSection + (b * _.options.slidesPerRow + c);
            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }
          slide.appendChild(row);
        }
        newSlides.appendChild(slide);
      }

      _.$slider.empty().append(newSlides);
      _.$slider
        .children()
        .children()
        .children()
        .css({
          width: 100 / _.options.slidesPerRow + '%',
          display: 'inline-block',
        });
    }
  };

  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
    var _ = this,
      breakpoint,
      targetBreakpoint,
      respondToWidth,
      triggerBreakpoint = false;
    var sliderWidth = _.$slider.width();
    var windowWidth = window.innerWidth || $(window).width();

    if (_.respondTo === 'window') {
      respondToWidth = windowWidth;
    } else if (_.respondTo === 'slider') {
      respondToWidth = sliderWidth;
    } else if (_.respondTo === 'min') {
      respondToWidth = Math.min(windowWidth, sliderWidth);
    }

    if (
      _.options.responsive &&
      _.options.responsive.length &&
      _.options.responsive !== null
    ) {
      targetBreakpoint = null;

      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (_.originalSettings.mobileFirst === false) {
            if (respondToWidth < _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          } else {
            if (respondToWidth > _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          }
        }
      }

      if (targetBreakpoint !== null) {
        if (_.activeBreakpoint !== null) {
          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
            _.activeBreakpoint = targetBreakpoint;
            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
              _.unslick(targetBreakpoint);
            } else {
              _.options = $.extend(
                {},
                _.originalSettings,
                _.breakpointSettings[targetBreakpoint]
              );
              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }
              _.refresh(initial);
            }
            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          _.activeBreakpoint = targetBreakpoint;
          if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
            _.unslick(targetBreakpoint);
          } else {
            _.options = $.extend(
              {},
              _.originalSettings,
              _.breakpointSettings[targetBreakpoint]
            );
            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }
            _.refresh(initial);
          }
          triggerBreakpoint = targetBreakpoint;
        }
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          _.options = _.originalSettings;
          if (initial === true) {
            _.currentSlide = _.options.initialSlide;
          }
          _.refresh(initial);
          triggerBreakpoint = targetBreakpoint;
        }
      }

      // only trigger breakpoints during an actual break. not on initialize.
      if (!initial && triggerBreakpoint !== false) {
        _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
      }
    }
  };

  Slick.prototype.changeSlide = function (event, dontAnimate) {
    var _ = this,
      $target = $(event.currentTarget),
      indexOffset,
      slideOffset,
      unevenOffset;

    // If target is a link, prevent default action.
    if ($target.is('a')) {
      event.preventDefault();
    }

    // If target is not the <li> element (ie: a child), find the <li>.
    if (!$target.is('li')) {
      $target = $target.closest('li');
    }

    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
    indexOffset = unevenOffset
      ? 0
      : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

    switch (event.data.message) {
      case 'previous':
        slideOffset =
          indexOffset === 0
            ? _.options.slidesToScroll
            : _.options.slidesToShow - indexOffset;
        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
        }
        break;

      case 'next':
        slideOffset =
          indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
        }
        break;

      case 'index':
        var index =
          event.data.index === 0
            ? 0
            : event.data.index || $target.index() * _.options.slidesToScroll;

        _.slideHandler(_.checkNavigable(index), false, dontAnimate);
        $target.children().trigger('focus');
        break;

      default:
        return;
    }
  };

  Slick.prototype.checkNavigable = function (index) {
    var _ = this,
      navigables,
      prevNavigable;

    navigables = _.getNavigableIndexes();
    prevNavigable = 0;
    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }
        prevNavigable = navigables[n];
      }
    }

    return index;
  };

  Slick.prototype.cleanUpEvents = function () {
    var _ = this;

    if (_.options.dots && _.$dots !== null) {
      $('li', _.$dots)
        .off('click.slick', _.changeSlide)
        .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
        .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

      if (_.options.accessibility === true) {
        _.$dots.off('keydown.slick', _.keyHandler);
      }
    }

    _.$slider.off('focus.slick blur.slick');

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
      _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
        _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
      }
    }

    _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
    _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
    _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
    _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

    _.$list.off('click.slick', _.clickHandler);

    $(document).off(_.visibilityChange, _.visibility);

    _.cleanUpSlideEvents();

    if (_.options.accessibility === true) {
      _.$list.off('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().off('click.slick', _.selectHandler);
    }

    $(window).off(
      'orientationchange.slick.slick-' + _.instanceUid,
      _.orientationChange
    );

    $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

    $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

    $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
  };

  Slick.prototype.cleanUpSlideEvents = function () {
    var _ = this;

    _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
    _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
  };

  Slick.prototype.cleanUpRows = function () {
    var _ = this,
      originalSlides;

    if (_.options.rows > 0) {
      originalSlides = _.$slides.children().children();
      originalSlides.removeAttr('style');
      _.$slider.empty().append(originalSlides);
    }
  };

  Slick.prototype.clickHandler = function (event) {
    var _ = this;

    if (_.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  Slick.prototype.destroy = function (refresh) {
    var _ = this;

    _.autoPlayClear();

    _.touchObject = {};

    _.cleanUpEvents();

    $('.slick-cloned', _.$slider).detach();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.$prevArrow.length) {
      _.$prevArrow
        .removeClass('slick-disabled slick-arrow slick-hidden')
        .removeAttr('aria-hidden aria-disabled tabindex')
        .css('display', '');

      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }
    }

    if (_.$nextArrow && _.$nextArrow.length) {
      _.$nextArrow
        .removeClass('slick-disabled slick-arrow slick-hidden')
        .removeAttr('aria-hidden aria-disabled tabindex')
        .css('display', '');

      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }
    }

    if (_.$slides) {
      _.$slides
        .removeClass(
          'slick-slide slick-active slick-center slick-visible slick-current'
        )
        .removeAttr('aria-hidden')
        .removeAttr('data-slick-index')
        .each(function () {
          $(this).attr('style', $(this).data('originalStyling'));
        });

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.detach();

      _.$list.detach();

      _.$slider.append(_.$slides);
    }

    _.cleanUpRows();

    _.$slider.removeClass('slick-slider');
    _.$slider.removeClass('slick-initialized');
    _.$slider.removeClass('slick-dotted');

    _.unslicked = true;

    if (!refresh) {
      _.$slider.trigger('destroy', [_]);
    }
  };

  Slick.prototype.disableTransition = function (slide) {
    var _ = this,
      transition = {};

    transition[_.transitionType] = '';

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.fadeSlide = function (slideIndex, callback) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).css({
        zIndex: _.options.zIndex,
      });

      _.$slides.eq(slideIndex).animate(
        {
          opacity: 1,
        },
        _.options.speed,
        _.options.easing,
        callback
      );
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 1,
        zIndex: _.options.zIndex,
      });

      if (callback) {
        setTimeout(function () {
          _.disableTransition(slideIndex);

          callback.call();
        }, _.options.speed);
      }
    }
  };

  Slick.prototype.fadeSlideOut = function (slideIndex) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).animate(
        {
          opacity: 0,
          zIndex: _.options.zIndex - 2,
        },
        _.options.speed,
        _.options.easing
      );
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 0,
        zIndex: _.options.zIndex - 2,
      });
    }
  };

  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (
    filter
  ) {
    var _ = this;

    if (filter !== null) {
      _.$slidesCache = _.$slides;

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.focusHandler = function () {
    var _ = this;

    _.$slider
      .off('focus.slick blur.slick')
      .on('focus.slick blur.slick', '*', function (event) {
        event.stopImmediatePropagation();
        var $sf = $(this);

        setTimeout(function () {
          if (_.options.pauseOnFocus) {
            _.focussed = $sf.is(':focus');
            _.autoPlay();
          }
        }, 0);
      });
  };

  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
    var _ = this;
    return _.currentSlide;
  };

  Slick.prototype.getDotCount = function () {
    var _ = this;

    var breakPoint = 0;
    var counter = 0;
    var pagerQty = 0;

    if (_.options.infinite === true) {
      if (_.slideCount <= _.options.slidesToShow) {
        ++pagerQty;
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty;
          breakPoint = counter + _.options.slidesToScroll;
          counter +=
            _.options.slidesToScroll <= _.options.slidesToShow
              ? _.options.slidesToScroll
              : _.options.slidesToShow;
        }
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount;
    } else if (!_.options.asNavFor) {
      pagerQty =
        1 +
        Math.ceil(
          (_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll
        );
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter +=
          _.options.slidesToScroll <= _.options.slidesToShow
            ? _.options.slidesToScroll
            : _.options.slidesToShow;
      }
    }

    return pagerQty - 1;
  };

  Slick.prototype.getLeft = function (slideIndex) {
    var _ = this,
      targetLeft,
      verticalHeight,
      verticalOffset = 0,
      targetSlide,
      coef;

    _.slideOffset = 0;
    verticalHeight = _.$slides.first().outerHeight(true);

    if (_.options.infinite === true) {
      if (_.slideCount > _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
        coef = -1;

        if (_.options.vertical === true && _.options.centerMode === true) {
          if (_.options.slidesToShow === 2) {
            coef = -1.5;
          } else if (_.options.slidesToShow === 1) {
            coef = -2;
          }
        }
        verticalOffset = verticalHeight * _.options.slidesToShow * coef;
      }
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        if (
          slideIndex + _.options.slidesToScroll > _.slideCount &&
          _.slideCount > _.options.slidesToShow
        ) {
          if (slideIndex > _.slideCount) {
            _.slideOffset =
              (_.options.slidesToShow - (slideIndex - _.slideCount)) *
              _.slideWidth *
              -1;
            verticalOffset =
              (_.options.slidesToShow - (slideIndex - _.slideCount)) *
              verticalHeight *
              -1;
          } else {
            _.slideOffset =
              (_.slideCount % _.options.slidesToScroll) * _.slideWidth * -1;
            verticalOffset =
              (_.slideCount % _.options.slidesToScroll) * verticalHeight * -1;
          }
        }
      }
    } else {
      if (slideIndex + _.options.slidesToShow > _.slideCount) {
        _.slideOffset =
          (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
        verticalOffset =
          (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
      }
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideOffset = 0;
      verticalOffset = 0;
    }

    if (
      _.options.centerMode === true &&
      _.slideCount <= _.options.slidesToShow
    ) {
      _.slideOffset =
        (_.slideWidth * Math.floor(_.options.slidesToShow)) / 2 -
        (_.slideWidth * _.slideCount) / 2;
    } else if (_.options.centerMode === true && _.options.infinite === true) {
      _.slideOffset +=
        _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
    } else if (_.options.centerMode === true) {
      _.slideOffset = 0;
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
    }

    if (_.options.vertical === false) {
      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (_.options.variableWidth === true) {
      if (
        _.slideCount <= _.options.slidesToShow ||
        _.options.infinite === false
      ) {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
      } else {
        targetSlide = _.$slideTrack
          .children('.slick-slide')
          .eq(slideIndex + _.options.slidesToShow);
      }

      if (_.options.rtl === true) {
        if (targetSlide[0]) {
          targetLeft =
            (_.$slideTrack.width() -
              targetSlide[0].offsetLeft -
              targetSlide.width()) *
            -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
      }

      if (_.options.centerMode === true) {
        if (
          _.slideCount <= _.options.slidesToShow ||
          _.options.infinite === false
        ) {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
        } else {
          targetSlide = _.$slideTrack
            .children('.slick-slide')
            .eq(slideIndex + _.options.slidesToShow + 1);
        }

        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft =
              (_.$slideTrack.width() -
                targetSlide[0].offsetLeft -
                targetSlide.width()) *
              -1;
          } else {
            targetLeft = 0;
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        }

        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
      }
    }

    return targetLeft;
  };

  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (
    option
  ) {
    var _ = this;

    return _.options[option];
  };

  Slick.prototype.getNavigableIndexes = function () {
    var _ = this,
      breakPoint = 0,
      counter = 0,
      indexes = [],
      max;

    if (_.options.infinite === false) {
      max = _.slideCount;
    } else {
      breakPoint = _.options.slidesToScroll * -1;
      counter = _.options.slidesToScroll * -1;
      max = _.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + _.options.slidesToScroll;
      counter +=
        _.options.slidesToScroll <= _.options.slidesToShow
          ? _.options.slidesToScroll
          : _.options.slidesToShow;
    }

    return indexes;
  };

  Slick.prototype.getSlick = function () {
    return this;
  };

  Slick.prototype.getSlideCount = function () {
    var _ = this,
      slidesTraversed,
      swipedSlide,
      centerOffset;

    centerOffset =
      _.options.centerMode === true
        ? _.slideWidth * Math.floor(_.options.slidesToShow / 2)
        : 0;

    if (_.options.swipeToSlide === true) {
      _.$slideTrack.find('.slick-slide').each(function (index, slide) {
        if (
          slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 >
          _.swipeLeft * -1
        ) {
          swipedSlide = slide;
          return false;
        }
      });

      slidesTraversed =
        Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

      return slidesTraversed;
    } else {
      return _.options.slidesToScroll;
    }
  };

  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (
    slide,
    dontAnimate
  ) {
    var _ = this;

    _.changeSlide(
      {
        data: {
          message: 'index',
          index: parseInt(slide),
        },
      },
      dontAnimate
    );
  };

  Slick.prototype.init = function (creation) {
    var _ = this;

    if (!$(_.$slider).hasClass('slick-initialized')) {
      $(_.$slider).addClass('slick-initialized');

      _.buildRows();
      _.buildOut();
      _.setProps();
      _.startLoad();
      _.loadSlider();
      _.initializeEvents();
      _.updateArrows();
      _.updateDots();
      _.checkResponsive(true);
      _.focusHandler();
    }

    if (creation) {
      _.$slider.trigger('init', [_]);
    }

    if (_.options.accessibility === true) {
      _.initADA();
    }

    if (_.options.autoplay) {
      _.paused = false;
      _.autoPlay();
    }
  };

  Slick.prototype.initADA = function () {
    var _ = this,
      numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
      tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
        return val >= 0 && val < _.slideCount;
      });

    _.$slides
      .add(_.$slideTrack.find('.slick-cloned'))
      .attr({
        'aria-hidden': 'true',
        tabindex: '-1',
      })
      .find('a, input, button, select')
      .attr({
        tabindex: '-1',
      });

    if (_.$dots !== null) {
      _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
        var slideControlIndex = tabControlIndexes.indexOf(i);

        $(this).attr({
          role: 'tabpanel',
          id: 'slick-slide' + _.instanceUid + i,
          tabindex: -1,
        });

        if (slideControlIndex !== -1) {
          var ariaButtonControl =
            'slick-slide-control' + _.instanceUid + slideControlIndex;
          if ($('#' + ariaButtonControl).length) {
            $(this).attr({
              'aria-describedby': ariaButtonControl,
            });
          }
        }
      });

      _.$dots
        .attr('role', 'tablist')
        .find('li')
        .each(function (i) {
          var mappedSlideIndex = tabControlIndexes[i];

          $(this).attr({
            role: 'presentation',
          });

          $(this)
            .find('button')
            .first()
            .attr({
              role: 'tab',
              id: 'slick-slide-control' + _.instanceUid + i,
              'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
              'aria-label': i + 1 + ' of ' + numDotGroups,
              'aria-selected': null,
              tabindex: '-1',
            });
        })
        .eq(_.currentSlide)
        .find('button')
        .attr({
          'aria-selected': 'true',
          tabindex: '0',
        })
        .end();
    }

    for (
      var i = _.currentSlide, max = i + _.options.slidesToShow;
      i < max;
      i++
    ) {
      if (_.options.focusOnChange) {
        _.$slides.eq(i).attr({ tabindex: '0' });
      } else {
        _.$slides.eq(i).removeAttr('tabindex');
      }
    }

    _.activateADA();
  };

  Slick.prototype.initArrowEvents = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.off('click.slick').on(
        'click.slick',
        {
          message: 'previous',
        },
        _.changeSlide
      );
      _.$nextArrow.off('click.slick').on(
        'click.slick',
        {
          message: 'next',
        },
        _.changeSlide
      );

      if (_.options.accessibility === true) {
        _.$prevArrow.on('keydown.slick', _.keyHandler);
        _.$nextArrow.on('keydown.slick', _.keyHandler);
      }
    }
  };

  Slick.prototype.initDotEvents = function () {
    var _ = this;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on(
        'click.slick',
        {
          message: 'index',
        },
        _.changeSlide
      );

      if (_.options.accessibility === true) {
        _.$dots.on('keydown.slick', _.keyHandler);
      }
    }

    if (
      _.options.dots === true &&
      _.options.pauseOnDotsHover === true &&
      _.slideCount > _.options.slidesToShow
    ) {
      $('li', _.$dots)
        .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
        .on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initSlideEvents = function () {
    var _ = this;

    if (_.options.pauseOnHover) {
      _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
      _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initializeEvents = function () {
    var _ = this;

    _.initArrowEvents();

    _.initDotEvents();
    _.initSlideEvents();

    _.$list.on(
      'touchstart.slick mousedown.slick',
      {
        action: 'start',
      },
      _.swipeHandler
    );
    _.$list.on(
      'touchmove.slick mousemove.slick',
      {
        action: 'move',
      },
      _.swipeHandler
    );
    _.$list.on(
      'touchend.slick mouseup.slick',
      {
        action: 'end',
      },
      _.swipeHandler
    );
    _.$list.on(
      'touchcancel.slick mouseleave.slick',
      {
        action: 'end',
      },
      _.swipeHandler
    );

    _.$list.on('click.slick', _.clickHandler);

    $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

    if (_.options.accessibility === true) {
      _.$list.on('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    $(window).on(
      'orientationchange.slick.slick-' + _.instanceUid,
      $.proxy(_.orientationChange, _)
    );

    $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

    $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

    $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
    $(_.setPosition);
  };

  Slick.prototype.initUI = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.show();
      _.$nextArrow.show();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.show();
    }
  };

  Slick.prototype.keyHandler = function (event) {
    var _ = this;
    //Dont slide if the cursor is inside the form fields and arrow keys are pressed
    if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (event.keyCode === 37 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'next' : 'previous',
          },
        });
      } else if (event.keyCode === 39 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'previous' : 'next',
          },
        });
      }
    }
  };

  Slick.prototype.lazyLoad = function () {
    var _ = this,
      loadRange,
      cloneRange,
      rangeStart,
      rangeEnd;

    function loadImages(imagesScope) {
      $('img[data-lazy]', imagesScope).each(function () {
        var image = $(this),
          imageSource = $(this).attr('data-lazy'),
          imageSrcSet = $(this).attr('data-srcset'),
          imageSizes =
            $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
          imageToLoad = document.createElement('img');

        imageToLoad.onload = function () {
          image.animate({ opacity: 0 }, 100, function () {
            if (imageSrcSet) {
              image.attr('srcset', imageSrcSet);

              if (imageSizes) {
                image.attr('sizes', imageSizes);
              }
            }

            image
              .attr('src', imageSource)
              .animate({ opacity: 1 }, 200, function () {
                image
                  .removeAttr('data-lazy data-srcset data-sizes')
                  .removeClass('slick-loading');
              });
            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
          });
        };

        imageToLoad.onerror = function () {
          image
            .removeAttr('data-lazy')
            .removeClass('slick-loading')
            .addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
        };

        imageToLoad.src = imageSource;
      });
    }

    if (_.options.centerMode === true) {
      if (_.options.infinite === true) {
        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
        rangeEnd = rangeStart + _.options.slidesToShow + 2;
      } else {
        rangeStart = Math.max(
          0,
          _.currentSlide - (_.options.slidesToShow / 2 + 1)
        );
        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
      }
    } else {
      rangeStart = _.options.infinite
        ? _.options.slidesToShow + _.currentSlide
        : _.currentSlide;
      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
      if (_.options.fade === true) {
        if (rangeStart > 0) rangeStart--;
        if (rangeEnd <= _.slideCount) rangeEnd++;
      }
    }

    loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

    if (_.options.lazyLoad === 'anticipated') {
      var prevSlide = rangeStart - 1,
        nextSlide = rangeEnd,
        $slides = _.$slider.find('.slick-slide');

      for (var i = 0; i < _.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = _.slideCount - 1;
        loadRange = loadRange.add($slides.eq(prevSlide));
        loadRange = loadRange.add($slides.eq(nextSlide));
        prevSlide--;
        nextSlide++;
      }
    }

    loadImages(loadRange);

    if (_.slideCount <= _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-slide');
      loadImages(cloneRange);
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
      cloneRange = _.$slider
        .find('.slick-cloned')
        .slice(0, _.options.slidesToShow);
      loadImages(cloneRange);
    } else if (_.currentSlide === 0) {
      cloneRange = _.$slider
        .find('.slick-cloned')
        .slice(_.options.slidesToShow * -1);
      loadImages(cloneRange);
    }
  };

  Slick.prototype.loadSlider = function () {
    var _ = this;

    _.setPosition();

    _.$slideTrack.css({
      opacity: 1,
    });

    _.$slider.removeClass('slick-loading');

    _.initUI();

    if (_.options.lazyLoad === 'progressive') {
      _.progressiveLazyLoad();
    }
  };

  Slick.prototype.next = Slick.prototype.slickNext = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'next',
      },
    });
  };

  Slick.prototype.orientationChange = function () {
    var _ = this;

    _.checkResponsive();
    _.setPosition();
  };

  Slick.prototype.pause = Slick.prototype.slickPause = function () {
    var _ = this;

    _.autoPlayClear();
    _.paused = true;
  };

  Slick.prototype.play = Slick.prototype.slickPlay = function () {
    var _ = this;

    _.autoPlay();
    _.options.autoplay = true;
    _.paused = false;
    _.focussed = false;
    _.interrupted = false;
  };

  Slick.prototype.postSlide = function (index) {
    var _ = this;

    if (!_.unslicked) {
      _.$slider.trigger('afterChange', [_, index]);

      _.animating = false;

      if (_.slideCount > _.options.slidesToShow) {
        _.setPosition();
      }

      _.swipeLeft = null;

      if (_.options.autoplay) {
        _.autoPlay();
      }

      if (_.options.accessibility === true) {
        _.initADA();

        if (_.options.focusOnChange) {
          var $currentSlide = $(_.$slides.get(_.currentSlide));
          $currentSlide.attr('tabindex', 0).focus();
        }
      }
    }
  };

  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'previous',
      },
    });
  };

  Slick.prototype.preventDefault = function (event) {
    event.preventDefault();
  };

  Slick.prototype.progressiveLazyLoad = function (tryCount) {
    tryCount = tryCount || 1;

    var _ = this,
      $imgsToLoad = $('img[data-lazy]', _.$slider),
      image,
      imageSource,
      imageSrcSet,
      imageSizes,
      imageToLoad;

    if ($imgsToLoad.length) {
      image = $imgsToLoad.first();
      imageSource = image.attr('data-lazy');
      imageSrcSet = image.attr('data-srcset');
      imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
      imageToLoad = document.createElement('img');

      imageToLoad.onload = function () {
        if (imageSrcSet) {
          image.attr('srcset', imageSrcSet);

          if (imageSizes) {
            image.attr('sizes', imageSizes);
          }
        }

        image
          .attr('src', imageSource)
          .removeAttr('data-lazy data-srcset data-sizes')
          .removeClass('slick-loading');

        if (_.options.adaptiveHeight === true) {
          _.setPosition();
        }

        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
        _.progressiveLazyLoad();
      };

      imageToLoad.onerror = function () {
        if (tryCount < 3) {
          /**
           * try to load the image 3 times,
           * leave a slight delay so we don't get
           * servers blocking the request.
           */
          setTimeout(function () {
            _.progressiveLazyLoad(tryCount + 1);
          }, 500);
        } else {
          image
            .removeAttr('data-lazy')
            .removeClass('slick-loading')
            .addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

          _.progressiveLazyLoad();
        }
      };

      imageToLoad.src = imageSource;
    } else {
      _.$slider.trigger('allImagesLoaded', [_]);
    }
  };

  Slick.prototype.refresh = function (initializing) {
    var _ = this,
      currentSlide,
      lastVisibleIndex;

    lastVisibleIndex = _.slideCount - _.options.slidesToShow;

    // in non-infinite sliders, we don't want to go past the
    // last visible index.
    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
      _.currentSlide = lastVisibleIndex;
    }

    // if less slides than to show, go to start.
    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    currentSlide = _.currentSlide;

    _.destroy(true);

    $.extend(_, _.initials, { currentSlide: currentSlide });

    _.init();

    if (!initializing) {
      _.changeSlide(
        {
          data: {
            message: 'index',
            index: currentSlide,
          },
        },
        false
      );
    }
  };

  Slick.prototype.registerBreakpoints = function () {
    var _ = this,
      breakpoint,
      currentBreakpoint,
      l,
      responsiveSettings = _.options.responsive || null;

    if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
      _.respondTo = _.options.respondTo || 'window';

      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

          // loop through the breakpoints and cut out any existing
          // ones with the same breakpoint number, we don't want dupes.
          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }
            l--;
          }

          _.breakpoints.push(currentBreakpoint);
          _.breakpointSettings[currentBreakpoint] =
            responsiveSettings[breakpoint].settings;
        }
      }

      _.breakpoints.sort(function (a, b) {
        return _.options.mobileFirst ? a - b : b - a;
      });
    }
  };

  Slick.prototype.reinit = function () {
    var _ = this;

    _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');

    _.slideCount = _.$slides.length;

    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    _.registerBreakpoints();

    _.setProps();
    _.setupInfinite();
    _.buildArrows();
    _.updateArrows();
    _.initArrowEvents();
    _.buildDots();
    _.updateDots();
    _.initDotEvents();
    _.cleanUpSlideEvents();
    _.initSlideEvents();

    _.checkResponsive(false, true);

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    _.setPosition();
    _.focusHandler();

    _.paused = !_.options.autoplay;
    _.autoPlay();

    _.$slider.trigger('reInit', [_]);
  };

  Slick.prototype.resize = function () {
    var _ = this;

    if ($(window).width() !== _.windowWidth) {
      clearTimeout(_.windowDelay);
      _.windowDelay = window.setTimeout(function () {
        _.windowWidth = $(window).width();
        _.checkResponsive();
        if (!_.unslicked) {
          _.setPosition();
        }
      }, 50);
    }
  };

  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (
    index,
    removeBefore,
    removeAll
  ) {
    var _ = this;

    if (typeof index === 'boolean') {
      removeBefore = index;
      index = removeBefore === true ? 0 : _.slideCount - 1;
    } else {
      index = removeBefore === true ? --index : index;
    }

    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
      return false;
    }

    _.unload();

    if (removeAll === true) {
      _.$slideTrack.children().remove();
    } else {
      _.$slideTrack.children(this.options.slide).eq(index).remove();
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.setCSS = function (position) {
    var _ = this,
      positionProps = {},
      x,
      y;

    if (_.options.rtl === true) {
      position = -position;
    }
    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

    positionProps[_.positionProp] = position;

    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps);
    } else {
      positionProps = {};
      if (_.cssTransitions === false) {
        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
        _.$slideTrack.css(positionProps);
      } else {
        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
        _.$slideTrack.css(positionProps);
      }
    }
  };

  Slick.prototype.setDimensions = function () {
    var _ = this;

    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: '0px ' + _.options.centerPadding,
        });
      }
    } else {
      _.$list.height(
        _.$slides.first().outerHeight(true) * _.options.slidesToShow
      );
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: _.options.centerPadding + ' 0px',
        });
      }
    }

    _.listWidth = _.$list.width();
    _.listHeight = _.$list.height();

    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
      _.$slideTrack.width(
        Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length)
      );
    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5000 * _.slideCount);
    } else {
      _.slideWidth = Math.ceil(_.listWidth);
      _.$slideTrack.height(
        Math.ceil(
          _.$slides.first().outerHeight(true) *
            _.$slideTrack.children('.slick-slide').length
        )
      );
    }

    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
    if (_.options.variableWidth === false)
      _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
  };

  Slick.prototype.setFade = function () {
    var _ = this,
      targetLeft;

    _.$slides.each(function (index, element) {
      targetLeft = _.slideWidth * index * -1;
      if (_.options.rtl === true) {
        $(element).css({
          position: 'relative',
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0,
        });
      } else {
        $(element).css({
          position: 'relative',
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0,
        });
      }
    });

    _.$slides.eq(_.currentSlide).css({
      zIndex: _.options.zIndex - 1,
      opacity: 1,
    });
  };

  Slick.prototype.setHeight = function () {
    var _ = this;

    if (
      _.options.slidesToShow === 1 &&
      _.options.adaptiveHeight === true &&
      _.options.vertical === false
    ) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
      _.$list.css('height', targetHeight);
    }
  };

  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
    /**
     * accepts arguments in format of:
     *
     *  - for changing a single option's value:
     *     .slick("setOption", option, value, refresh )
     *
     *  - for changing a set of responsive options:
     *     .slick("setOption", 'responsive', [{}, ...], refresh )
     *
     *  - for updating multiple values at once (not responsive)
     *     .slick("setOption", { 'option': value, ... }, refresh )
     */

    var _ = this,
      l,
      item,
      option,
      value,
      refresh = false,
      type;

    if ($.type(arguments[0]) === 'object') {
      option = arguments[0];
      refresh = arguments[1];
      type = 'multiple';
    } else if ($.type(arguments[0]) === 'string') {
      option = arguments[0];
      value = arguments[1];
      refresh = arguments[2];

      if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
        type = 'responsive';
      } else if (typeof arguments[1] !== 'undefined') {
        type = 'single';
      }
    }

    if (type === 'single') {
      _.options[option] = value;
    } else if (type === 'multiple') {
      $.each(option, function (opt, val) {
        _.options[opt] = val;
      });
    } else if (type === 'responsive') {
      for (item in value) {
        if ($.type(_.options.responsive) !== 'array') {
          _.options.responsive = [value[item]];
        } else {
          l = _.options.responsive.length - 1;

          // loop through the responsive object and splice out duplicates.
          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1);
            }

            l--;
          }

          _.options.responsive.push(value[item]);
        }
      }
    }

    if (refresh) {
      _.unload();
      _.reinit();
    }
  };

  Slick.prototype.setPosition = function () {
    var _ = this;

    _.setDimensions();

    _.setHeight();

    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide));
    } else {
      _.setFade();
    }

    _.$slider.trigger('setPosition', [_]);
  };

  Slick.prototype.setProps = function () {
    var _ = this,
      bodyStyle = document.body.style;

    _.positionProp = _.options.vertical === true ? 'top' : 'left';

    if (_.positionProp === 'top') {
      _.$slider.addClass('slick-vertical');
    } else {
      _.$slider.removeClass('slick-vertical');
    }

    if (
      bodyStyle.WebkitTransition !== undefined ||
      bodyStyle.MozTransition !== undefined ||
      bodyStyle.msTransition !== undefined
    ) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true;
      }
    }

    if (_.options.fade) {
      if (typeof _.options.zIndex === 'number') {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3;
        }
      } else {
        _.options.zIndex = _.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      _.animType = 'OTransform';
      _.transformType = '-o-transform';
      _.transitionType = 'OTransition';
      if (
        bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.webkitPerspective === undefined
      )
        _.animType = false;
    }
    if (bodyStyle.MozTransform !== undefined) {
      _.animType = 'MozTransform';
      _.transformType = '-moz-transform';
      _.transitionType = 'MozTransition';
      if (
        bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.MozPerspective === undefined
      )
        _.animType = false;
    }
    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = 'webkitTransform';
      _.transformType = '-webkit-transform';
      _.transitionType = 'webkitTransition';
      if (
        bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.webkitPerspective === undefined
      )
        _.animType = false;
    }
    if (bodyStyle.msTransform !== undefined) {
      _.animType = 'msTransform';
      _.transformType = '-ms-transform';
      _.transitionType = 'msTransition';
      if (bodyStyle.msTransform === undefined) _.animType = false;
    }
    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = 'transform';
      _.transformType = 'transform';
      _.transitionType = 'transition';
    }
    _.transformsEnabled =
      _.options.useTransform && _.animType !== null && _.animType !== false;
  };

  Slick.prototype.setSlideClasses = function (index) {
    var _ = this,
      centerOffset,
      allSlides,
      indexOffset,
      remainder;

    allSlides = _.$slider
      .find('.slick-slide')
      .removeClass('slick-active slick-center slick-current')
      .attr('aria-hidden', 'true');

    _.$slides.eq(index).addClass('slick-current');

    if (_.options.centerMode === true) {
      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.infinite === true) {
        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
          _.$slides
            .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
            .addClass('slick-active')
            .attr('aria-hidden', 'false');
        } else {
          indexOffset = _.options.slidesToShow + index;
          allSlides
            .slice(
              indexOffset - centerOffset + 1 + evenCoef,
              indexOffset + centerOffset + 2
            )
            .addClass('slick-active')
            .attr('aria-hidden', 'false');
        }

        if (index === 0) {
          allSlides
            .eq(allSlides.length - 1 - _.options.slidesToShow)
            .addClass('slick-center');
        } else if (index === _.slideCount - 1) {
          allSlides.eq(_.options.slidesToShow).addClass('slick-center');
        }
      }

      _.$slides.eq(index).addClass('slick-center');
    } else {
      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
        _.$slides
          .slice(index, index + _.options.slidesToShow)
          .addClass('slick-active')
          .attr('aria-hidden', 'false');
      } else if (allSlides.length <= _.options.slidesToShow) {
        allSlides.addClass('slick-active').attr('aria-hidden', 'false');
      } else {
        remainder = _.slideCount % _.options.slidesToShow;
        indexOffset =
          _.options.infinite === true ? _.options.slidesToShow + index : index;

        if (
          _.options.slidesToShow == _.options.slidesToScroll &&
          _.slideCount - index < _.options.slidesToShow
        ) {
          allSlides
            .slice(
              indexOffset - (_.options.slidesToShow - remainder),
              indexOffset + remainder
            )
            .addClass('slick-active')
            .attr('aria-hidden', 'false');
        } else {
          allSlides
            .slice(indexOffset, indexOffset + _.options.slidesToShow)
            .addClass('slick-active')
            .attr('aria-hidden', 'false');
        }
      }
    }

    if (
      _.options.lazyLoad === 'ondemand' ||
      _.options.lazyLoad === 'anticipated'
    ) {
      _.lazyLoad();
    }
  };

  Slick.prototype.setupInfinite = function () {
    var _ = this,
      i,
      slideIndex,
      infiniteCount;

    if (_.options.fade === true) {
      _.options.centerMode = false;
    }

    if (_.options.infinite === true && _.options.fade === false) {
      slideIndex = null;

      if (_.slideCount > _.options.slidesToShow) {
        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1;
        } else {
          infiniteCount = _.options.slidesToShow;
        }

        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
          slideIndex = i - 1;
          $(_.$slides[slideIndex])
            .clone(true)
            .attr('id', '')
            .attr('data-slick-index', slideIndex - _.slideCount)
            .prependTo(_.$slideTrack)
            .addClass('slick-cloned');
        }
        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
          slideIndex = i;
          $(_.$slides[slideIndex])
            .clone(true)
            .attr('id', '')
            .attr('data-slick-index', slideIndex + _.slideCount)
            .appendTo(_.$slideTrack)
            .addClass('slick-cloned');
        }
        _.$slideTrack
          .find('.slick-cloned')
          .find('[id]')
          .each(function () {
            $(this).attr('id', '');
          });
      }
    }
  };

  Slick.prototype.interrupt = function (toggle) {
    var _ = this;

    if (!toggle) {
      _.autoPlay();
    }
    _.interrupted = toggle;
  };

  Slick.prototype.selectHandler = function (event) {
    var _ = this;

    var targetElement = $(event.target).is('.slick-slide')
      ? $(event.target)
      : $(event.target).parents('.slick-slide');

    var index = parseInt(targetElement.attr('data-slick-index'));

    if (!index) index = 0;

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideHandler(index, false, true);
      return;
    }

    _.slideHandler(index);
  };

  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
    var targetSlide,
      animSlide,
      oldSlide,
      slideLeft,
      targetLeft = null,
      _ = this,
      navTarget;

    sync = sync || false;

    if (_.animating === true && _.options.waitForAnimate === true) {
      return;
    }

    if (_.options.fade === true && _.currentSlide === index) {
      return;
    }

    if (sync === false) {
      _.asNavFor(index);
    }

    targetSlide = index;
    targetLeft = _.getLeft(targetSlide);
    slideLeft = _.getLeft(_.currentSlide);

    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

    if (
      _.options.infinite === false &&
      _.options.centerMode === false &&
      (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)
    ) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;
        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }
      return;
    } else if (
      _.options.infinite === false &&
      _.options.centerMode === true &&
      (index < 0 || index > _.slideCount - _.options.slidesToScroll)
    ) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;
        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }
      return;
    }

    if (_.options.autoplay) {
      clearInterval(_.autoPlayTimer);
    }

    if (targetSlide < 0) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
      } else {
        animSlide = _.slideCount + targetSlide;
      }
    } else if (targetSlide >= _.slideCount) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - _.slideCount;
      }
    } else {
      animSlide = targetSlide;
    }

    _.animating = true;

    _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

    oldSlide = _.currentSlide;
    _.currentSlide = animSlide;

    _.setSlideClasses(_.currentSlide);

    if (_.options.asNavFor) {
      navTarget = _.getNavTarget();
      navTarget = navTarget.slick('getSlick');

      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
        navTarget.setSlideClasses(_.currentSlide);
      }
    }

    _.updateDots();
    _.updateArrows();

    if (_.options.fade === true) {
      if (dontAnimate !== true) {
        _.fadeSlideOut(oldSlide);

        _.fadeSlide(animSlide, function () {
          _.postSlide(animSlide);
        });
      } else {
        _.postSlide(animSlide);
      }
      _.animateHeight();
      return;
    }

    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
      _.animateSlide(targetLeft, function () {
        _.postSlide(animSlide);
      });
    } else {
      _.postSlide(animSlide);
    }
  };

  Slick.prototype.startLoad = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.hide();
      _.$nextArrow.hide();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.hide();
    }

    _.$slider.addClass('slick-loading');
  };

  Slick.prototype.swipeDirection = function () {
    var xDist,
      yDist,
      r,
      swipeAngle,
      _ = this;

    xDist = _.touchObject.startX - _.touchObject.curX;
    yDist = _.touchObject.startY - _.touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round((r * 180) / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return _.options.rtl === false ? 'left' : 'right';
    }
    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return _.options.rtl === false ? 'left' : 'right';
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return _.options.rtl === false ? 'right' : 'left';
    }
    if (_.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  };

  Slick.prototype.swipeEnd = function (event) {
    var _ = this,
      slideCount,
      direction;

    _.dragging = false;
    _.swiping = false;

    if (_.scrolling) {
      _.scrolling = false;
      return false;
    }

    _.interrupted = false;
    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

    if (_.touchObject.curX === undefined) {
      return false;
    }

    if (_.touchObject.edgeHit === true) {
      _.$slider.trigger('edge', [_, _.swipeDirection()]);
    }

    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
      direction = _.swipeDirection();

      switch (direction) {
        case 'left':
        case 'down':
          slideCount = _.options.swipeToSlide
            ? _.checkNavigable(_.currentSlide + _.getSlideCount())
            : _.currentSlide + _.getSlideCount();

          _.currentDirection = 0;

          break;

        case 'right':
        case 'up':
          slideCount = _.options.swipeToSlide
            ? _.checkNavigable(_.currentSlide - _.getSlideCount())
            : _.currentSlide - _.getSlideCount();

          _.currentDirection = 1;

          break;

        default:
      }

      if (direction != 'vertical') {
        _.slideHandler(slideCount);
        _.touchObject = {};
        _.$slider.trigger('swipe', [_, direction]);
      }
    } else {
      if (_.touchObject.startX !== _.touchObject.curX) {
        _.slideHandler(_.currentSlide);
        _.touchObject = {};
      }
    }
  };

  Slick.prototype.swipeHandler = function (event) {
    var _ = this;

    if (
      _.options.swipe === false ||
      ('ontouchend' in document && _.options.swipe === false)
    ) {
      return;
    } else if (
      _.options.draggable === false &&
      event.type.indexOf('mouse') !== -1
    ) {
      return;
    }

    _.touchObject.fingerCount =
      event.originalEvent && event.originalEvent.touches !== undefined
        ? event.originalEvent.touches.length
        : 1;

    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

    if (_.options.verticalSwiping === true) {
      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
    }

    switch (event.data.action) {
      case 'start':
        _.swipeStart(event);
        break;

      case 'move':
        _.swipeMove(event);
        break;

      case 'end':
        _.swipeEnd(event);
        break;
    }
  };

  Slick.prototype.swipeMove = function (event) {
    var _ = this,
      edgeWasHit = false,
      curLeft,
      swipeDirection,
      swipeLength,
      positionOffset,
      touches,
      verticalSwipeLength;

    touches =
      event.originalEvent !== undefined ? event.originalEvent.touches : null;

    if (!_.dragging || _.scrolling || (touches && touches.length !== 1)) {
      return false;
    }

    curLeft = _.getLeft(_.currentSlide);

    _.touchObject.curX =
      touches !== undefined ? touches[0].pageX : event.clientX;
    _.touchObject.curY =
      touches !== undefined ? touches[0].pageY : event.clientY;

    _.touchObject.swipeLength = Math.round(
      Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2))
    );

    verticalSwipeLength = Math.round(
      Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2))
    );

    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
      _.scrolling = true;
      return false;
    }

    if (_.options.verticalSwiping === true) {
      _.touchObject.swipeLength = verticalSwipeLength;
    }

    swipeDirection = _.swipeDirection();

    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
      _.swiping = true;
      event.preventDefault();
    }

    positionOffset =
      (_.options.rtl === false ? 1 : -1) *
      (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
    if (_.options.verticalSwiping === true) {
      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
    }

    swipeLength = _.touchObject.swipeLength;

    _.touchObject.edgeHit = false;

    if (_.options.infinite === false) {
      if (
        (_.currentSlide === 0 && swipeDirection === 'right') ||
        (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')
      ) {
        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
        _.touchObject.edgeHit = true;
      }
    }

    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft =
        curLeft +
        swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
    }
    if (_.options.verticalSwiping === true) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    }

    if (_.options.fade === true || _.options.touchMove === false) {
      return false;
    }

    if (_.animating === true) {
      _.swipeLeft = null;
      return false;
    }

    _.setCSS(_.swipeLeft);
  };

  Slick.prototype.swipeStart = function (event) {
    var _ = this,
      touches;

    _.interrupted = true;

    if (
      _.touchObject.fingerCount !== 1 ||
      _.slideCount <= _.options.slidesToShow
    ) {
      _.touchObject = {};
      return false;
    }

    if (
      event.originalEvent !== undefined &&
      event.originalEvent.touches !== undefined
    ) {
      touches = event.originalEvent.touches[0];
    }

    _.touchObject.startX = _.touchObject.curX =
      touches !== undefined ? touches.pageX : event.clientX;
    _.touchObject.startY = _.touchObject.curY =
      touches !== undefined ? touches.pageY : event.clientY;

    _.dragging = true;
  };

  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
    var _ = this;

    if (_.$slidesCache !== null) {
      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.unload = function () {
    var _ = this;

    $('.slick-cloned', _.$slider).remove();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove();
    }

    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove();
    }

    _.$slides
      .removeClass('slick-slide slick-active slick-visible slick-current')
      .attr('aria-hidden', 'true')
      .css('width', '');
  };

  Slick.prototype.unslick = function (fromBreakpoint) {
    var _ = this;
    _.$slider.trigger('unslick', [_, fromBreakpoint]);
    _.destroy();
  };

  Slick.prototype.updateArrows = function () {
    var _ = this,
      centerOffset;

    centerOffset = Math.floor(_.options.slidesToShow / 2);

    if (
      _.options.arrows === true &&
      _.slideCount > _.options.slidesToShow &&
      !_.options.infinite
    ) {
      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      if (_.currentSlide === 0) {
        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        _.$nextArrow
          .removeClass('slick-disabled')
          .attr('aria-disabled', 'false');
      } else if (
        _.currentSlide >= _.slideCount - _.options.slidesToShow &&
        _.options.centerMode === false
      ) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        _.$prevArrow
          .removeClass('slick-disabled')
          .attr('aria-disabled', 'false');
      } else if (
        _.currentSlide >= _.slideCount - 1 &&
        _.options.centerMode === true
      ) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        _.$prevArrow
          .removeClass('slick-disabled')
          .attr('aria-disabled', 'false');
      }
    }
  };

  Slick.prototype.updateDots = function () {
    var _ = this;

    if (_.$dots !== null) {
      _.$dots.find('li').removeClass('slick-active').end();

      _.$dots
        .find('li')
        .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
        .addClass('slick-active');
    }
  };

  Slick.prototype.visibility = function () {
    var _ = this;

    if (_.options.autoplay) {
      if (document[_.hidden]) {
        _.interrupted = true;
      } else {
        _.interrupted = false;
      }
    }
  };

  $.fn.slick = function () {
    var _ = this,
      opt = arguments[0],
      args = Array.prototype.slice.call(arguments, 1),
      l = _.length,
      i,
      ret;
    for (i = 0; i < l; i++) {
      if (typeof opt == 'object' || typeof opt == 'undefined')
        _[i].slick = new Slick(_[i], opt);
      else ret = _[i].slick[opt].apply(_[i].slick, args);
      if (typeof ret != 'undefined') return ret;
    }
    return _;
  };
});
/**!
 * lightgallery.js | 1.4.1-beta.0 | October 29th 2020
 * http://sachinchoolur.github.io/lightgallery.js/
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */ (function (f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== 'undefined') {
      g = window;
    } else if (typeof global !== 'undefined') {
      g = global;
    } else if (typeof self !== 'undefined') {
      g = self;
    } else {
      g = this;
    }
    g.Lightgallery = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = 'function' == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = 'MODULE_NOT_FOUND'), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = 'function' == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          (function (global, factory) {
            if (typeof define === 'function' && define.amd) {
              define(['exports'], factory);
            } else if (typeof exports !== 'undefined') {
              factory(exports);
            } else {
              var mod = {
                exports: {},
              };
              factory(mod.exports);
              global.lgUtils = mod.exports;
            }
          })(this, function (exports) {
            'use strict';

            Object.defineProperty(exports, '__esModule', {
              value: true,
            });

            var utils = {
              getAttribute: function getAttribute(el, label) {
                return el[label];
              },

              setAttribute: function setAttribute(el, label, value) {
                el[label] = value;
              },
              wrap: function wrap(el, className) {
                if (!el) {
                  return;
                }

                var wrapper = document.createElement('div');
                wrapper.className = className;
                el.parentNode.insertBefore(wrapper, el);
                el.parentNode.removeChild(el);
                wrapper.appendChild(el);
              },

              addClass: function addClass(el, className) {
                if (!el) {
                  return;
                }

                if (el.classList) {
                  el.classList.add(className);
                } else {
                  el.className += ' ' + className;
                }
              },

              removeClass: function removeClass(el, className) {
                if (!el) {
                  return;
                }

                if (el.classList) {
                  el.classList.remove(className);
                } else {
                  el.className = el.className.replace(
                    new RegExp(
                      '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
                      'gi'
                    ),
                    ' '
                  );
                }
              },

              hasClass: function hasClass(el, className) {
                if (el.classList) {
                  return el.classList.contains(className);
                } else {
                  return new RegExp('(^| )' + className + '( |$)', 'gi').test(
                    el.className
                  );
                }
              },

              // ex Transform
              // ex TransitionTimingFunction
              setVendor: function setVendor(el, property, value) {
                if (!el) {
                  return;
                }

                el.style[
                  property.charAt(0).toLowerCase() + property.slice(1)
                ] = value;
                el.style['webkit' + property] = value;
                el.style['moz' + property] = value;
                el.style['ms' + property] = value;
                el.style['o' + property] = value;
              },

              trigger: function trigger(el, event) {
                var detail =
                  arguments.length > 2 && arguments[2] !== undefined
                    ? arguments[2]
                    : null;

                if (!el) {
                  return;
                }

                var customEvent = new CustomEvent(event, {
                  detail: detail,
                });
                el.dispatchEvent(customEvent);
              },

              Listener: {
                uid: 0,
              },
              on: function on(el, events, fn) {
                var _this = this;

                if (!el) {
                  return;
                }

                events.split(' ').forEach(function (event) {
                  var _id = _this.getAttribute(el, 'lg-event-uid') || '';
                  utils.Listener.uid++;
                  _id += '&' + utils.Listener.uid;
                  _this.setAttribute(el, 'lg-event-uid', _id);
                  utils.Listener[event + utils.Listener.uid] = fn;
                  el.addEventListener(event.split('.')[0], fn, false);
                });
              },

              off: function off(el, event) {
                if (!el) {
                  return;
                }

                var _id = this.getAttribute(el, 'lg-event-uid');
                if (_id) {
                  _id = _id.split('&');
                  for (var i = 0; i < _id.length; i++) {
                    if (_id[i]) {
                      var _event = event + _id[i];
                      if (_event.substring(0, 1) === '.') {
                        for (var key in utils.Listener) {
                          if (utils.Listener.hasOwnProperty(key)) {
                            if (
                              key.split('.').indexOf(_event.split('.')[1]) > -1
                            ) {
                              el.removeEventListener(
                                key.split('.')[0],
                                utils.Listener[key]
                              );
                              this.setAttribute(
                                el,
                                'lg-event-uid',
                                this.getAttribute(el, 'lg-event-uid').replace(
                                  '&' + _id[i],
                                  ''
                                )
                              );
                              delete utils.Listener[key];
                            }
                          }
                        }
                      } else {
                        el.removeEventListener(
                          _event.split('.')[0],
                          utils.Listener[_event]
                        );
                        this.setAttribute(
                          el,
                          'lg-event-uid',
                          this.getAttribute(el, 'lg-event-uid').replace(
                            '&' + _id[i],
                            ''
                          )
                        );
                        delete utils.Listener[_event];
                      }
                    }
                  }
                }
              },

              param: function param(obj) {
                return Object.keys(obj)
                  .map(function (k) {
                    return (
                      encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
                    );
                  })
                  .join('&');
              },
            };

            exports.default = utils;
          });
        },
        {},
      ],
      2: [
        function (require, module, exports) {
          (function (global, factory) {
            if (typeof define === 'function' && define.amd) {
              define(['./lg-utils'], factory);
            } else if (typeof exports !== 'undefined') {
              factory(require('./lg-utils'));
            } else {
              var mod = {
                exports: {},
              };
              factory(global.lgUtils);
              global.lightgallery = mod.exports;
            }
          })(this, function (_lgUtils) {
            'use strict';

            var _lgUtils2 = _interopRequireDefault(_lgUtils);

            function _interopRequireDefault(obj) {
              return obj && obj.__esModule
                ? obj
                : {
                    default: obj,
                  };
            }

            var _extends =
              Object.assign ||
              function (target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = arguments[i];

                  for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                    }
                  }
                }

                return target;
              };

            /** Polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher */
            (function () {
              if (typeof window.CustomEvent === 'function') {
                return false;
              }

              function CustomEvent(event, params) {
                params = params || {
                  bubbles: false,
                  cancelable: false,
                  detail: undefined,
                };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(
                  event,
                  params.bubbles,
                  params.cancelable,
                  params.detail
                );
                return evt;
              }

              CustomEvent.prototype = window.Event.prototype;

              window.CustomEvent = CustomEvent;
            })();

            window.utils = _lgUtils2.default;
            window.lgData = {
              uid: 0,
            };

            window.lgModules = {};
            var defaults = {
              mode: 'lg-slide',

              // Ex : 'ease'
              cssEasing: 'ease',

              //'for jquery animation'
              easing: 'linear',
              speed: 600,
              height: '100%',
              width: '100%',
              addClass: '',
              startClass: 'lg-start-zoom',
              backdropDuration: 150,

              // Set 0, if u don't want to hide the controls
              hideBarsDelay: 6000,

              useLeft: false,

              // aria-labelledby attribute fot gallery
              ariaLabelledby: '',

              //aria-describedby attribute for gallery
              ariaDescribedby: '',

              closable: true,
              loop: true,
              escKey: true,
              keyPress: true,
              controls: true,
              slideEndAnimatoin: true,
              hideControlOnEnd: false,
              mousewheel: false,

              getCaptionFromTitleOrAlt: true,

              // .lg-item || '.lg-sub-html'
              appendSubHtmlTo: '.lg-sub-html',

              subHtmlSelectorRelative: false,

              /**
               * @desc number of preload slides
               * will exicute only after the current slide is fully loaded.
               *
               * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
               * slide will be loaded in the background after the 4th slide is fully loaded..
               * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
               *
               */
              preload: 1,
              showAfterLoad: true,
              selector: '',
              selectWithin: '',
              nextHtml: '',
              prevHtml: '',

              // 0, 1
              index: false,

              iframeMaxWidth: '100%',

              download: true,
              counter: true,
              appendCounterTo: '.lg-toolbar',

              swipeThreshold: 50,
              enableSwipe: true,
              enableDrag: true,

              dynamic: false,
              dynamicEl: [],
              galleryId: 1,
              supportLegacyBrowser: true,
            };

            function Plugin(element, options) {
              // Current lightGallery element
              this.el = element;

              // lightGallery settings
              this.s = _extends({}, defaults, options);

              // When using dynamic mode, ensure dynamicEl is an array
              if (
                this.s.dynamic &&
                this.s.dynamicEl !== 'undefined' &&
                this.s.dynamicEl.constructor === Array &&
                !this.s.dynamicEl.length
              ) {
                throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
              }

              // lightGallery modules
              this.modules = {};

              // false when lightgallery complete first slide;
              this.lGalleryOn = false;

              this.lgBusy = false;

              // Timeout function for hiding controls;
              this.hideBartimeout = false;

              // To determine browser supports for touch events;
              this.isTouch = 'ontouchstart' in document.documentElement;

              // Disable hideControlOnEnd if sildeEndAnimation is true
              if (this.s.slideEndAnimatoin) {
                this.s.hideControlOnEnd = false;
              }

              this.items = [];

              // Gallery items
              if (this.s.dynamic) {
                this.items = this.s.dynamicEl;
              } else {
                if (this.s.selector === 'this') {
                  this.items.push(this.el);
                } else if (this.s.selector !== '') {
                  if (this.s.selectWithin) {
                    this.items = document
                      .querySelector(this.s.selectWithin)
                      .querySelectorAll(this.s.selector);
                  } else {
                    this.items = this.el.querySelectorAll(this.s.selector);
                  }
                } else {
                  this.items = this.el.children;
                }
              }

              // .lg-item

              this.___slide = '';

              // .lg-outer
              this.outer = '';

              this.init();

              return this;
            }

            Plugin.prototype.init = function () {
              var _this = this;

              // s.preload should not be more than $item.length
              if (_this.s.preload > _this.items.length) {
                _this.s.preload = _this.items.length;
              }

              // if dynamic option is enabled execute immediately
              var _hash = window.location.hash;
              if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
                _this.index = parseInt(_hash.split('&slide=')[1], 10);

                _lgUtils2.default.addClass(document.body, 'lg-from-hash');
                if (!_lgUtils2.default.hasClass(document.body, 'lg-on')) {
                  _lgUtils2.default.addClass(document.body, 'lg-on');
                  setTimeout(function () {
                    _this.build(_this.index);
                  });
                }
              }

              if (_this.s.dynamic) {
                _lgUtils2.default.trigger(this.el, 'onBeforeOpen');

                _this.index = _this.s.index || 0;

                // prevent accidental double execution
                if (!_lgUtils2.default.hasClass(document.body, 'lg-on')) {
                  _lgUtils2.default.addClass(document.body, 'lg-on');
                  setTimeout(function () {
                    _this.build(_this.index);
                  });
                }
              } else {
                for (var i = 0; i < _this.items.length; i++) {
                  /*jshint loopfunc: true */
                  (function (index) {
                    // Using different namespace for click because click event should not unbind if selector is same object('this')
                    _lgUtils2.default.on(
                      _this.items[index],
                      'click.lgcustom',
                      function (e) {
                        e.preventDefault();

                        _lgUtils2.default.trigger(_this.el, 'onBeforeOpen');

                        _this.index = _this.s.index || index;

                        if (
                          !_lgUtils2.default.hasClass(document.body, 'lg-on')
                        ) {
                          _this.build(_this.index);
                          _lgUtils2.default.addClass(document.body, 'lg-on');
                        }
                      }
                    );
                  })(i);
                }
              }
            };

            Plugin.prototype.build = function (index) {
              var _this = this;

              _this.structure();

              for (var key in window.lgModules) {
                _this.modules[key] = new window.lgModules[key](_this.el);
              }

              // initiate slide function
              _this.slide(index, false, false);

              if (_this.s.keyPress) {
                _this.keyPress();
              }

              if (_this.items.length > 1) {
                _this.arrow();

                setTimeout(function () {
                  _this.enableDrag();
                  _this.enableSwipe();
                }, 50);

                if (_this.s.mousewheel) {
                  _this.mousewheel();
                }
              }

              _this.counter();

              _this.closeGallery();

              _lgUtils2.default.trigger(_this.el, 'onAfterOpen');

              // Hide controllers if mouse doesn't move for some period
              if (_this.s.hideBarsDelay > 0) {
                // Hide controls if user doesn't use mouse or touch after opening gallery
                var initialHideBarTimeout = setTimeout(function () {
                  _lgUtils2.default.addClass(_this.outer, 'lg-hide-items');
                }, _this.s.hideBarsDelay);
                _lgUtils2.default.on(
                  _this.outer,
                  'mousemove.lg click.lg touchstart.lg',
                  function () {
                    // Cancel initalHideBarTimout if user uses mouse or touch events
                    // Before it fires
                    clearTimeout(initialHideBarTimeout);

                    _lgUtils2.default.removeClass(_this.outer, 'lg-hide-items');

                    clearTimeout(_this.hideBartimeout);

                    // Timeout will be cleared on each slide movement also
                    _this.hideBartimeout = setTimeout(function () {
                      _lgUtils2.default.addClass(_this.outer, 'lg-hide-items');
                    }, _this.s.hideBarsDelay);
                  }
                );
              }
            };

            Plugin.prototype.structure = function () {
              var list = '';
              var controls = '';
              var i = 0;
              var subHtmlCont = '';
              var template;
              var _this = this;

              document.body.insertAdjacentHTML(
                'beforeend',
                '<div class="lg-backdrop"></div>'
              );
              _lgUtils2.default.setVendor(
                document.querySelector('.lg-backdrop'),
                'TransitionDuration',
                this.s.backdropDuration + 'ms'
              );

              // Create gallery items
              for (i = 0; i < this.items.length; i++) {
                list += '<div class="lg-item"></div>';
              }

              // Create controlls
              if (this.s.controls && this.items.length > 1) {
                controls =
                  '<div class="lg-actions">' +
                  '<button type="button" aria-label="Previous slide" class="lg-prev lg-icon">' +
                  this.s.prevHtml +
                  '</button>' +
                  '<button type="button" aria-label="Next slide" class="lg-next lg-icon">' +
                  this.s.nextHtml +
                  '</button>' +
                  '</div>';
              }

              if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                subHtmlCont =
                  '<div role="status" aria-live="polite" class="lg-sub-html"></div>';
              }

              var ariaLabelledby = this.s.ariaLabelledby
                ? 'aria-labelledby="' + this.s.ariaLabelledby + '"'
                : '';
              var ariaDescribedby = this.s.ariaDescribedby
                ? 'aria-describedby="' + this.s.ariaDescribedby + '"'
                : '';

              template =
                '<div tabindex="-1" aria-modal="true" ' +
                ariaLabelledby +
                ' ' +
                ariaDescribedby +
                ' role="dialog" class="lg-outer ' +
                this.s.addClass +
                ' ' +
                this.s.startClass +
                '">' +
                '<div class="lg" style="width:' +
                this.s.width +
                '; height:' +
                this.s.height +
                '">' +
                '<div class="lg-inner">' +
                list +
                '</div>' +
                '<div class="lg-toolbar lg-group">' +
                '<button type="button" aria-label="Close gallery" class="lg-close lg-icon"></button>' +
                '</div>' +
                controls +
                subHtmlCont +
                '</div>' +
                '</div>';

              document.body.insertAdjacentHTML('beforeend', template);
              this.outer = document.querySelector('.lg-outer');
              this.outer.focus();
              this.___slide = this.outer.querySelectorAll('.lg-item');

              if (this.s.useLeft) {
                _lgUtils2.default.addClass(this.outer, 'lg-use-left');

                // Set mode lg-slide if use left is true;
                this.s.mode = 'lg-slide';
              } else {
                _lgUtils2.default.addClass(this.outer, 'lg-use-css3');
              }

              // For fixed height gallery
              _this.setTop();
              _lgUtils2.default.on(
                window,
                'resize.lg orientationchange.lg',
                function () {
                  setTimeout(function () {
                    _this.setTop();
                  }, 100);
                }
              );

              // add class lg-current to remove initial transition
              _lgUtils2.default.addClass(
                this.___slide[this.index],
                'lg-current'
              );

              // add Class for css support and transition mode
              if (this.doCss()) {
                _lgUtils2.default.addClass(this.outer, 'lg-css3');
              } else {
                _lgUtils2.default.addClass(this.outer, 'lg-css');

                // Set speed 0 because no animation will happen if browser doesn't support css3
                this.s.speed = 0;
              }

              _lgUtils2.default.addClass(this.outer, this.s.mode);

              if (this.s.enableDrag && this.items.length > 1) {
                _lgUtils2.default.addClass(this.outer, 'lg-grab');
              }

              if (this.s.showAfterLoad) {
                _lgUtils2.default.addClass(this.outer, 'lg-show-after-load');
              }

              if (this.doCss()) {
                var inner = this.outer.querySelector('.lg-inner');
                _lgUtils2.default.setVendor(
                  inner,
                  'TransitionTimingFunction',
                  this.s.cssEasing
                );
                _lgUtils2.default.setVendor(
                  inner,
                  'TransitionDuration',
                  this.s.speed + 'ms'
                );
              }

              setTimeout(function () {
                _lgUtils2.default.addClass(
                  document.querySelector('.lg-backdrop'),
                  'in'
                );
              });

              setTimeout(function () {
                _lgUtils2.default.addClass(_this.outer, 'lg-visible');
              }, this.s.backdropDuration);

              if (this.s.download) {
                this.outer
                  .querySelector('.lg-toolbar')
                  .insertAdjacentHTML(
                    'beforeend',
                    '<a id="lg-download" aria-label="Download" target="_blank" download class="lg-download lg-icon"></a>'
                  );
              }

              // Store the current scroll top value to scroll back after closing the gallery..
              this.prevScrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            };

            // For fixed height gallery
            Plugin.prototype.setTop = function () {
              if (this.s.height !== '100%') {
                var wH = window.innerHeight;
                var top = (wH - parseInt(this.s.height, 10)) / 2;
                var lGallery = this.outer.querySelector('.lg');
                if (wH >= parseInt(this.s.height, 10)) {
                  lGallery.style.top = top + 'px';
                } else {
                  lGallery.style.top = '0px';
                }
              }
            };

            // Find css3 support
            Plugin.prototype.doCss = function () {
              // check for css animation support
              var support = function support() {
                var transition = [
                  'transition',
                  'MozTransition',
                  'WebkitTransition',
                  'OTransition',
                  'msTransition',
                  'KhtmlTransition',
                ];
                var root = document.documentElement;
                var i = 0;
                for (i = 0; i < transition.length; i++) {
                  if (transition[i] in root.style) {
                    return true;
                  }
                }
              };

              if (support()) {
                return true;
              }

              return false;
            };

            /**
             *  @desc Check the given src is video
             *  @param {String} src
             *  @return {Object} video type
             *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
             */
            Plugin.prototype.isVideo = function (src, index) {
              var html;
              if (this.s.dynamic) {
                html = this.s.dynamicEl[index].html;
              } else {
                html = this.items[index].getAttribute('data-html');
              }

              if (!src && html) {
                return {
                  html5: true,
                };
              }

              var youtube = src.match(
                /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i
              );
              var vimeo = src.match(
                /\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)/i
              );
              var dailymotion = src.match(
                /\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i
              );
              var vk = src.match(
                /\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i
              );

              if (youtube) {
                return {
                  youtube: youtube,
                };
              } else if (vimeo) {
                return {
                  vimeo: vimeo,
                };
              } else if (dailymotion) {
                return {
                  dailymotion: dailymotion,
                };
              } else if (vk) {
                return {
                  vk: vk,
                };
              }
            };

            /**
             *  @desc Create image counter
             *  Ex: 1/10
             */
            Plugin.prototype.counter = function () {
              if (this.s.counter) {
                this.outer
                  .querySelector(this.s.appendCounterTo)
                  .insertAdjacentHTML(
                    'beforeend',
                    '<div id="lg-counter" role="status" aria-live="polite"><span id="lg-counter-current">' +
                      (parseInt(this.index, 10) + 1) +
                      '</span> / <span id="lg-counter-all">' +
                      this.items.length +
                      '</span></div>'
                  );
              }
            };

            /**
             *  @desc add sub-html into the slide
             *  @param {Number} index - index of the slide
             */
            Plugin.prototype.addHtml = function (index) {
              var subHtml = null;
              var currentEle;
              if (this.s.dynamic) {
                subHtml = this.s.dynamicEl[index].subHtml;
              } else {
                currentEle = this.items[index];
                subHtml = currentEle.getAttribute('data-sub-html');
                if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
                  subHtml = currentEle.getAttribute('title');
                  if (subHtml && currentEle.querySelector('img')) {
                    subHtml = currentEle
                      .querySelector('img')
                      .getAttribute('alt');
                  }
                }
              }

              if (typeof subHtml !== 'undefined' && subHtml !== null) {
                // get first letter of subhtml
                // if first letter starts with . or # get the html form the jQuery object
                var fL = subHtml.substring(0, 1);
                if (fL === '.' || fL === '#') {
                  if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                    subHtml = currentEle.querySelector(subHtml).innerHTML;
                  } else {
                    subHtml = document.querySelector(subHtml).innerHTML;
                  }
                }
              } else {
                subHtml = '';
              }

              if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                this.outer.querySelector(
                  this.s.appendSubHtmlTo
                ).innerHTML = subHtml;
              } else {
                this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
              }

              // Add lg-empty-html class if title doesn't exist
              if (typeof subHtml !== 'undefined' && subHtml !== null) {
                if (subHtml === '') {
                  _lgUtils2.default.addClass(
                    this.outer.querySelector(this.s.appendSubHtmlTo),
                    'lg-empty-html'
                  );
                } else {
                  _lgUtils2.default.removeClass(
                    this.outer.querySelector(this.s.appendSubHtmlTo),
                    'lg-empty-html'
                  );
                }
              }

              _lgUtils2.default.trigger(this.el, 'onAfterAppendSubHtml', {
                index: index,
              });
            };

            /**
             *  @desc Preload slides
             *  @param {Number} index - index of the slide
             */
            Plugin.prototype.preload = function (index) {
              var i = 1;
              var j = 1;
              for (i = 1; i <= this.s.preload; i++) {
                if (i >= this.items.length - index) {
                  break;
                }

                this.loadContent(index + i, false, 0);
              }

              for (j = 1; j <= this.s.preload; j++) {
                if (index - j < 0) {
                  break;
                }

                this.loadContent(index - j, false, 0);
              }
            };

            /**
             *  @desc Load slide content into slide.
             *  @param {Number} index - index of the slide.
             *  @param {Boolean} rec - if true call loadcontent() function again.
             *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
             */
            Plugin.prototype.loadContent = function (index, rec, delay) {
              var _this = this;
              var _hasPoster = false;
              var _img;
              var _src;
              var _poster;
              var _srcset;
              var _sizes;
              var _html;
              var _alt;
              var getResponsiveSrc = function getResponsiveSrc(srcItms) {
                var rsWidth = [];
                var rsSrc = [];
                for (var i = 0; i < srcItms.length; i++) {
                  var __src = srcItms[i].split(' ');

                  // Manage empty space
                  if (__src[0] === '') {
                    __src.splice(0, 1);
                  }

                  rsSrc.push(__src[0]);
                  rsWidth.push(__src[1]);
                }

                var wWidth = window.innerWidth;
                for (var j = 0; j < rsWidth.length; j++) {
                  if (parseInt(rsWidth[j], 10) > wWidth) {
                    _src = rsSrc[j];
                    break;
                  }
                }
              };

              if (_this.s.dynamic) {
                if (_this.s.dynamicEl[index].poster) {
                  _hasPoster = true;
                  _poster = _this.s.dynamicEl[index].poster;
                }

                _html = _this.s.dynamicEl[index].html;
                _src = _this.s.dynamicEl[index].src;
                _alt = _this.s.dynamicEl[index].alt;

                if (_this.s.dynamicEl[index].responsive) {
                  var srcDyItms = _this.s.dynamicEl[index].responsive.split(
                    ','
                  );
                  getResponsiveSrc(srcDyItms);
                }

                _srcset = _this.s.dynamicEl[index].srcset;
                _sizes = _this.s.dynamicEl[index].sizes;
              } else {
                if (_this.items[index].getAttribute('data-poster')) {
                  _hasPoster = true;
                  _poster = _this.items[index].getAttribute('data-poster');
                }

                _html = _this.items[index].getAttribute('data-html');
                _src =
                  _this.items[index].getAttribute('href') ||
                  _this.items[index].getAttribute('data-src');
                _alt = _this.items[index].getAttribute('title');

                if (_this.items[index].querySelector('img')) {
                  _alt =
                    _alt ||
                    _this.items[index].querySelector('img').getAttribute('alt');
                }

                if (_this.items[index].getAttribute('data-responsive')) {
                  var srcItms = _this.items[index]
                    .getAttribute('data-responsive')
                    .split(',');
                  getResponsiveSrc(srcItms);
                }

                _srcset = _this.items[index].getAttribute('data-srcset');
                _sizes = _this.items[index].getAttribute('data-sizes');
              }

              //if (_src || _srcset || _sizes || _poster) {

              var iframe = false;
              if (_this.s.dynamic) {
                if (_this.s.dynamicEl[index].iframe) {
                  iframe = true;
                }
              } else {
                if (_this.items[index].getAttribute('data-iframe') === 'true') {
                  iframe = true;
                }
              }

              var _isVideo = _this.isVideo(_src, index);
              if (
                !_lgUtils2.default.hasClass(_this.___slide[index], 'lg-loaded')
              ) {
                if (iframe) {
                  _this.___slide[index].insertAdjacentHTML(
                    'afterbegin',
                    '<div class="lg-video-cont" style="max-width:' +
                      _this.s.iframeMaxWidth +
                      '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' +
                      _src +
                      '"  allowfullscreen="true"></iframe></div></div>'
                  );
                } else if (_hasPoster) {
                  var videoClass = '';
                  if (_isVideo && _isVideo.youtube) {
                    videoClass = 'lg-has-youtube';
                  } else if (_isVideo && _isVideo.vimeo) {
                    videoClass = 'lg-has-vimeo';
                  } else {
                    videoClass = 'lg-has-html5';
                  }

                  _this.___slide[index].insertAdjacentHTML(
                    'beforeend',
                    '<div class="lg-video-cont ' +
                      videoClass +
                      ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' +
                      _poster +
                      '" /></div></div>'
                  );
                } else if (_isVideo) {
                  _this.___slide[index].insertAdjacentHTML(
                    'beforeend',
                    '<div class="lg-video-cont "><div class="lg-video"></div></div>'
                  );
                  _lgUtils2.default.trigger(_this.el, 'hasVideo', {
                    index: index,
                    src: _src,
                    html: _html,
                  });
                } else {
                  _alt = _alt ? 'alt="' + _alt + '"' : '';
                  _this.___slide[index].insertAdjacentHTML(
                    'beforeend',
                    '<div class="lg-img-wrap"><img class="lg-object lg-image" ' +
                      _alt +
                      ' src="' +
                      _src +
                      '" /></div>'
                  );
                }

                _lgUtils2.default.trigger(_this.el, 'onAferAppendSlide', {
                  index: index,
                });

                _img = _this.___slide[index].querySelector('.lg-object');
                if (_sizes) {
                  _img.setAttribute('sizes', _sizes);
                }

                if (_srcset) {
                  _img.setAttribute('srcset', _srcset);

                  if (this.s.supportLegacyBrowser) {
                    try {
                      picturefill({
                        elements: [_img[0]],
                      });
                    } catch (e) {
                      console.warn(
                        'If you want srcset to be supported for older browsers, ' +
                          'please include picturefil javascript library in your document.'
                      );
                    }
                  }
                }

                if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
                  _this.addHtml(index);
                }

                _lgUtils2.default.addClass(_this.___slide[index], 'lg-loaded');
              }

              _lgUtils2.default.on(
                _this.___slide[index].querySelector('.lg-object'),
                'load.lg error.lg',
                function () {
                  // For first time add some delay for displaying the start animation.
                  var _speed = 0;

                  // Do not change the delay value because it is required for zoom plugin.
                  // If gallery opened from direct url (hash) speed value should be 0
                  if (
                    delay &&
                    !_lgUtils2.default.hasClass(document.body, 'lg-from-hash')
                  ) {
                    _speed = delay;
                  }

                  setTimeout(function () {
                    _lgUtils2.default.addClass(
                      _this.___slide[index],
                      'lg-complete'
                    );

                    _lgUtils2.default.trigger(_this.el, 'onSlideItemLoad', {
                      index: index,
                      delay: delay || 0,
                    });
                  }, _speed);
                }
              );

              // @todo check load state for html5 videos
              if (_isVideo && _isVideo.html5 && !_hasPoster) {
                _lgUtils2.default.addClass(
                  _this.___slide[index],
                  'lg-complete'
                );
              }

              if (rec === true) {
                if (
                  !_lgUtils2.default.hasClass(
                    _this.___slide[index],
                    'lg-complete'
                  )
                ) {
                  _lgUtils2.default.on(
                    _this.___slide[index].querySelector('.lg-object'),
                    'load.lg error.lg',
                    function () {
                      _this.preload(index);
                    }
                  );
                } else {
                  _this.preload(index);
                }
              }

              //}
            };

            /**
    *   @desc slide function for lightgallery
        ** Slide() gets call on start
        ** ** Set lg.on true once slide() function gets called.
        ** Call loadContent() on slide() function inside setTimeout
        ** ** On first slide we do not want any animation like slide of fade
        ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
        ** ** Else loadContent() should wait for the transition to complete.
        ** ** So set timeout s.speed + 50
    <=> ** loadContent() will load slide content in to the particular slide
        ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
        ** ** preload will execute only when the previous slide is fully loaded (images iframe)
        ** ** avoid simultaneous image load
    <=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
        ** loadContent()  <====> Preload();
    
    *   @param {Number} index - index of the slide
    *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
    *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
    */
            Plugin.prototype.slide = function (index, fromTouch, fromThumb) {
              var _prevIndex = 0;
              for (var i = 0; i < this.___slide.length; i++) {
                if (
                  _lgUtils2.default.hasClass(this.___slide[i], 'lg-current')
                ) {
                  _prevIndex = i;
                  break;
                }
              }

              var _this = this;

              // Prevent if multiple call
              // Required for hsh plugin
              if (_this.lGalleryOn && _prevIndex === index) {
                return;
              }

              var _length = this.___slide.length;
              var _time = _this.lGalleryOn ? this.s.speed : 0;
              var _next = false;
              var _prev = false;

              if (!_this.lgBusy) {
                if (this.s.download) {
                  var _src;
                  if (_this.s.dynamic) {
                    _src =
                      _this.s.dynamicEl[index].downloadUrl !== false &&
                      (_this.s.dynamicEl[index].downloadUrl ||
                        _this.s.dynamicEl[index].src);
                  } else {
                    _src =
                      _this.items[index].getAttribute('data-download-url') !==
                        'false' &&
                      (_this.items[index].getAttribute('data-download-url') ||
                        _this.items[index].getAttribute('href') ||
                        _this.items[index].getAttribute('data-src'));
                  }

                  if (_src) {
                    document
                      .getElementById('lg-download')
                      .setAttribute('href', _src);
                    _lgUtils2.default.removeClass(
                      _this.outer,
                      'lg-hide-download'
                    );
                  } else {
                    _lgUtils2.default.addClass(_this.outer, 'lg-hide-download');
                  }
                }

                _lgUtils2.default.trigger(_this.el, 'onBeforeSlide', {
                  prevIndex: _prevIndex,
                  index: index,
                  fromTouch: fromTouch,
                  fromThumb: fromThumb,
                });

                _this.lgBusy = true;

                clearTimeout(_this.hideBartimeout);

                // Add title if this.s.appendSubHtmlTo === lg-sub-html
                if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                  // wait for slide animation to complete
                  setTimeout(function () {
                    _this.addHtml(index);
                  }, _time);
                }

                this.arrowDisable(index);

                if (!fromTouch) {
                  // remove all transitions
                  _lgUtils2.default.addClass(_this.outer, 'lg-no-trans');

                  for (var j = 0; j < this.___slide.length; j++) {
                    _lgUtils2.default.removeClass(
                      this.___slide[j],
                      'lg-prev-slide'
                    );
                    _lgUtils2.default.removeClass(
                      this.___slide[j],
                      'lg-next-slide'
                    );
                  }

                  if (index < _prevIndex) {
                    _prev = true;
                    if (
                      index === 0 &&
                      _prevIndex === _length - 1 &&
                      !fromThumb
                    ) {
                      _prev = false;
                      _next = true;
                    }
                  } else if (index > _prevIndex) {
                    _next = true;
                    if (
                      index === _length - 1 &&
                      _prevIndex === 0 &&
                      !fromThumb
                    ) {
                      _prev = true;
                      _next = false;
                    }
                  }

                  if (_prev) {
                    //prevslide
                    _lgUtils2.default.addClass(
                      this.___slide[index],
                      'lg-prev-slide'
                    );
                    _lgUtils2.default.addClass(
                      this.___slide[_prevIndex],
                      'lg-next-slide'
                    );
                  } else if (_next) {
                    // next slide
                    _lgUtils2.default.addClass(
                      this.___slide[index],
                      'lg-next-slide'
                    );
                    _lgUtils2.default.addClass(
                      this.___slide[_prevIndex],
                      'lg-prev-slide'
                    );
                  }

                  // give 50 ms for browser to add/remove class
                  setTimeout(function () {
                    _lgUtils2.default.removeClass(
                      _this.outer.querySelector('.lg-current'),
                      'lg-current'
                    );

                    //_this.$slide.eq(_prevIndex).removeClass('lg-current');
                    _lgUtils2.default.addClass(
                      _this.___slide[index],
                      'lg-current'
                    );

                    // reset all transitions
                    _lgUtils2.default.removeClass(_this.outer, 'lg-no-trans');
                  }, 50);
                } else {
                  var touchPrev = index - 1;
                  var touchNext = index + 1;

                  if (index === 0 && _prevIndex === _length - 1) {
                    // next slide
                    touchNext = 0;
                    touchPrev = _length - 1;
                  } else if (index === _length - 1 && _prevIndex === 0) {
                    // prev slide
                    touchNext = 0;
                    touchPrev = _length - 1;
                  }

                  _lgUtils2.default.removeClass(
                    _this.outer.querySelector('.lg-prev-slide'),
                    'lg-prev-slide'
                  );
                  _lgUtils2.default.removeClass(
                    _this.outer.querySelector('.lg-current'),
                    'lg-current'
                  );
                  _lgUtils2.default.removeClass(
                    _this.outer.querySelector('.lg-next-slide'),
                    'lg-next-slide'
                  );
                  _lgUtils2.default.addClass(
                    _this.___slide[touchPrev],
                    'lg-prev-slide'
                  );
                  _lgUtils2.default.addClass(
                    _this.___slide[touchNext],
                    'lg-next-slide'
                  );
                  _lgUtils2.default.addClass(
                    _this.___slide[index],
                    'lg-current'
                  );
                }

                if (_this.lGalleryOn) {
                  setTimeout(function () {
                    _this.loadContent(index, true, 0);
                  }, this.s.speed + 50);

                  setTimeout(function () {
                    _this.lgBusy = false;
                    _lgUtils2.default.trigger(_this.el, 'onAfterSlide', {
                      prevIndex: _prevIndex,
                      index: index,
                      fromTouch: fromTouch,
                      fromThumb: fromThumb,
                    });
                  }, this.s.speed);
                } else {
                  _this.loadContent(index, true, _this.s.backdropDuration);

                  _this.lgBusy = false;
                  _lgUtils2.default.trigger(_this.el, 'onAfterSlide', {
                    prevIndex: _prevIndex,
                    index: index,
                    fromTouch: fromTouch,
                    fromThumb: fromThumb,
                  });
                }

                _this.lGalleryOn = true;

                if (this.s.counter) {
                  if (document.getElementById('lg-counter-current')) {
                    document.getElementById('lg-counter-current').innerHTML =
                      index + 1;
                  }
                }
              }
            };

            /**
             *  @desc Go to next slide
             *  @param {Boolean} fromTouch - true if slide function called via touch event
             */
            Plugin.prototype.goToNextSlide = function (fromTouch) {
              var _this = this;
              if (!_this.lgBusy) {
                if (_this.index + 1 < _this.___slide.length) {
                  _this.index++;
                  _lgUtils2.default.trigger(_this.el, 'onBeforeNextSlide', {
                    index: _this.index,
                  });
                  _this.slide(_this.index, fromTouch, false);
                } else {
                  if (_this.s.loop) {
                    _this.index = 0;
                    _lgUtils2.default.trigger(_this.el, 'onBeforeNextSlide', {
                      index: _this.index,
                    });
                    _this.slide(_this.index, fromTouch, false);
                  } else if (_this.s.slideEndAnimatoin) {
                    _lgUtils2.default.addClass(_this.outer, 'lg-right-end');
                    setTimeout(function () {
                      _lgUtils2.default.removeClass(
                        _this.outer,
                        'lg-right-end'
                      );
                    }, 400);
                  }
                }
              }
            };

            /**
             *  @desc Go to previous slide
             *  @param {Boolean} fromTouch - true if slide function called via touch event
             */
            Plugin.prototype.goToPrevSlide = function (fromTouch) {
              var _this = this;
              if (!_this.lgBusy) {
                if (_this.index > 0) {
                  _this.index--;
                  _lgUtils2.default.trigger(_this.el, 'onBeforePrevSlide', {
                    index: _this.index,
                    fromTouch: fromTouch,
                  });
                  _this.slide(_this.index, fromTouch, false);
                } else {
                  if (_this.s.loop) {
                    _this.index = _this.items.length - 1;
                    _lgUtils2.default.trigger(_this.el, 'onBeforePrevSlide', {
                      index: _this.index,
                      fromTouch: fromTouch,
                    });
                    _this.slide(_this.index, fromTouch, false);
                  } else if (_this.s.slideEndAnimatoin) {
                    _lgUtils2.default.addClass(_this.outer, 'lg-left-end');
                    setTimeout(function () {
                      _lgUtils2.default.removeClass(_this.outer, 'lg-left-end');
                    }, 400);
                  }
                }
              }
            };

            Plugin.prototype.keyPress = function () {
              var _this = this;
              if (this.items.length > 1) {
                _lgUtils2.default.on(window, 'keyup.lg', function (e) {
                  if (_this.items.length > 1) {
                    if (e.keyCode === 37) {
                      e.preventDefault();
                      _this.goToPrevSlide();
                    }

                    if (e.keyCode === 39) {
                      e.preventDefault();
                      _this.goToNextSlide();
                    }
                  }
                });
              }

              _lgUtils2.default.on(window, 'keydown.lg', function (e) {
                if (_this.s.escKey === true && e.keyCode === 27) {
                  e.preventDefault();
                  if (
                    !_lgUtils2.default.hasClass(_this.outer, 'lg-thumb-open')
                  ) {
                    _this.destroy();
                  } else {
                    _lgUtils2.default.removeClass(_this.outer, 'lg-thumb-open');
                  }
                }
              });
            };

            Plugin.prototype.arrow = function () {
              var _this = this;
              _lgUtils2.default.on(
                this.outer.querySelector('.lg-prev'),
                'click.lg',
                function () {
                  _this.goToPrevSlide();
                }
              );

              _lgUtils2.default.on(
                this.outer.querySelector('.lg-next'),
                'click.lg',
                function () {
                  _this.goToNextSlide();
                }
              );
            };

            Plugin.prototype.arrowDisable = function (index) {
              // Disable arrows if s.hideControlOnEnd is true
              if (!this.s.loop && this.s.hideControlOnEnd) {
                var next = this.outer.querySelector('.lg-next');
                var prev = this.outer.querySelector('.lg-prev');
                if (index + 1 < this.___slide.length) {
                  next.removeAttribute('disabled');
                  _lgUtils2.default.removeClass(next, 'disabled');
                } else {
                  next.setAttribute('disabled', 'disabled');
                  _lgUtils2.default.addClass(next, 'disabled');
                }

                if (index > 0) {
                  prev.removeAttribute('disabled');
                  _lgUtils2.default.removeClass(prev, 'disabled');
                } else {
                  prev.setAttribute('disabled', 'disabled');
                  _lgUtils2.default.addClass(prev, 'disabled');
                }
              }
            };

            Plugin.prototype.setTranslate = function (el, xValue, yValue) {
              // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
              if (this.s.useLeft) {
                el.style.left = xValue;
              } else {
                _lgUtils2.default.setVendor(
                  el,
                  'Transform',
                  'translate3d(' + xValue + 'px, ' + yValue + 'px, 0px)'
                );
              }
            };

            Plugin.prototype.touchMove = function (startCoords, endCoords) {
              var distance = endCoords - startCoords;

              if (Math.abs(distance) > 15) {
                // reset opacity and transition duration
                _lgUtils2.default.addClass(this.outer, 'lg-dragging');

                // move current slide
                this.setTranslate(this.___slide[this.index], distance, 0);

                // move next and prev slide with current slide
                this.setTranslate(
                  document.querySelector('.lg-prev-slide'),
                  -this.___slide[this.index].clientWidth + distance,
                  0
                );
                this.setTranslate(
                  document.querySelector('.lg-next-slide'),
                  this.___slide[this.index].clientWidth + distance,
                  0
                );
              }
            };

            Plugin.prototype.touchEnd = function (distance) {
              var _this = this;

              // keep slide animation for any mode while dragg/swipe
              if (_this.s.mode !== 'lg-slide') {
                _lgUtils2.default.addClass(_this.outer, 'lg-slide');
              }

              for (var i = 0; i < this.___slide.length; i++) {
                if (
                  !_lgUtils2.default.hasClass(this.___slide[i], 'lg-current') &&
                  !_lgUtils2.default.hasClass(
                    this.___slide[i],
                    'lg-prev-slide'
                  ) &&
                  !_lgUtils2.default.hasClass(this.___slide[i], 'lg-next-slide')
                ) {
                  this.___slide[i].style.opacity = '0';
                }
              }

              // set transition duration
              setTimeout(function () {
                _lgUtils2.default.removeClass(_this.outer, 'lg-dragging');
                if (
                  distance < 0 &&
                  Math.abs(distance) > _this.s.swipeThreshold
                ) {
                  _this.goToNextSlide(true);
                } else if (
                  distance > 0 &&
                  Math.abs(distance) > _this.s.swipeThreshold
                ) {
                  _this.goToPrevSlide(true);
                } else if (Math.abs(distance) < 5) {
                  // Trigger click if distance is less than 5 pix
                  _lgUtils2.default.trigger(_this.el, 'onSlideClick');
                }

                for (var i = 0; i < _this.___slide.length; i++) {
                  _this.___slide[i].removeAttribute('style');
                }
              });

              // remove slide class once drag/swipe is completed if mode is not slide
              setTimeout(function () {
                if (
                  !_lgUtils2.default.hasClass(_this.outer, 'lg-dragging') &&
                  _this.s.mode !== 'lg-slide'
                ) {
                  _lgUtils2.default.removeClass(_this.outer, 'lg-slide');
                }
              }, _this.s.speed + 100);
            };

            Plugin.prototype.enableSwipe = function () {
              var _this = this;
              var startCoords = 0;
              var endCoords = 0;
              var isMoved = false;

              if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {
                for (var i = 0; i < _this.___slide.length; i++) {
                  /*jshint loopfunc: true */
                  _lgUtils2.default.on(
                    _this.___slide[i],
                    'touchstart.lg',
                    function (e) {
                      if (
                        !_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed') &&
                        !_this.lgBusy
                      ) {
                        e.preventDefault();
                        _this.manageSwipeClass();
                        startCoords = e.targetTouches[0].pageX;
                      }
                    }
                  );
                }

                for (var j = 0; j < _this.___slide.length; j++) {
                  /*jshint loopfunc: true */
                  _lgUtils2.default.on(
                    _this.___slide[j],
                    'touchmove.lg',
                    function (e) {
                      if (
                        !_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed')
                      ) {
                        e.preventDefault();
                        endCoords = e.targetTouches[0].pageX;
                        _this.touchMove(startCoords, endCoords);
                        isMoved = true;
                      }
                    }
                  );
                }

                for (var k = 0; k < _this.___slide.length; k++) {
                  /*jshint loopfunc: true */
                  _lgUtils2.default.on(
                    _this.___slide[k],
                    'touchend.lg',
                    function () {
                      if (
                        !_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed')
                      ) {
                        if (isMoved) {
                          isMoved = false;
                          _this.touchEnd(endCoords - startCoords);
                        } else {
                          _lgUtils2.default.trigger(_this.el, 'onSlideClick');
                        }
                      }
                    }
                  );
                }
              }
            };

            Plugin.prototype.enableDrag = function () {
              var _this = this;
              var startCoords = 0;
              var endCoords = 0;
              var isDraging = false;
              var isMoved = false;
              if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
                for (var i = 0; i < _this.___slide.length; i++) {
                  /*jshint loopfunc: true */
                  _lgUtils2.default.on(
                    _this.___slide[i],
                    'mousedown.lg',
                    function (e) {
                      // execute only on .lg-object
                      if (
                        !_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed')
                      ) {
                        if (
                          _lgUtils2.default.hasClass(e.target, 'lg-object') ||
                          _lgUtils2.default.hasClass(e.target, 'lg-video-play')
                        ) {
                          e.preventDefault();

                          if (!_this.lgBusy) {
                            _this.manageSwipeClass();
                            startCoords = e.pageX;
                            isDraging = true;

                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            _this.outer.scrollLeft += 1;
                            _this.outer.scrollLeft -= 1;

                            // *

                            _lgUtils2.default.removeClass(
                              _this.outer,
                              'lg-grab'
                            );
                            _lgUtils2.default.addClass(
                              _this.outer,
                              'lg-grabbing'
                            );

                            _lgUtils2.default.trigger(_this.el, 'onDragstart');
                          }
                        }
                      }
                    }
                  );
                }

                _lgUtils2.default.on(window, 'mousemove.lg', function (e) {
                  if (isDraging) {
                    isMoved = true;
                    endCoords = e.pageX;
                    _this.touchMove(startCoords, endCoords);
                    _lgUtils2.default.trigger(_this.el, 'onDragmove');
                  }
                });

                _lgUtils2.default.on(window, 'mouseup.lg', function (e) {
                  if (isMoved) {
                    isMoved = false;
                    _this.touchEnd(endCoords - startCoords);
                    _lgUtils2.default.trigger(_this.el, 'onDragend');
                  } else if (
                    _lgUtils2.default.hasClass(e.target, 'lg-object') ||
                    _lgUtils2.default.hasClass(e.target, 'lg-video-play')
                  ) {
                    _lgUtils2.default.trigger(_this.el, 'onSlideClick');
                  }

                  // Prevent execution on click
                  if (isDraging) {
                    isDraging = false;
                    _lgUtils2.default.removeClass(_this.outer, 'lg-grabbing');
                    _lgUtils2.default.addClass(_this.outer, 'lg-grab');
                  }
                });
              }
            };

            Plugin.prototype.manageSwipeClass = function () {
              var touchNext = this.index + 1;
              var touchPrev = this.index - 1;
              var length = this.___slide.length;
              if (this.s.loop) {
                if (this.index === 0) {
                  touchPrev = length - 1;
                } else if (this.index === length - 1) {
                  touchNext = 0;
                }
              }

              for (var i = 0; i < this.___slide.length; i++) {
                _lgUtils2.default.removeClass(
                  this.___slide[i],
                  'lg-next-slide'
                );
                _lgUtils2.default.removeClass(
                  this.___slide[i],
                  'lg-prev-slide'
                );
              }

              if (touchPrev > -1) {
                _lgUtils2.default.addClass(
                  this.___slide[touchPrev],
                  'lg-prev-slide'
                );
              }

              _lgUtils2.default.addClass(
                this.___slide[touchNext],
                'lg-next-slide'
              );
            };

            Plugin.prototype.mousewheel = function () {
              var _this = this;
              _lgUtils2.default.on(_this.outer, 'mousewheel.lg', function (e) {
                if (!e.deltaY) {
                  return;
                }

                if (e.deltaY > 0) {
                  _this.goToPrevSlide();
                } else {
                  _this.goToNextSlide();
                }

                e.preventDefault();
              });
            };

            Plugin.prototype.closeGallery = function () {
              var _this = this;
              var mousedown = false;
              _lgUtils2.default.on(
                this.outer.querySelector('.lg-close'),
                'click.lg',
                function () {
                  _this.destroy();
                }
              );

              if (_this.s.closable) {
                // If you drag the slide and release outside gallery gets close on chrome
                // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
                _lgUtils2.default.on(_this.outer, 'mousedown.lg', function (e) {
                  if (
                    _lgUtils2.default.hasClass(e.target, 'lg-outer') ||
                    _lgUtils2.default.hasClass(e.target, 'lg-item') ||
                    _lgUtils2.default.hasClass(e.target, 'lg-img-wrap')
                  ) {
                    mousedown = true;
                  } else {
                    mousedown = false;
                  }
                });

                _lgUtils2.default.on(_this.outer, 'mouseup.lg', function (e) {
                  if (
                    _lgUtils2.default.hasClass(e.target, 'lg-outer') ||
                    _lgUtils2.default.hasClass(e.target, 'lg-item') ||
                    (_lgUtils2.default.hasClass(e.target, 'lg-img-wrap') &&
                      mousedown)
                  ) {
                    if (
                      !_lgUtils2.default.hasClass(_this.outer, 'lg-dragging')
                    ) {
                      _this.destroy();
                    }
                  }
                });
              }
            };

            Plugin.prototype.destroy = function (d) {
              var _this = this;

              if (!d) {
                _lgUtils2.default.trigger(_this.el, 'onBeforeClose');
              }

              document.body.scrollTop = _this.prevScrollTop;
              document.documentElement.scrollTop = _this.prevScrollTop;

              /**
               * if d is false or undefined destroy will only close the gallery
               * plugins instance remains with the element
               *
               * if d is true destroy will completely remove the plugin
               */

              if (d) {
                if (!_this.s.dynamic) {
                  // only when not using dynamic mode is $items a jquery collection

                  for (var i = 0; i < this.items.length; i++) {
                    _lgUtils2.default.off(this.items[i], '.lg');
                    _lgUtils2.default.off(this.items[i], '.lgcustom');
                  }
                }

                var lguid = _this.el.getAttribute('lg-uid');
                delete window.lgData[lguid];
                _this.el.removeAttribute('lg-uid');
              }

              // Unbind all events added by lightGallery
              _lgUtils2.default.off(this.el, '.lgtm');

              // Distroy all lightGallery modules
              for (var key in window.lgModules) {
                if (_this.modules[key]) {
                  _this.modules[key].destroy(d);
                }
              }

              this.lGalleryOn = false;

              clearTimeout(_this.hideBartimeout);
              this.hideBartimeout = false;
              _lgUtils2.default.off(window, '.lg');
              _lgUtils2.default.removeClass(document.body, 'lg-on');
              _lgUtils2.default.removeClass(document.body, 'lg-from-hash');

              if (_this.outer) {
                _lgUtils2.default.removeClass(_this.outer, 'lg-visible');
              }

              _lgUtils2.default.removeClass(
                document.querySelector('.lg-backdrop'),
                'in'
              );
              setTimeout(function () {
                try {
                  if (_this.outer) {
                    _this.outer.parentNode.removeChild(_this.outer);
                  }

                  if (document.querySelector('.lg-backdrop')) {
                    document
                      .querySelector('.lg-backdrop')
                      .parentNode.removeChild(
                        document.querySelector('.lg-backdrop')
                      );
                  }

                  if (!d) {
                    _lgUtils2.default.trigger(_this.el, 'onCloseAfter');
                  }
                  _this.el.focus();
                } catch (err) {}
              }, _this.s.backdropDuration + 50);
            };

            window.lightGallery = function (el, options) {
              if (!el) {
                return;
              }

              try {
                if (!el.getAttribute('lg-uid')) {
                  var uid = 'lg' + window.lgData.uid++;
                  window.lgData[uid] = new Plugin(el, options);
                  el.setAttribute('lg-uid', uid);
                } else {
                  window.lgData[el.getAttribute('lg-uid')].init();
                }
              } catch (err) {
                console.error('lightGallery has not initiated properly', err);
              }
            };
          });
        },
        { './lg-utils': 1 },
      ],
    },
    {},
    [2]
  )(2);
});
const acc = document.getElementsByClassName('accordion');

const setActive = (el) => {
  if (acc.length > 0) {
    acc[el - 1].classList.toggle('acc-active');
    const nextElement = acc[el - 1].nextElementSibling;
    nextElement.style.maxHeight = nextElement.scrollHeight + 'px';
  }
};
setActive(1);

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    this.classList.toggle('acc-active');
    let panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
}
const overlay = document.querySelector('.overlay'),
  mobile = document.querySelector('.mobile'),
  burger = document.querySelector('#burger'),
  closeBtn = document.querySelector('.close');

function noScroll() {
  window.scrollTo(0, 0);
}
if (burger) {
  burger.addEventListener('click', (e) => {
    overlay.style.width = '100%';
    overlay.style.opacity = '1';
    mobile.style.width = '300px';
    mobile.style.opacity = '1';
    window.addEventListener('scroll', noScroll);
  });
}
if (overlay) {
  overlay.addEventListener('click', (e) => {
    overlay.style.width = '0px';
    overlay.style.opacity = '0';
    mobile.style.width = '0px';
    mobile.style.opacity = '0';
    window.removeEventListener('scroll', noScroll);
  });
}
if (closeBtn) {
  closeBtn.addEventListener('click', (e) => {
    overlay.style.width = '0px';
    overlay.style.opacity = '0';
    mobile.style.width = '0px';
    mobile.style.opacity = '0';
    window.removeEventListener('scroll', noScroll);
  });
}
const overlayBg = document.querySelector('.overlay'),
  closeBtnModal = document.querySelector('.close-modal'),
  modal = document.querySelector('#modal'),
  mobilePopup = document.querySelector('.mobile'),
  callbackBtns = document.querySelectorAll('.callback');

// function noScroll() {
//   window.scrollTo(0, 0);
// }
if (callbackBtns) {
  callbackBtns.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      overlayBg.style.width = '100%';
      overlayBg.style.opacity = '1';
      modal.style.width = '350px';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      mobilePopup.style.width = '0px';
      mobilePopup.style.opacity = '0';
      window.addEventListener('scroll', noScroll);
    });
  });
}
if (overlay) {
  overlay.addEventListener('click', (e) => {
    overlayBg.style.width = '0px';
    overlayBg.style.opacity = '0';
    modal.style.width = '0px';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    window.removeEventListener('scroll', noScroll);
  });
}
if (closeBtnModal) {
  closeBtnModal.addEventListener('click', (e) => {
    overlayBg.style.width = '0px';
    overlayBg.style.opacity = '0';
    modal.style.width = '0px';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    window.removeEventListener('scroll', noScroll);
  });
}
jQuery(function ($) {
  $('.slider').slick({
    dots: true,
    infinite: true,
    arrows: true,
    adaptiveHeight: true,
    prevArrow: '.prev',
    nextArrow: '.next',
    customPaging: function (slider, i) {
      return '<div class="custom-slick-dots" id=' + i + '></div>';
    },
  });
});
jQuery(function ($) {
  $('.slider-certificates').slick({
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    prevArrow: '.prev2',
    nextArrow: '.next2',
    customPaging: function (slider, i) {
      return '<div class="custom-slick-dots" id=' + i + '></div>';
    },
  });
});
const trigger = document.querySelector('.category-trigger');

if (trigger) {
  trigger.addEventListener('click', (e) => {
    let sidebar = document.querySelector('#sidebar');
    if (sidebar.style.width == '100%') {
      sidebar.style.width = '0';
      sidebar.style.overflow = 'hidden';
    } else {
      sidebar.style.width = '100%';
      sidebar.style.overflow = 'visible';
    }
  });
}

lightGallery(document.querySelector('.slider-certificates'), {
  selector: 'a.lightgallery',
});
