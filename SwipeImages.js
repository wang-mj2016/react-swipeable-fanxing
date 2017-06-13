/**
 * Created by fanxing on 16/7/7.
 * 要翻页按钮得自己写样式
 * TODO:支持transition自定义,支持一屏幕显示更多元素,支持lazyLoad
 */
import React, { PropTypes } from 'react';
import Swipeable from 'react-swipeable';
import classNames from 'classnames'
import slideAnimates from './SlideAnimates';

export default class SwipeImages extends React.Component {
  constructor(props) {
    super(props);
    const { startIndex, startOffset } = this.props;
    this.state = {
      itemWidth: 0,
      containerHeight: 0,
      initOffSet: startOffset,
      currentIndex: startIndex,
      offset: 0,
      isFlick: false
    };
    this.slideAnimates = slideAnimates;
  }

  componentDidMount() {
    const { startOffset, showNum, containerHeight } = this.props;

    const resizeFunction = setInit.bind(this);
    window.addEventListener('resize', resizeFunction);
    if (window.innerWidth || document.body.clientWidth) {
      resizeFunction();
    }

    function setInit() {
      const screenWidth = window.innerWidth || document.body.clientWidth;
      const itemWidth = screenWidth / showNum;

      this.setState({
        itemWidth: itemWidth,
        containerHeight: containerHeight || itemWidth,
        initOffSet: startOffset || itemWidth
      });
      window.removeEventListener('resize', resizeFunction);
    }
  }

  slideToIndex(index) {
    const { items, onSwiped, disabled } = this.props;
    if (disabled) {
      return;
    }
    const slideCount = items.length - 1;
    let currentIndex = index;
    if (index < 0) {
      currentIndex = 0
    } else if (index > slideCount) {
      currentIndex = slideCount
    }
    onSwiped && onSwiped(currentIndex);
    this.setState({
      currentIndex: currentIndex,
      offset: 0,
      //slideStyle: {
        //transition: 'transform .45s ease-out'
      //},
      slidesWrapStyle: {
        transition: 'transform .45s ease-out'
      }
    })
  }

  toPrev() {
    this.slideToIndex(this.state.currentIndex - 1)
  }

  toNext() {
    this.slideToIndex(this.state.currentIndex + 1)
  }

  getSlideStyle(index) {
    const { diyAnimateMethod, slideAnimate } = this.props;
    const { currentIndex, offset } = this.state;
    let slideAnimateStyle;
    if (diyAnimateMethod) {
      slideAnimateStyle = diyAnimateMethod(currentIndex, index, offset, this.state.itemWidth);
    } else if (slideAnimate && this.slideAnimates[slideAnimate]) {
      slideAnimateStyle = this.slideAnimates[slideAnimate](currentIndex, index, offset, this.state.itemWidth);
    } else {
      slideAnimateStyle = {};
    }
    return slideAnimateStyle;
  }

  getSlidesWrapStyle() {
    const { currentIndex, offset } = this.state;

    let transformX = offset + this.state.initOffSet - currentIndex * this.state.itemWidth;
    return {
      WebkitTransform: `translate3d(${transformX}px, 0, 0)`
    };
  }

  handleSwiping(e, deltaX) {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.setState({offset: -deltaX, slidesWrapStyle: {}, slideStyle: {}})
  }

  handleSwipedLeft() {
    let movePercent = Math.abs(this.state.offset) / this.state.itemWidth;
    let goNum = this.state.isFlick &&  movePercent < 1?
      1 :
      Math.round(movePercent);
    this.slideToIndex(this.state.currentIndex + goNum)
  }

  handleSwipedRight() {
    let movePercent = Math.abs(this.state.offset) / this.state.itemWidth;

    let goNum = this.state.isFlick &&  movePercent < 1?
      1 :
      Math.round(movePercent);
    this.slideToIndex(this.state.currentIndex - goNum)
  }

  handleSwiped(ev, x, y, isFlick) {
    this.setState({
      isFlick: isFlick
    })
  }

  render() {
    const { items, containerClassName, itemKey ,buttonLeft, buttonRight} = this.props;
    const swipeClassName = classNames('swipe-images-component-slides', containerClassName);
    let slides = items.map((itemData, index) => {
      return (
        <div
          key={itemKey || index}
          className="swipe-images-component-slide"
          style={Object.assign(this.getSlideStyle(index), this.state.slideStyle, {width: this.state.itemWidth})}
        >
          <div className="swipe-images-component-image">
            <img src={itemData.imageUrl} alt=""/>
          </div>
          {itemData.diyElement}
        </div>
      )
    });

    return (
      <Swipeable
        className="swipe-images-component-container"
        onSwiping={this.handleSwiping.bind(this)}
        onSwipedLeft={this.handleSwipedLeft.bind(this)}
        onSwipedRight={this.handleSwipedRight.bind(this)}
        onSwiped={this.handleSwiped.bind(this)}
        flickThreshold={0.1}
        style={{height: this.state.containerHeight}}
      >
        <div className="swipe-images-component-nav-button" onClick={this.toPrev.bind(this)} >{buttonLeft}</div>
        <div className="swipe-images-component-nav-button" onClick={this.toNext.bind(this)} >{buttonRight}</div>
        <div
          className={swipeClassName}
          style={Object.assign(this.getSlidesWrapStyle(), this.state.slidesWrapStyle, {width: this.state.itemWidth})}
        >
          {slides}
        </div>
      </Swipeable>
    )
  }
}

SwipeImages.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired,
      previewImageUrl: PropTypes.string,
      diyElement: PropTypes.element
    })
  ).isRequired,
  startIndex: PropTypes.number,
  startOffset: PropTypes.number,
  showNum: PropTypes.number,
  onSwiped: PropTypes.func,
  diyAnimateMethod: PropTypes.func,
  slideAnimate: PropTypes.string,
  containerClassName: PropTypes.string,
  itemKey: PropTypes.string,
  containerHeight: PropTypes.string,
  buttonLeft: PropTypes.element,
  buttonRight: PropTypes.element,
  disabled: PropTypes.bool
};

SwipeImages.defaultProps = {
  startOffset: 0,
  showNum: 3,
  startIndex: 0,
  buttonLeft: null,
  buttonRight: null
};

