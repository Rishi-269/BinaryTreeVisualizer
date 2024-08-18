const mainInput = document.getElementById('main-input');
const separatorInput = document.getElementById('separator-input');
const dataTypeContainer = document.getElementById('data-type-container');
const dataTypeInput = document.getElementById('data-type');
const nullInput = document.getElementById('null-input');
const nullInputContainer = document.getElementById('null-input-container');
const animateInput = document.getElementById('animate-input');
const treeOptions = document.getElementById('tree-options');
const treeOperation = document.getElementById('tree-operation');
const treeOperationStop = document.getElementById('stop-operation-btn');
const treeContainer = document.getElementById('tree-container');
const treeSvg = document.getElementById('tree-svg');
const customizeTreeContainer = document.getElementById('customize-tree-container');

//tree input
var treeType = 'bt';
var nullRep = 'null';
var seperator = ',';
var dataType = "number";

//tree in memory
const nodeMap = new Map();
var input = [];
var mapId = 0;
var root = null;
var maxHeight = -1;

//tree graphics
const svgNs = "http://www.w3.org/2000/svg";
var nodeRadius = 30;
var animationDuration = 300;

//animation control
var buildAnimation = false;
var pause = false;

window.addEventListener("resize", () => {
    if(root != null){
        displayTree();
    }
});

function showOptions(type) {
    treeType = type;

    if (type === 'bt') {
        treeOptions.innerHTML = `
            <option value="leetcode">LeetCode / Levelorder with Null</option>
            <option value="geeksforgeeks">GeeksforGeeks / Levelorder with Null</option>
            <option value="preorder-null">Preorder with Null</option>
        `;
        treeOperation.innerHTML = `
            <optgroup label="Depth First Search">
                <option value="preorder">Preorder Traversal</option>
                <option value="inorder">Inorder Traversal</option>
                <option value="postorder">Postorder Traversal</option>
            </optgroup>
            <optgroup label="Breadth First Search">
                <option value="levelorder">Level Order Traversal</option>
            </optgroup>
        `;
        animateInput.style.display = "none";
        dataTypeContainer.style.display = "none";
        nullInputContainer.style.display = "block";
        nullInput.value = 'null';

    } else if (type === 'bst') {
        treeOptions.innerHTML = `
            <option value="leetcode">LeetCode / Levelorder with Null</option>
            <option value="geeksforgeeks">GeeksforGeeks / Levelorder with Null</option>
            <option value="input-sequence">Input Sequence</option>
            <option value="preorder">Preorder</option>
            <option value="postorder">Postorder</option>
        `;
        treeOperation.innerHTML = `
            <optgroup label="Binary Search Tree Operations">
                <option value="search">Search</option>
                <option value="insert">Insert</option>
                <option value="delete">Delete</option>
            </optgroup>
            <optgroup label="Depth First Search">
                <option value="preorder">Preorder Traversal</option>
                <option value="inorder">Inorder Traversal</option>
                <option value="postorder">Postorder Traversal</option>
            </optgroup>
            <optgroup label="Breadth First Search">
                <option value="levelorder">Level Order Traversal</option>
            </optgroup>
        `;
        animateInput.style.display = "block";
        dataTypeContainer.style.display = "block";
        nullInputContainer.style.display = "block";
        nullInput.value = 'null';

    } else if (type === 'heap') {
        treeOptions.innerHTML = `
            <option value="max-heap">Max Heap</option>
            <option value="min-heap">Min Heap</option>
        `;
        treeOperation.innerHTML = `
            <option value="build-heap">Build Heap(uses the input array)</option>
            <option value="insert-heap">Insert</option>
            <option value="extract-heap">Extract Top</option>
        `;
        animateInput.style.display = "none";
        dataTypeContainer.style.display = "block";
        nullInputContainer.style.display = "none";
    }

    separatorInput.value = ',';

    root = null;
    mapId = 0;
    nodeMap.clear();
    maxHeight = -1;
    input.length = 0;
    displayTree();
}

treeOptions.addEventListener("change", (e) => {
    if(e.target.value === "leetcode"){
        separatorInput.value = ',';
        nullInputContainer.style.display = "block";
        nullInput.value = 'null';
    } else if(e.target.value === "geeksforgeeks"){
        separatorInput.value = ' ';
        nullInputContainer.style.display = "block";
        nullInput.value = 'N';
    } else if(e.target.value === "preorder-null"){
        nullInputContainer.style.display = "block";
    } else{
        nullInputContainer.style.display = "none";
    }
})

treeOperation.addEventListener("change", (e) => {
    if(e.target.value === "search" || e.target.value === "insert" || e.target.value === "delete" || e.target.value === "insert-heap")
        animateInput.style.display = "block";
    else
        animateInput.style.display = "none";
})

document.getElementById('operation-btn').addEventListener('click', async (e) => {
    if (e.target.innerText === "Start") {
        pause = false;
        buildAnimation = true;

        e.target.innerText = "Pause";
        treeOperationStop.style.display = 'block';

        switch (treeOperation.value) {
            case "preorder":
                await animatePreorder();
                break;
            case "inorder":
                await animateInorder();
                break;
            case "postorder":
                await animatePostorder();
                break;
            case "levelorder":
                await animateLevelorder();
                break;
            case "search":
                await animateSearch(animateInput.value);
                break;
            case "insert":
                if(await animateInsert(animateInput.value))
                    displayTree();
                break;
            default:
                break;
        }

        pause = false;
        buildAnimation = false;

        e.target.innerText = "Start";
        treeOperationStop.style.display = 'none';

    } else if(e.target.innerText === "Pause"){
        pause = true;
        e.target.innerText = "Resume";
    } else {
        pause = false;
        e.target.innerText = "Pause";
    }
})

treeOperationStop.addEventListener('click', () => displayTree());

document.getElementById('customize-btn').addEventListener("click",(e) => {
    if(e.target.innerText === "Show Customization"){
        e.target.innerText = "Hide Customization";
        customizeTreeContainer.style.display = 'block';
    }
    else{
        e.target.innerText = "Show Customization";
        customizeTreeContainer.style.display = 'none';
    }
})


document.getElementById('node-radius-input').addEventListener("change", (e) => {
    nodeRadius = Number(e.target.value);
    displayTree();
})

document.getElementById('animation-duration').addEventListener("change", (e) => {
    animationDuration = Number(e.target.value);
})

function generateTree(){
    nodeMap.clear(); // clearing map and tree
    mapId = 0;
    maxHeight = -1;
    root = null;

    seperator = separatorInput.value;
    nullRep = nullInput.value;
    dataType = dataTypeInput.value;
    input = (mainInput.value.trim().length == 0 ? [] : mainInput.value.trim().split(seperator));

    switch (treeOptions.value) {
        case "geeksforgeeks":
            if(treeType === 'bst' && isInputNumber()){

            }
            levelorderNullTree();
            break;
        case "leetcode":
            if(treeType === 'bst')
                console.log('check bst');
            levelorderNullTree();
            break;
        case "preorder-null":
            preorderNullTree();
            break;
        case "input-sequence":
            if(dataType == "number" && !validateNumber())
                inputError();
            else
                inputSeqTree();
            break;
        case "preorder":
            if(dataType == "number" && !validateNumber())
                inputError();
            else
                preorderTree();
            break;
        case "postorder":
            if(dataType == "number" && !validateNumber())
                inputError();
            else
                postorderTree();
            break; 
        default:
            break;
    }

    displayTree();
}

function validateNumber() {
    for (let i = 0; i < input.length; i++) {
        if(isNaN(input[i])){
            input.length = 0;
            return false;
        }
        input[i] = Number(input[i]);
    }
    return true;
}