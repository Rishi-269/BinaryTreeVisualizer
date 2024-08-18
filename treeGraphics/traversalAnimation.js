async function animatePreorder() {
    if(root == null)
        return;

    treeSvg.innerHTML = "";
    const {width, verticalGap} = setDimensionSVG();

    const preorder = async (curr, x, y, horizontalGap) => {
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));

        if(!buildAnimation)
            return;
        
        drawNode(x, y, curr.value, curr.id);
        // Delay for animation
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));

        if (curr.left != null && buildAnimation) {
            drawEdge(x, y, x - horizontalGap, y + verticalGap, curr.left.id);
            await preorder(curr.left, x - horizontalGap, y + verticalGap, horizontalGap / 2);
        }

        if (curr.right != null && buildAnimation) {
            drawEdge(x, y, x + horizontalGap, y + verticalGap, curr.right.id);
            await preorder(curr.right, x + horizontalGap, y + verticalGap, horizontalGap / 2);
        }
    };

    await preorder(root, width / 2, nodeRadius + 5, width / 4);

}

async function animateInorder() {
    if(root == null)
        return;
    
    treeSvg.innerHTML = "";
    const {width, verticalGap} = setDimensionSVG();

    const inorder = async (curr, x, y, horizontalGap) => {

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));

        if (curr.left != null && buildAnimation) {
            drawEdge(x, y, x - horizontalGap, y + verticalGap, curr.left.id);
            await inorder(curr.left, x - horizontalGap, y + verticalGap, horizontalGap / 2);
        }

        if(!buildAnimation)
            return;

        drawNode(x, y, curr.value, curr.id);
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));

        if (curr.right != null && buildAnimation) {
            drawEdge(x, y, x + horizontalGap, y + verticalGap, curr.right.id);
            await inorder(curr.right, x + horizontalGap, y + verticalGap, horizontalGap / 2);
        }

    };

    await inorder(root, width / 2, nodeRadius + 5, width / 4);
}

async function animatePostorder() {
    if(root == null)
        return;
    
    treeSvg.innerHTML = "";
    const {width, verticalGap} = setDimensionSVG();

    const postorder = async (curr, x, y, horizontalGap) => {

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));

        if (curr.left != null && buildAnimation) {
            drawEdge(x, y, x - horizontalGap, y + verticalGap, curr.left.id);
            await postorder(curr.left, x - horizontalGap, y + verticalGap, horizontalGap / 2);
        }

        if (curr.right != null && buildAnimation) {
            drawEdge(x, y, x + horizontalGap, y + verticalGap, curr.right.id);
            await postorder(curr.right, x + horizontalGap, y + verticalGap, horizontalGap / 2);
        }

        if(!buildAnimation)
            return;

        drawNode(x, y, curr.value, curr.id);
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));

    };

    await postorder(root, width / 2, nodeRadius + 5, width / 4);
}

async function animateLevelorder() {
    if(root == null)
        return;

    treeSvg.innerHTML = "";
    const {width, verticalGap} = setDimensionSVG();
    
    const queue = new Queue();
    drawNode(width/2, nodeRadius + 5, root.value, root.id);
    if(root.left != null)
        queue.enqueue({node: root.left, x: width/4, y: nodeRadius + 5 + verticalGap, horizontalGap: width/8});
    if(root.right != null)
        queue.enqueue({node: root.right, x: 3*width/4, y: nodeRadius + 5 + verticalGap, horizontalGap: -width/8});

    while (!queue.isEmpty()) {
        const {node, x, y, horizontalGap} = queue.dequeue();
        
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

        drawEdge(x + horizontalGap*2, y - verticalGap, x, y, node.id);

        await new Promise(resolve => setTimeout(resolve, animationDuration));
        while (pause) await new Promise(resolve => setTimeout(resolve, 100));
        if(!buildAnimation)
            return;

        drawNode(x, y, node.value, node.id);

        if(node.left != null)
            queue.enqueue({node: node.left, x: x - Math.abs(horizontalGap), y: y + verticalGap, horizontalGap: Math.abs(horizontalGap)/2});

        if(node.right != null)
            queue.enqueue({node: node.right, x: x + Math.abs(horizontalGap), y: y + verticalGap, horizontalGap: -Math.abs(horizontalGap)/2});
    }

}