//queue implementation with singly linked list for bfs operations
class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
    }

    enqueue(value){
        const newNode = { value, next: null };

        if(this.rear === null)
            this.rear = this.front = newNode;
        else{
            this.rear.next = newNode;
            this.rear = this.rear.next;
        }
    }

    dequeue(){
        if(this.front === null)
            return null;
        
        const temp = this.front.value;
        this.front = this.front.next;

        if(this.front === null)
            this.rear = null;

        return temp;
    }

    isEmpty(){
        return this.front === null;
    }
}
