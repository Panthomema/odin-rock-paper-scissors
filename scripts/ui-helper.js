export class UIHelper 
{
  static addClassToElements(className, ...elements) {
    elements.forEach(element => element.classList.add(className));
  }

  static removeClassFromlements(className, ...elements) {
    elements.forEach(element => element.classList.remove(className));
  }

  static appendElements(parent, ...elements) {
    elements.forEach(element => parent.appendChild(element));
  }

  static removeElements(...elements) {
    elements.forEach(element => element.remove());
  }

  static createElement(tag, id, ...classNames) {
    const element = document.createElement(tag);
    if (id) element.setAttribute('id', id);
    classNames.forEach(name => element.classList.add(name));

    return element;
  }

  static appendWithDelay(
    parent, element, transitionClass, appendDelay, showDelay, animationFn = null
  ) {
    element.classList.add(transitionClass);

    setTimeout(() => { 
      parent.appendChild(element);
      if (animationFn) animationFn(element);
    }, appendDelay);

    setTimeout(() => {
      element.classList.remove('hidden');
    }, showDelay);
  }

  static createFAsIcon(prefix, iconName) {
    const checkedIcon = document.createElement('i');
    checkedIcon.classList.add(prefix, iconName);
    
    return checkedIcon;
  }

  static createLottieAnimation(url) {
    const lottiePlayer = document.createElement('lottie-player');
    const properties = {
      'src': url,
      'autoplay': '',
      'loop': '',
      'mode': 'normal',
    };

    Object.entries(properties).forEach(([attribute, value]) => {
      lottiePlayer.setAttribute(attribute, value);
    });

    return lottiePlayer;
  }

  static createSVGIcon(url, ...classNames) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    classNames.forEach(name => svg.classList.add(name));
    
    const image = document.createElementNS(
      "http://www.w3.org/2000/svg",
       "image"
    );
    image.setAttribute('href', url);
    
    svg.appendChild(image);

    return svg;
  }
}