export default {
  slideGraduate(currentIndex, itemIndex, swipingOffset, itemWidth) {
    let scaleNum = 1;
    const indexOffset = itemIndex - currentIndex;
    const progress = indexOffset + swipingOffset / itemWidth;
    if (progress > -3 && progress < 3) {
      if (progress >= 0) {
        scaleNum = 1.2 * (2 - progress) / 2
      } else {
        scaleNum = 1.2 * (progress + 2) / 2
      }
      let transition = swipingOffset === 0 ? 'transform .45s ease-out' : '';
      return {
        WebkitTransform: `scale(${scaleNum}, ${scaleNum})`,
        WebkitTransition: transition,
        visibility: 'inherit'
      };
    } else {
      return {
        visibility: 'hidden'
      };
    }
  }
}
