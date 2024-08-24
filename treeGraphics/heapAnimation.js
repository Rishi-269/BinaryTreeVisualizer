/*
index.js
    variables -> heap[], isMinHeap, inputHeap, isInputMin
    To render -> treeSvg, nodeRadius, svgNs
    animation control -> buildAnimation, pause, animationDuration
main.js
    drawNode, drawEdge
constructTree.js
    parentHeap, leftHeap, rightHeap, comparatorHeap, swapHeap
*/

async function animateInsertHeap(val){
    if(dataType === "number")
        val = Number(val);

    heap.push(val);
    if(heap.length === 1)
        return true;

    //after pushing if the length becomes power of 2 then height changes
    let renderAgain = (heap.length&(heap.length - 1)) === 0 ? true : false;

    let index = heap.length - 1;
    let parent = parentHeap(index);

    let parentNode = treeSvg.querySelector(`.N${parent}.node`);
    let x = Number(parentNode.getAttribute('cx'));
    let y = Number(parentNode.getAttribute('cy'));
    let height = Math.floor((y - 5 - nodeRadius)/(nodeRadius*4));
    let horizontalGap = (Number(treeSvg.getAttribute('width'))/(4*(1<<height)));

    if(parent !== parentHeap(index - 1)) //then left node
        horizontalGap = -horizontalGap;
    drawEdge(x, y, x + horizontalGap, y + nodeRadius*4, index);
    drawNode(x + horizontalGap, y + nodeRadius*4, val, index);
    let indexNode = treeSvg.querySelector(`.N${index}.node`);
    indexNode.classList.add('found');

    while(comparatorHeap(parent, index)){

        const parentNode = treeSvg.querySelector(`.N${parent}.node`);
        const parentText = treeSvg.querySelector(`.N${parent}.val`);
        const indexNode = treeSvg.querySelector(`.N${index}.node`);
        const indexText = treeSvg.querySelector(`.N${index}.val`);

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation){
            renderAgain = true;
            break;
        }

        let tempX = indexNode.getAttribute('cx');
        let tempY = indexNode.getAttribute('cy');
        indexNode.setAttribute('cx', parentNode.getAttribute('cx'));
        indexNode.setAttribute('cy', parentNode.getAttribute('cy'));

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation){
            renderAgain = true;
            break;
        }

        parentNode.setAttribute('cx', tempX);
        parentNode.setAttribute('cy', tempY);

        tempX = indexText.getAttribute('x');
        tempY = indexText.getAttribute('y');
        indexText.setAttribute('x', parentText.getAttribute('x'));
        indexText.setAttribute('y', parentText.getAttribute('y'));
        parentText.setAttribute('x', tempX);
        parentText.setAttribute('y', tempY);

        parentNode.setAttribute('class', `N${index} node`);
        indexNode.setAttribute('class', `N${parent} node found`);
        parentText.setAttribute('class', `N${index} val`);
        indexText.setAttribute('class', `N${parent} val`);

        swapHeap(parent, index);

        index = parent;
        parent = parentHeap(index);
    }

    indexNode.classList.remove('found');

    while(comparatorHeap(parent, index)){
        swapHeap(parent, index);
        index = parent;
        parent = parentHeap(index);
    }

    return renderAgain;
}

async function animateHeapify(index){

    let renderAgain = false;
    
    while(index < heap.length){
        let top = index;
        let left = leftHeap(top);
        let right = rightHeap(top);
        if(left < heap.length && comparatorHeap(top, left))
            top = left;
        if(right < heap.length && comparatorHeap(top, right))
            top = right;

        if(top === index)
            break;

        const topNode = treeSvg.querySelector(`.N${top}.node`);
        const topText = treeSvg.querySelector(`.N${top}.val`);
        const indexNode = treeSvg.querySelector(`.N${index}.node`);
        const indexText = treeSvg.querySelector(`.N${index}.val`);
        
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation){
            renderAgain = true;
            break;
        }

        let tempX = indexNode.getAttribute('cx');
        let tempY = indexNode.getAttribute('cy');
        indexNode.setAttribute('cx', topNode.getAttribute('cx'));
        indexNode.setAttribute('cy', topNode.getAttribute('cy'));

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation){
            renderAgain = true;
            break;
        }

        topNode.setAttribute('cx', tempX);
        topNode.setAttribute('cy', tempY);

        tempX = indexText.getAttribute('x');
        tempY = indexText.getAttribute('y');
        indexText.setAttribute('x', topText.getAttribute('x'));
        indexText.setAttribute('y', topText.getAttribute('y'));
        topText.setAttribute('x', tempX);
        topText.setAttribute('y', tempY);

        topNode.setAttribute('class', `N${index} node`);
        indexNode.setAttribute('class', `N${top} node found`);
        topText.setAttribute('class', `N${index} val`);
        indexText.setAttribute('class', `N${top} val`);

        swapHeap(top, index);
        index = top;
    }

    treeSvg.querySelector(`.N${index}.node`).classList.remove('found');

    while(index < heap.length){
        let top = index;
        let left = leftHeap(top);
        let right = rightHeap(top);
        if(left < heap.length && comparatorHeap(top, left))
            top = left;
        if(right < heap.length && comparatorHeap(top, right))
            top = right;

        if(top === index)
            break;
        swapHeap(top, index);
        index = top;
    }

    return renderAgain;
}

async function animateExtractHeap(){

    if(heap.length === 0)
        return false;

    if(heap.length === 1){
        treeSvg.querySelector(`.N0.node`).remove();
        treeSvg.querySelector(`.N0.val`).remove();
        heap.pop();
        return true;
    }

    const extractNode = treeSvg.querySelector(`.N0.node`);
    const extractText = treeSvg.querySelector(`.N0.val`);
    const lastNode = treeSvg.querySelector(`.N${heap.length - 1}.node`);
    const lastText = treeSvg.querySelector(`.N${heap.length - 1}.val`);
    const lastEdge = treeSvg.querySelector(`.N${heap.length - 1}.edge`);

    lastNode.classList.add('found');
    extractNode.classList.add('focused-node');

    await new Promise(resolve => setTimeout(resolve, animationDuration));
    while (pause) await new Promise(resolve => setTimeout(resolve, 100));
    if(!buildAnimation)
        return false;

    let tempX = extractNode.getAttribute('cx');
    let tempY = extractNode.getAttribute('cy');
    extractNode.setAttribute('cx', lastNode.getAttribute('cx'));
    extractNode.setAttribute('cy', lastNode.getAttribute('cy'));

    await new Promise(resolve => setTimeout(resolve, animationDuration));
    while (pause) await new Promise(resolve => setTimeout(resolve, 100));
    if(!buildAnimation)
        return false;

    lastNode.setAttribute('cx', tempX);
    lastNode.setAttribute('cy', tempY);

    tempX = extractText.getAttribute('x');
    tempY = extractText.getAttribute('y');
    extractText.setAttribute('x', lastText.getAttribute('x'));
    extractText.setAttribute('y', lastText.getAttribute('y'));
    lastText.setAttribute('x', tempX);
    lastText.setAttribute('y', tempY);

    lastNode.setAttribute('class', `N0 node found`);
    lastText.setAttribute('class', `N0 val`);

    await new Promise(resolve => setTimeout(resolve, animationDuration*2));
    while (pause) await new Promise(resolve => setTimeout(resolve, 100));
    if(!buildAnimation)
        return false;

    extractText.remove();
    extractNode.remove();
    lastEdge.remove();

    swapHeap(0, heap.length - 1);
    heap.pop();

    if(await animateHeapify(0)) //will only return true if animation was interrupted
        return true;

    //if length was power of 2 but just became less than that
    return (heap.length & (heap.length + 1)) === 0 ? true : false;
}

async function animateBuildHeap(){
    treeSvg.innerHTML = "";

    const height = inputHeap.length === 0 ? -1 : Math.floor(Math.log2(inputHeap.length));
    let width = 3*window.innerWidth/4;
    if(width < (1<<height)*nodeRadius*4){
        width = (1<<height)*nodeRadius*4;
    }
    treeSvg.setAttribute('width', width);
    treeContainer.style.width = width;

    const verticalGap = nodeRadius*4;
    treeSvg.setAttribute('height', 2*nodeRadius + 10 + height*verticalGap);

    if(inputHeap.length === 0)
        return;

    const tempHeap = [...inputHeap];

    function comparator(i, j) {
        if (i === null)
            return false;
        if(isinputMin)
            return tempHeap[i] > tempHeap[j];
        return tempHeap[i] < tempHeap[j];
    }
    
    function swap(i, j) {
        const temp = tempHeap[i];
        tempHeap[i] = tempHeap[j];
        tempHeap[j] = temp;
    }
    
    function left(index){
        return 2*index + 1 < tempHeap.length ? 2*index + 1 : null;
    }
    
    function right(index){
        return 2*index + 2 < tempHeap.length ? 2*index + 2 : null;
    }
    
    function parent(index){
        return Math.floor((index - 1)/2);
    }

    async function heapify (index) {
        while(index < tempHeap.length){
            let top = index;
            let l = left(top);
            let r = right(top);
            if(l < tempHeap.length && comparator(top, l))
                top = l;
            if(r < tempHeap.length && comparator(top, r))
                top = r;

            if(top === index)
                break;

            const topNode = treeSvg.querySelector(`.N${top}.node`);
            const topText = treeSvg.querySelector(`.N${top}.val`);
            const indexNode = treeSvg.querySelector(`.N${index}.node`);
            const indexText = treeSvg.querySelector(`.N${index}.val`);

            indexNode.classList.add('found');
            
            await new Promise(resolve => setTimeout(resolve, animationDuration));
            while (pause) await new Promise(resolve => setTimeout(resolve, 100));
            if(!buildAnimation)
                return;

            let tempX = indexNode.getAttribute('cx');
            let tempY = indexNode.getAttribute('cy');
            indexNode.setAttribute('cx', topNode.getAttribute('cx'));
            indexNode.setAttribute('cy', topNode.getAttribute('cy'));

            await new Promise(resolve => setTimeout(resolve, animationDuration));
            while (pause) await new Promise(resolve => setTimeout(resolve, 100));
            if(!buildAnimation)
                return;

            topNode.setAttribute('cx', tempX);
            topNode.setAttribute('cy', tempY);

            tempX = indexText.getAttribute('x');
            tempY = indexText.getAttribute('y');
            indexText.setAttribute('x', topText.getAttribute('x'));
            indexText.setAttribute('y', topText.getAttribute('y'));
            topText.setAttribute('x', tempX);
            topText.setAttribute('y', tempY);

            topNode.setAttribute('class', `N${index} node`);
            indexNode.setAttribute('class', `N${top} node found`);
            topText.setAttribute('class', `N${index} val`);
            indexText.setAttribute('class', `N${top} val`);

            swap(top, index);
            index = top;
        }

        treeSvg.querySelector(`.N${index}.node`).classList.remove('found');
    }


    const preorder = (curr, x, y, horizontalGap) => {

        drawNode(x, y, tempHeap[curr], curr);

        if(left(curr)){
            drawEdge(x, y, x - horizontalGap, y + verticalGap, curr);
            preorder(left(curr), x - horizontalGap, y + verticalGap, horizontalGap/2);
        }
        
        if(right(curr)){
            drawEdge(x, y, x + horizontalGap, y + verticalGap, curr);
            preorder(right(curr), x + horizontalGap, y + verticalGap, horizontalGap/2);
        }
    }

    preorder(0, width/2, nodeRadius + 5, width/4);

    await new Promise(resolve => setTimeout(resolve, animationDuration*2));
    while (pause) await new Promise(resolve => setTimeout(resolve, 100));
    if(!buildAnimation)
        return;

    for (let i = 0; i <= parent(tempHeap.length - 1) ; i++) 
        treeSvg.querySelectorAll(`.N${i}`).forEach((element) => element.classList.add('hide'));

    for (let i = parent(tempHeap.length - 1); i >= 0 ; i--){
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

        treeSvg.querySelectorAll(`.N${i}`).forEach((element) => element.classList.remove('hide'));
        await heapify(i);
    }

    await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

    displayHeap();
}