export default class UIHelper {
  static addClassToElements(className, ...elements) {
    elements.forEach(element => element.classList.add(className));
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

  static appendWithDelay(element, parent, appendDelay, showDelay, animationFn = null) {
    setTimeout(() => { 
      parent.appendChild(element);
      if (animationFn) animationFn(element);
    }, appendDelay);

    setTimeout(() => {
      element.classList.add('game-append') 
    }, showDelay);
  }
}