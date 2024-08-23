const mainInput = document.getElementById('main-input');
const separatorInput = document.getElementById('separator-input');
const dataTypeContainer = document.getElementById('data-type-container');
const dataTypeInput = document.getElementById('data-type');
const nullInput = document.getElementById('null-input');
const nullInputContainer = document.getElementById('null-input-container');
const animateInput = document.getElementById('animate-input');
const animateSelectInput = document.getElementById('animate-select-input');
const treeOptions = document.getElementById('tree-options');
const treeOperation = document.getElementById('tree-operation');
const treeOperationStop = document.getElementById('stop-operation-btn');
const treeContainer = document.getElementById('tree-container');
const treeSvg = document.getElementById('tree-svg');
const customizeTreeContainer = document.getElementById('customize-tree-container');

//tree input
var treeType = "bt";
var dataType = "number";

//tree and bst in memory
const nodeMap = new Map();
var mapId = 0;
var root = null;
var maxHeight = -1;

//heap in memory
const heap = [];
var isMinHeap = false;
const inputHeap = [];
var isinputMin = false;

//tree graphics
const svgNs = "http://www.w3.org/2000/svg";
var nodeRadius = 30;
var animationDuration = 300;

//animation control
var buildAnimation = false;
var pause = false;

window.addEventListener("resize", () => {
    if(treeType === "hp")
        displayHeap();
    else
        displayTree();
});

function showOptions(type) {

    if(treeType === 'hp'){
        heap.length = 0;
        inputHeap.length = 0;
        displayHeap();
    } else{
        root = null;
        mapId = 0;
        nodeMap.clear();
        maxHeight = -1;
        displayTree();
    }

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
        animateSelectInput.style.display = "none";
        dataTypeContainer.style.display = "none";
        nullInputContainer.style.display = "block";
        nullInput.value = 'null';

    } else if (type === 'bst') {
        treeOptions.innerHTML = `
            <option value="leetcode">LeetCode / Levelorder with Null</option>
            <option value="geeksforgeeks">GeeksforGeeks / Levelorder with Null</option>
            <option value="input-sequence">Input Sequence</option>
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
        animateSelectInput.style.display = "none";
        dataTypeContainer.style.display = "block";
        nullInputContainer.style.display = "block";
        nullInput.value = 'null';

    } else if (type === 'hp') {
        treeOptions.innerHTML = `
            <option value="max-heap">Max Heap</option>
            <option value="min-heap">Min Heap</option>
        `;
        treeOperation.innerHTML = `
            <option value="build-heap">Build Heap (uses input array from generate)</option>
            <option value="insert-heap">Insert</option>
            <option value="extract-heap">Extract Top</option>
        `;
        animateInput.style.display = "none";
        animateSelectInput.style.display = "none";
        dataTypeContainer.style.display = "block";
        nullInputContainer.style.display = "none";
    }

    separatorInput.value = ',';

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

    if(root === null && e.target.value === "insert"){
        animateSelectInput.innerHTML = `
            <optgroup label="Data Type">
                <option value="number">Number</option>
                <option value="string">Character/String</option>
            </optgroup>
        `;
        animateSelectInput.style.display = "block";
    } else if(heap.length === 0 && e.target.value === "insert-heap"){
        animateSelectInput.innerHTML = `
            <optgroup label="Data Type and Heap Type">
                <option value="number-max">Number and Max Heap</option>
                <option value="number-min">Number and Min Heap</option>
                <option value="string-max">Character/String and Max Heap</option>
                <option value="string-min">Character/String and Min Heap</option>
            </optgroup>
        `;
        animateSelectInput.style.display = "block";
    } else if(e.target.value === "delete"){
        animateSelectInput.innerHTML = `
            <optgroup label="Choose Replacement Node for Deletion if it has two children">
                <option value="predecessor">Inorder Predecessor</option>
                <option value="successor">Inorder Successor</option>
            </optgroup>
        `;
        animateSelectInput.style.display = "block";
    } else{
        animateSelectInput.style.display = "none";
    }
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
                if(dataType === "number" && isNaN(animateInput.value))
                    inputError(animateInput, "Not a number");
                else if(animateInput.value.length > 0)
                    await animateSearch(animateInput.value);
                break;
            case "insert":
                if (root === null)
                    dataType = animateSelectInput.value;
    
                if(dataType === "number" && isNaN(animateInput.value))
                    inputError(animateInput, "Not a number");
                else if(animateInput.value.length > 0){
                    if(await animateInsert(animateInput.value))
                        displayTree();
                    animateSelectInput.style.display = "none";
                }
                break;
            case "delete":
                if(dataType === "number" && isNaN(animateInput.value))
                    inputError(animateInput, "Not a number");
                else if(animateInput.value.length > 0)
                    if(await animateDelete(animateInput.value, animateSelectInput.value))
                        displayTree();
                break;
            case "insert-heap":
                if (heap.length === 0){
                    switch (animateSelectInput.value) {
                        case "number-max":
                            isMinHeap = false;
                            dataType = "number";
                            break;
                        case "number-min":
                            isMinHeap = true;
                            dataType = "number";
                            break;
                        case "string-max":
                            isMinHeap = false;
                            dataType = "string";
                            break;
                        case "string-min":
                            isMinHeap = true;
                            dataType = "string";
                            break;    
                        default:
                            break;
                    }
                }
    
                if(dataType === "number" && isNaN(animateInput.value))
                    inputError(animateInput, "Not a number");
                else if(animateInput.value.length > 0){
                    if(await animateInsertHeap(animateInput.value))
                        displayHeap();
                    animateSelectInput.style.display = "none";
                }
                break;

            case "extract-heap":
                if(await animateExtractHeap())
                    displayHeap();
                break;
            
            case "build-heap":
                await animateBuildHeap();
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

treeOperationStop.addEventListener('click', () => {
    if (treeType === 'hp')
        displayHeap();
    else
        displayTree();
});

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
    if (treeType === 'hp')
        displayHeap();
    else
        displayTree();
})

document.getElementById('animation-duration').addEventListener("change", (e) => {
    animationDuration = Number(e.target.value);
})

function generateTree(){
    if(treeType === 'hp'){
        heap.length = 0;
        inputHeap.length = 0;
    }
    else{
        nodeMap.clear(); // clearing map and tree
        mapId = 0;
        maxHeight = -1;
        root = null;
    }

    dataType = dataTypeInput.value;
    const nullRep = nullInput.value;

    const input = (mainInput.value.trim().length == 0 ? [] : mainInput.value.trim().split(separatorInput.value));

    switch (treeOptions.value) {
        case "geeksforgeeks":
            if(treeType === 'bst'){
                if(dataType == "number" && !validateNumber(input, nullRep))
                    inputError(mainInput, "Not Number");
                else if(!levelorderNullBST(input, nullRep)){
                    inputError(mainInput, "Not BST");
                    root = null;
                    nodeMap.clear();
                    mapId = 0;
                    maxHeight = -1;
                }
            }
            else
                levelorderNullTree(input, nullRep);
            break;
        case "leetcode":
            if(treeType === 'bst'){
                if(dataType == "number" && !validateNumber(input, nullRep))
                    inputError(mainInput, "Not Number");
                else if(!levelorderNullBST(input, nullRep)){
                    inputError(mainInput, "Not BST");
                    root = null;
                    nodeMap.clear();
                    mapId = 0;
                    maxHeight = -1;
                }
            }
            else
                levelorderNullTree(input, nullRep);
            break;
        case "preorder-null":
            preorderNullTree(input, nullRep);
            break;
        case "input-sequence":
            if(dataType == "number" && !validateNumber(input))
                inputError(mainInput, "Not Number");
            else
                inputSeqTree(input);
            break;
        case "max-heap":
            if(dataType == "number" && !validateNumber(input))
                inputError(mainInput, "Not Number");
            else{
                inputHeap.push(...input);
                isinputMin = isMinHeap = false;
                buildHeap(input);
            }
            break;
        case "min-heap":
            if(dataType == "number" && !validateNumber(input))
                inputError(mainInput, "Not Number");
            else{
                inputHeap.push(...input);
                isinputMin = isMinHeap = true;
                buildHeap(input);
            }
            break;
        default:
            break;
    }

    if(treeType === "hp")
        displayHeap();
    else
        displayTree();
}

//input validation and error
function validateNumber(input, nullRep) {
    for (let i = 0; i < input.length; i++) {
        if(nullRep !== undefined && input[i] === nullRep)
            continue;
        if(isNaN(input[i]))
            return false;
        input[i] = Number(input[i]);
    }
    return true;
}

function inputError(inputElement, message) {
    const orignalInput = inputElement.value;
    const originalPlaceholder = inputElement.placeholder;

    inputElement.value = '';
    inputElement.placeholder = message;

    inputElement.classList.add('input-error');

    setTimeout(() => {
        inputElement.value = orignalInput;
        inputElement.placeholder = originalPlaceholder;
        inputElement.classList.remove('input-error');
    }, 1000);
}

