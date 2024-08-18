async function animateSearch(val) {

    let curr = root;

    while (curr != null) {
        const node = treeSvg.querySelector(`.N${curr.id}.node`);

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

        if(val == curr.value)
            node.classList.add('found');
        else
            node.classList.add('focused-node');

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

        if(val == curr.value){
            node.classList.remove('found');
            return;
        }
        else
            node.classList.remove('focused-node');

        if(val < curr.value){
            curr = curr.left;
        }
        else{
            curr = curr.right;
        }
    }
}

async function animateInsert(val) {
    let curr = root;
    let maxHeightChanged = false;

    while (curr != null) {
        const node = treeSvg.querySelector(`.N${curr.id}.node`);

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return maxHeightChanged;

        if(val == curr.value)
            node.classList.add('found');
        else
            node.classList.add('focused-node');

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return maxHeightChanged;

        if(val == curr.value){
            node.classList.remove('found');
            return maxHeightChanged;
        }
        else
            node.classList.remove('focused-node');

        if(val < curr.value){
            if(curr.left == null){
                curr.left = createNode(val);
                const x = Number(node.getAttribute('cx'));
                const y = Number(node.getAttribute('cy'));
                const height = Math.floor((y - 5 - nodeRadius)/(nodeRadius*4));
                const horizontalGap = (Number(treeSvg.getAttribute('width'))/(4*(1<<height)));
                if (maxHeight == height) {
                    maxHeight++;
                    maxHeightChanged = true;
                }
                drawEdge(x, y, x - horizontalGap, y + nodeRadius*4, curr.left.id);
                drawNode(x - horizontalGap, y + nodeRadius*4, val, curr.left.id);
            }
            curr = curr.left;
        }
        else{
            if(curr.right == null){
                curr.right = createNode(val);
                const x = Number(node.getAttribute('cx'));
                const y = Number(node.getAttribute('cy'));
                const height = Math.floor((y - 5 - nodeRadius)/(nodeRadius*4));
                const horizontalGap = (Number(treeSvg.getAttribute('width'))/(4*(1<<height)));
                if (maxHeight == height) {
                    maxHeight++;
                    maxHeightChanged = true;
                }
                drawEdge(x, y, x + horizontalGap, y + nodeRadius*4, curr.right.id);
                drawNode(x + horizontalGap, y + nodeRadius*4, val, curr.right.id);
            }
            curr = curr.right;
        }
    }
}