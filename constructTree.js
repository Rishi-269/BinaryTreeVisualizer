//creates tree and heap in memory form input string 

/*
index.js
    variables used root, mapId, maxHeight, nodeMap, heap[], isMinHeap

queue.js
    Queue
*/

function createNode(value) {
    const temp = { value, id: mapId, left: null, right: null };
    nodeMap.set(mapId++, temp);
    return temp;
}

function levelorderNullTree(input, nullRep) {
    if (input.length === 0 || input[0] === nullRep)
        return;

    let index = 0;
    const queue = new Queue();
    root = createNode(input[index++]);
    queue.enqueue({node: root, height: 0});
    maxHeight = 0;

    while (!queue.isEmpty() && index < input.length) {
        const {node, height} = queue.dequeue();

        if (input[index] !== nullRep) {
            node.left = createNode(input[index]);
            queue.enqueue({node: node.left, height: height + 1});
            maxHeight = Math.max(maxHeight, height + 1);
        }
        index++;

        if (index < input.length && input[index] !== nullRep) {
            node.right = createNode(input[index]);
            queue.enqueue({node: node.right, height: height + 1});
            maxHeight = Math.max(maxHeight, height + 1);
        }
        index++;
    }

}

function preorderNullTree(input, nullRep) {
    if (input.length == 0 || input[0] === nullRep)
        return;

    let index = 0;

    const preorderNull = (height) => {

        let temp = createNode(input[index++]);

        maxHeight = Math.max(maxHeight, height);

        if(index >= input.length || input[index] === nullRep)
            index++;
        else
            temp.left = preorderNull(height + 1);
        
        if(index >= input.length || input[index] === nullRep)
            index++;
        else
            temp.right = preorderNull(height + 1);

        return temp;
    }

    root = preorderNull(0);
}

//BST

function inputSeqTree(input){
    if(input.length == 0)
        return;
    
    root = createNode(input[0]);
    maxHeight = 0;

    for (let i = 1; i < input.length; i++) {
        let temp = root;
        let height = 0;
        while (temp != null) {
            //will not insert duplicates
            if(input[i] === temp.value)
                break;
            if(input[i] < temp.value){
                if(temp.left == null)
                    temp.left = createNode(input[i]);
                temp = temp.left;
            }
            else{
                if(temp.right == null)
                    temp.right = createNode(input[i]);
                temp = temp.right;
            }
            height++;
        }

        maxHeight = Math.max(maxHeight, height);
    }
}

function levelorderNullBST(input, nullRep) {
    //will return false if input not bst

    if (input.length === 0 || input[0] === nullRep)
        return true;

    let index = 0;
    const queue = new Queue();
    root = createNode(input[index++]);
    queue.enqueue({
        node: root,
        height: 0,
        max: dataType == "number" ? Infinity : '\uffff',
        min: dataType == "number" ? -Infinity : '',
    });
    maxHeight = 0;

    while (!queue.isEmpty() && index < input.length) {
        const {node, height, min, max} = queue.dequeue();

        if (input[index] !== nullRep) {
            if(input[index] >= node.value || input[index] <= min)
                return false;

            node.left = createNode(input[index]);
            queue.enqueue({node: node.left, height: height + 1, max : node.value , min});
            maxHeight = Math.max(maxHeight, height + 1);
        }
        index++;

        if (index < input.length && input[index] !== nullRep) {
            if(input[index] >= max || input[index] <= node.value)
                return false;

            node.right = createNode(input[index]);
            queue.enqueue({node: node.right, height: height + 1, max, min : node.value});
            maxHeight = Math.max(maxHeight, height + 1);
        }
        index++;
    }

    return true;
}

//heap

function comparatorHeap(i, j) {
    if (i === null)
        return false;
    if(isMinHeap)
        return heap[i] > heap[j];
    return heap[i] < heap[j];
}

function swapHeap(i, j) {
    const temp = heap[i];
    heap[i] = heap[j];
    heap[j] = temp;
}

function leftHeap(index){
    return 2*index + 1 < heap.length ? 2*index + 1 : null;
}

function rightHeap(index){
    return 2*index + 2 < heap.length ? 2*index + 2 : null;
}

function parentHeap(index){
    return Math.floor((index - 1)/2) >= 0 ? Math.floor((index - 1)/2) : null;
}

function buildHeap(input) {
    if (input.length === 0)
        return;

    heap.push(...input);

    const heapify = function(index) {
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
    }

    for (let i = parentHeap(heap.length - 1); i >= 0; i--) 
        heapify(i);

}