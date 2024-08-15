const inputContainer = document.getElementById('input-container');
const mainInput = document.getElementById('main-input');
const inorderInput = document.getElementById('inorder-input');
const treeOptions = document.getElementById('tree-options');
const treeSvg = document.getElementById('tree-svg');
const customizeBtn = document.getElementById('customizeBtn');
const customizeTreeContainer = document.getElementById('customize-tree-container');
const separatorInput = document.getElementById('separator-input');
const nullInput = document.getElementById('null-input');
const nodeRadiusInput = document.getElementById('node-radius-input');
const nodeColorInput = document.getElementById('node-color-input');
const valueColorInput = document.getElementById('value-color-input');
const animationDurationInput = document.getElementById('animation-duration');

const svgNs = "http://www.w3.org/2000/svg";

const nodeMap = new Map();
var input = [];
var mapId = 0;
var root = null;
var maxHeight = -1;

var buildAnimation = false;
var nullRep = 'X';
var seperator = ' ';
var nodeRadius = Number(nodeRadiusInput.value);
var nodeColor = nodeColorInput.value;
var valueColor = valueColorInput.value;
var animationDuration = Number(animationDurationInput.value);

window.addEventListener("resize", () => {
    if(root != null){
        buildAnimation = false;
        displayTree();
    }
});

function showOptions(treeType) {
    let options = [];

    if (treeType === 'bt') {
        options = [
            'LeetCode',
            'GeeksforGeeks',
            'Preorder with Null',
            'Inorder with Null',
            'Postorder with Null',
            'Preorder + Inorder',
            'Postorder + Inorder'
        ];
    } else if (treeType === 'bst') {
        options = [
            'LeetCode',
            'GeeksforGeeks',
            'Preorder with Null',
            'Inorder with Null',
            'Postorder with Null',
            'Preorder Only',
            'Postorder Only',
            'Input Sequence'
        ];
    } else if (treeType === 'heap') {
        options = [
            'Max Heap',
            'Min Heap'
        ];
    }

    treeOptions.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.toLowerCase().replace(' ', '-').replace('with ', '').replace('+ ', '');
        opt.textContent = option;
        treeOptions.appendChild(opt);
    });

    inorderInput.style.display = 'none';
    inputContainer.style.display = 'block';
}

function checkForInorder() {
    const selectedOption = treeOptions.value;

    if (selectedOption === 'preorder-inorder' || selectedOption === 'postorder-inorder') {
        inorderInput.style.display = 'block';
    } else {
        inorderInput.style.display = 'none';
    }
}

function toggleCustomize(){
    if(customizeTreeContainer.style.display === 'none'){
        customizeBtn.innerText = "Hide Customization";
        customizeTreeContainer.style.display = 'block';
    }
    else{
        customizeBtn.innerText = "Show Customization";
        customizeTreeContainer.style.display = 'none';
    }
}

nodeColorInput.addEventListener("change", (e) => {
    nodeColor = e.target.value;

    document.querySelectorAll('.node').forEach((node) => {
        node.setAttribute('fill', nodeColor);
    })
})

valueColorInput.addEventListener("change", (e) => {
    valueColor = e.target.value;

    document.querySelectorAll('.val').forEach((val) => {
        val.setAttribute('fill', valueColor);
    })
})

nodeRadiusInput.addEventListener("change", (e) => {
    buildAnimation = false;
    nodeRadius = Number(e.target.value);
    displayTree();
})

animationDurationInput.addEventListener("change", (e) => {
    animationDuration = Number(e.target.value);
})

function generateTree(){
    treeSvg.innerHTML = ''; // Clear svg
    nodeMap.clear(); // clearing map and tree
    mapId = 0;
    maxHeight = -1;

    seperator = separatorInput.value;
    nullRep = nullInput.value;
    input = (mainInput.value.trim().length == 0 ? [] : mainInput.value.trim().split(seperator));
    root = preorderNullTree();

    displayPostorder();
}

function createNode(value, id) {
    return { value, id, left: null, right: null };
}

function drawNode(x, y, value, id) {
    const circle = document.createElementNS(svgNs, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('fill', nodeColor);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('class', `N${id} node`);
    treeSvg.appendChild(circle);

    const text = document.createElementNS(svgNs, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + (nodeRadius*0.25));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', Math.floor(nodeRadius*0.7) + 'px');
    text.setAttribute('class', `N${id} val`);
    text.setAttribute('fill', valueColor)
    text.textContent = value;
    treeSvg.appendChild(text);
}

function drawEdge(fromX, fromY, toX, toY, id) {
    const line = document.createElementNS(svgNs, 'line');
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', toX);
    line.setAttribute('y2', toY);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', 2);
    line.setAttribute('class', `N${id} edge`);
    treeSvg.insertAdjacentElement('afterbegin', line);
}

function displayTree() {
    
    if(root == null)
        return;

    treeSvg.innerHTML = "";

    const verticalGap = nodeRadius*4;
    let width = window.innerWidth;

    treeSvg.setAttribute('height', 2*nodeRadius + 10 + maxHeight*verticalGap);
    
    if(width < (1<<maxHeight)*nodeRadius*4)
        width = (1<<maxHeight)*nodeRadius*4;

    treeSvg.setAttribute('width', width);

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

async function displayPreorder() {
    if(root == null)
        return;

    buildAnimation = true;

    treeSvg.innerHTML = "";
    const verticalGap = nodeRadius*4;
    let width = window.innerWidth;
    treeSvg.setAttribute('height', 2*nodeRadius + 10 + maxHeight*verticalGap);
    if(width < (1<<maxHeight)*nodeRadius*4)
        width = (1<<maxHeight)*nodeRadius*4;
    treeSvg.setAttribute('width', width);

    const preorder = async (curr, x, y, horizontalGap) => {
        await new Promise(resolve => setTimeout(resolve, animationDuration));

        if(!buildAnimation)
            return;
        
        drawNode(x, y, curr.value, curr.id);
        // Delay for animation
        await new Promise(resolve => setTimeout(resolve, animationDuration));

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

    buildAnimation = false;
}

async function displayInorder() {
    if(root == null)
        return;
    buildAnimation = true;
    
    treeSvg.innerHTML = "";
    const verticalGap = nodeRadius*4;
    let width = window.innerWidth;
    treeSvg.setAttribute('height', 2*nodeRadius + 10 + maxHeight*verticalGap);
    if(width < (1<<maxHeight)*nodeRadius*4)
        width = (1<<maxHeight)*nodeRadius*4;
    treeSvg.setAttribute('width', width);

    const inorder = async (curr, x, y, horizontalGap) => {

        await new Promise(resolve => setTimeout(resolve, animationDuration));

        // Delay for animation
        if (curr.left != null && buildAnimation) {
            drawEdge(x, y, x - horizontalGap, y + verticalGap, curr.left.id);
            await inorder(curr.left, x - horizontalGap, y + verticalGap, horizontalGap / 2);
        }

        if(!buildAnimation)
            return;

        drawNode(x, y, curr.value, curr.id);
        await new Promise(resolve => setTimeout(resolve, animationDuration));

        if (curr.right != null && buildAnimation) {
            drawEdge(x, y, x + horizontalGap, y + verticalGap, curr.right.id);
            await inorder(curr.right, x + horizontalGap, y + verticalGap, horizontalGap / 2);
        }

    };

    await inorder(root, width / 2, nodeRadius + 5, width / 4);
    buildAnimation = false;
}

async function displayPostorder() {
    if(root == null)
        return;
    buildAnimation = true;
    
    treeSvg.innerHTML = "";
    const verticalGap = nodeRadius*4;
    let width = window.innerWidth;
    treeSvg.setAttribute('height', 2*nodeRadius + 10 + maxHeight*verticalGap);
    if(width < (1<<maxHeight)*nodeRadius*4)
        width = (1<<maxHeight)*nodeRadius*4;
    treeSvg.setAttribute('width', width);

    const postorder = async (curr, x, y, horizontalGap) => {

        await new Promise(resolve => setTimeout(resolve, animationDuration));

        // Delay for animation
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

    };

    await postorder(root, width / 2, nodeRadius + 5, width / 4);
    buildAnimation = false;
}

function preorderNullTree() {
    let index = 0;

    if (input.length == 0 || input[index] === nullRep)
        return null;

    const preorderNull = (height) => {

        let temp = createNode(input[index++], mapId);
        nodeMap.set(mapId++ , temp);

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

    return preorderNull(0);
}

function postorderNullTree() {
    let index = 0;

    if (input.length == 0 || input[index] === nullRep)
        return null;

    const preorderNull = () => {

        let temp = createNode(input[index++], mapId);
        nodeMap.set(mapId++ , temp);

        if(index >= input.length || input[index] === nullRep)
            index++;
        else
            temp.left = preorderNull();
        
        if(index >= input.length || input[index] === nullRep)
            index++;
        else
            temp.right = preorderNull();

        return temp;
    }

    return preorderNull();
}