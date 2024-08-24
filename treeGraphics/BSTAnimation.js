//animation of BST

/*
index.js
    variables -> root, maxHeight, nodeMap(to delete)
    To render -> treeSvg, nodeRadius, svgNs
    animation control -> buildAnimation, pause, animationDuration
main.js
    drawNode, drawEdge
constructTree.js
    createNode(to insert)
*/

async function animateSearch(val) {

    if(dataType === "number")
        val = Number(val);

    let curr = root;

    while (curr !== null) {
        const node = treeSvg.querySelector(`.N${curr.id}.node`);

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

        if(val === curr.value)
            node.classList.add('found');
        else
            node.classList.add('focused-node');

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

        if(val === curr.value){
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

    if(dataType === "number")
        val = Number(val);

    if(root === null){
        root = createNode(val);
        maxHeight = 0;
        return true;
    }

    let curr = root;
    let maxHeightChanged = false;

    while (curr !== null) {
        const node = treeSvg.querySelector(`.N${curr.id}.node`);

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return false;

        if(val === curr.value)
            node.classList.add('found');
        else
            node.classList.add('focused-node');

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return false;

        if(val === curr.value){
            node.classList.remove('found');
            return maxHeightChanged;
        }
        else
            node.classList.remove('focused-node');

        if(val < curr.value){
            if(curr.left === null){
                curr.left = createNode(val);
                const x = Number(node.getAttribute('cx'));
                const y = Number(node.getAttribute('cy'));
                const height = Math.floor((y - 5 - nodeRadius)/(nodeRadius*4));
                const horizontalGap = (Number(treeSvg.getAttribute('width'))/(4*(1<<height)));
                if (maxHeight === height) {
                    maxHeight++;
                    maxHeightChanged = true;
                }
                drawEdge(x, y, x - horizontalGap, y + nodeRadius*4, curr.left.id);
                drawNode(x - horizontalGap, y + nodeRadius*4, val, curr.left.id);
            }
            curr = curr.left;
        }
        else{
            if(curr.right === null){
                curr.right = createNode(val);
                const x = Number(node.getAttribute('cx'));
                const y = Number(node.getAttribute('cy'));
                const height = Math.floor((y - 5 - nodeRadius)/(nodeRadius*4));
                const horizontalGap = (Number(treeSvg.getAttribute('width'))/(4*(1<<height)));
                if (maxHeight === height) {
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


async function animateDelete(val, replacement) {

    if(dataType === "number")
        val = Number(val);

    const deleteNode = async function (curr) {
        if(curr === null)
            return null;

        const node = treeSvg.querySelector(`.N${curr.id}.node`);

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return curr;

        if(val === curr.value)
            node.classList.add('found');
        else
            node.classList.add('focused-node');

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return curr;

        if(val !== curr.value)
            node.classList.remove('focused-node');

        if(val < curr.value)
            curr.left = await deleteNode(curr.left);
        else if(val > curr.value)
            curr.right = await deleteNode(curr.right);
        else{
            if(curr.left === null){
                const edge = treeSvg.querySelector(`.N${curr.id}.edge`);//null if not exists
                const rightEdge = treeSvg.querySelector(`.N${curr.right?.id}.edge`);//null if not exists

                if(edge && rightEdge){
                    const tempEdge = document.createElementNS(svgNs, 'path');
                    const start = {x: null, y: null}, mid = {x: null, y: null}, end = {x: null, y: null};

                    if(edge.tagName === 'path'){
                        const coordinates = edge.getAttribute('d').split(' ');
                        start.x = coordinates[1];
                        start.y = coordinates[2];

                        mid.x = coordinates[6];
                        mid.y = coordinates[7];
                    } else{
                        start.x = edge.getAttribute('x1');
                        start.y = edge.getAttribute('y1');

                        mid.x = edge.getAttribute('x2');
                        mid.y = edge.getAttribute('y2');
                    }

                    if(rightEdge.tagName === 'path'){
                        const coordinates = edge.getAttribute('d').split(' ');
                        end.x = coordinates[6];
                        end.y = coordinates[7];
                    } else{
                        end.x = rightEdge.getAttribute('x2');
                        end.y = rightEdge.getAttribute('y2');
                    }

                    tempEdge.setAttribute('d', `M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`);
                    tempEdge.setAttribute('class', `N${curr.right.id} edge`);
                    tempEdge.setAttribute('fill', 'transparent');
                    treeSvg.insertAdjacentElement('afterbegin', tempEdge);
                }

                if(edge) edge.remove();
                if(rightEdge) rightEdge.remove();

                nodeMap.delete(curr.id);
                node.remove();
                treeSvg.querySelector(`.N${curr.id}.val`).remove();

                return curr.right;
            }
            else if(curr.right === null){
                const edge = treeSvg.querySelector(`.N${curr.id}.edge`);//null if not exists
                const leftEdge = treeSvg.querySelector(`.N${curr.left.id}.edge`);

                if(edge){
                    const tempEdge = document.createElementNS(svgNs, 'path');
                    const start = {x: null, y: null}, mid = {x: null, y: null}, end = {x: null, y: null};

                    if(edge.tagName === 'path'){
                        const coordinates = edge.getAttribute('d').split(' ');
                        start.x = coordinates[1];
                        start.y = coordinates[2];

                        mid.x = coordinates[6];
                        mid.y = coordinates[7];
                    } else{
                        start.x = edge.getAttribute('x1');
                        start.y = edge.getAttribute('y1');

                        mid.x = edge.getAttribute('x2');
                        mid.y = edge.getAttribute('y2');
                    }

                    if(leftEdge.tagName === 'path'){
                        const coordinates = edge.getAttribute('d').split(' ');
                        end.x = coordinates[6];
                        end.y = coordinates[7];
                    } else{
                        end.x = leftEdge.getAttribute('x2');
                        end.y = leftEdge.getAttribute('y2');
                    }

                    tempEdge.setAttribute('d', `M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`);
                    tempEdge.setAttribute('class', `N${curr.left.id} edge`);
                    tempEdge.setAttribute('fill', 'transparent');
                    treeSvg.insertAdjacentElement('afterbegin', tempEdge);
                    edge.remove();
                }

                leftEdge.remove();
                nodeMap.delete(curr.id);
                node.remove();
                treeSvg.querySelector(`.N${curr.id}.val`).remove();

                return curr.left;
            }
            else{
                if(replacement === "predecessor"){
                //getting inorder predecessor of curr
                    replacement = curr.left;
                    while(replacement.right !== null)
                        replacement = replacement.right;
                    val = replacement.value;
                    curr.left = await deleteNode(curr.left);
                } else{
                    replacement = curr.right;
                    while(replacement.left !== null)
                        replacement = replacement.left;
                    val = replacement.value;
                    curr.right = await deleteNode(curr.right);
                }

                //means got deleted without interrupt
                if(nodeMap.get(replacement.id) === undefined){
                    curr.value = replacement.value;
                    treeSvg.querySelector(`.N${curr.id}.val`).textContent = curr.value;
                    node.classList.remove('found');
                }
            }
        }

        return curr;
    }

    const height = function (curr) {
        if(curr === null)
            return -1;
        return Math.max(height(curr.left), height(curr.right)) + 1;
    }

    root = await deleteNode(root);

    const currHeight = height(root);
    if(maxHeight > currHeight){
        maxHeight = currHeight;
        return true;
    }
    return false;
}

