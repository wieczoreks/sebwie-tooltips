const debounce = (func, delay) => { 
    let timer
    return function() { 
        const context = this
        const args = arguments 
            clearTimeout(timer) 
                timer = setTimeout(() => func.apply(context, args), delay) 
    } 
}
  
class Tooltip {
    constructor() {
        this.docHeight = document.documentElement.clientHeight;
        this.docWidth = document.documentElement.clientWidth;
        this.elem = "span"
        this.offset = 5;
    }
        
    createTooltip = (elem) => {
        let tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.classList.add('animFadeIn');
        let textNode = elem.dataset.tooltip;
        tooltip.appendChild(document.createTextNode(textNode));
        return tooltip
    }
    positionTooltip = (tooltip) => {
        let firstChild = document.body.firstChild;
        firstChild.parentNode.insertBefore(tooltip, firstChild);
    }
    getBox = (el) => {
        return el.getBoundingClientRect()
    }
    setTopPosition = (tooltip, tooltipBox, elBox) => {
        let topPos = window.pageYOffset + elBox.top - (tooltipBox.height + this.offset);
        let leftPos = window.pageXOffset + elBox.left
        tooltip.classList.add('top');
        tooltip.setAttribute('style', `top:${topPos}px; left:${leftPos}px;`);
    }
    setBottomPosition = (tooltip, elBox) => {
        let leftPos = window.pageXOffset + elBox.left;
        let topPos = window.pageYOffset + elBox.top + (elBox.height + this.offset);
        tooltip.classList.add('bottom');
        tooltip.setAttribute('style', `top:${topPos}px; left:${leftPos}px;`)
    }
    setLeftPosition = (tooltip, tooltipBox, elBox) => {
        let topPos = window.pageYOffset + elBox.top;
        let leftPos = window.pageXOffset + elBox.left - (tooltipBox.width + this.offset)
        tooltip.classList.add('left');
        tooltip.setAttribute('style', `top:${topPos}px; left:${leftPos}px;`)
    } 
    init = () => {
        document.addEventListener('DOMContentLoaded', () => {  
            const elems = document.querySelectorAll(this.elem)
            for (let i = 0; i < elems.length; i++) {
                let elem = elems[i];
                let tooltip;
                elem.addEventListener('mouseover', debounce((e) => {                   
                    tooltip = this.createTooltip(elem);
                    this.positionTooltip(tooltip);
                    let elemBox = this.getBox(elem);
                    let tooltipBox = this.getBox(tooltip);
                    this.setTopPosition(tooltip, tooltipBox, elemBox);
                    if (this.getBox(tooltip).top < 0 && (this.getBox(tooltip).left >= 0 && this.getBox(tooltip).left < (this.docWidth - this.getBox(tooltip).width))) {
                        tooltip.classList.remove('top');
                        this.setBottomPosition(tooltip, elemBox)

                    } else if (this.getBox(tooltip).left >= (this.docWidth - this.getBox(tooltip).width)) {
                        tooltip.classList.remove('top');
                        this.setLeftPosition(tooltip, tooltipBox, elemBox)
                    }
                },500));

                elem.addEventListener('mouseout', debounce((e) => {
                            if(tooltip){
                                tooltip.remove();
                            }
                },500))
            }
        })
    }
}

let tooltip = new Tooltip()
tooltip.init()