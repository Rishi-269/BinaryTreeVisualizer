//render nodes, edges and tree

function drawNode(x, y, value, id) {
    const circle = document.createElementNS(svgNs, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('class', `N${id} node`);
    treeSvg.appendChild(circle);

    const text = document.createElementNS(svgNs, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + (nodeRadius*0.25));
    text.setAttribute('font-size', Math.floor(nodeRadius*0.7) + 'px');
    text.setAttribute('class', `N${id} val`);
    text.textContent = value;
    treeSvg.appendChild(text);
}

function drawEdge(fromX, fromY, toX, toY, id) {
    const line = document.createElementNS(svgNs, 'line');
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', toX);
    line.setAttribute('y2', toY);
    line.setAttribute('class', `N${id} edge`);
    treeSvg.insertAdjacentElement('afterbegin', line);
}

function setDimensionSVG() {
    let width = 3*window.innerWidth/4;
    if(width < (1<<maxHeight)*nodeRadius*4){
        width = (1<<maxHeight)*nodeRadius*4;
    }
    treeSvg.setAttribute('width', width);
    treeContainer.style.width = width;

    const verticalGap = nodeRadius*4;
    treeSvg.setAttribute('height', 2*nodeRadius + 10 + maxHeight*verticalGap);

    return {width, verticalGap};
}

function displayTree() {
    pause = false;
    buildAnimation = false;
    treeSvg.innerHTML = "";

    const {width, verticalGap} = setDimensionSVG();

    if(root == null)
        return;

    const preorder = (curr, x, y, horizontalGap) => {

        drawNode(x, y, curr.value, curr.id);

        if(curr.left != null){
            drawEdge(x, y, x - horizontalGap, y + verticalGap, curr.left.id);
            preorder(curr.left, x - horizontalGap, y + verticalGap, horizontalGap/2);
        }
        
        if(curr.right != null){
            drawEdge(x, y, x + horizontalGap, y + verticalGap, curr.right.id);
            preorder(curr.right, x + horizontalGap, y + verticalGap, horizontalGap/2);
        }
    }

    preorder(root, width/2, nodeRadius + 5, width/4);
}
