// HashSet
// Create a class HashSet that behaves the same as a HashMap but only contains keys with no values.

class setLinkedList {
  constructor(key) {
    this.head = new setNode(key);
  }
  append(key) {
    let currentNode = this.head;
    while (currentNode.nextNode !== null) {
      currentNode = currentNode.nextNode;
    }
    currentNode.nextNode = new setNode(key);
  }
  contains(key) {
    let currentNode = this.head;
    let result = false;
    while (currentNode !== null) {
      if (currentNode.value === key) {
        result = true;
      }
      currentNode = currentNode.nextNode;
    }
    return result;
  }

  find(key) {
    let index = 0;
    let currentNode = this.head;
    while (currentNode !== null) {
      if (currentNode.value === key) {
        return index;
      }
      currentNode = currentNode.nextNode;
      index += 1;
    }
    return null;
  }

  removeAt(index) {
    let prevNode;
    let currentNode = this.head;
    if (index === 0) {
      this.head = this.head.nextNode;
      return;
    }
    for (let i = 0; i < index; i++) {
      prevNode = currentNode;
      currentNode = currentNode.nextNode;
    }
    let toKeep = currentNode.nextNode;
    prevNode.nextNode = toKeep;
  }

  insertAt(key, index) {
    let newNode = new setNode(key);
    let prevNode;
    let currentNode = this.head;
    if (index === 0) {
      newNode.nextNode = this.head;
      this.head = newNode;
      return;
    }
    for (let i = 0; i < index; i++) {
      prevNode = currentNode;
      currentNode = currentNode.nextNode;
    }
    let toKeep = prevNode.nextNode;
    console.log('tokeep');
    console.log(toKeep);
    prevNode.nextNode = newNode;
    newNode.nextNode = toKeep;
  }
}

class setNode {
  constructor(key = null, nextNode = null) {
    this.value = key;
    this.nextNode = nextNode;
  }
}

class HashSet {
  constructor() {
    this.buckets = [];
    this.bucketSize = 16;
  }

  checkBounds(index) {
    if (index < 0 || index >= this.bucketSize) {
      throw new Error('Trying to access index out of bound');
    }
  }

  calcBucketsFormula() {
    return this.bucketSize * 0.75;
  }

  getBucketsNodesAmount() {
    let bucketNum = 0;
    this.buckets.forEach((bucket) => {
      if (typeof bucket === 'object') {
        bucketNum += 1;
      }
    });
    return bucketNum;
  }

  hash(value) {
    let hashCode = 0;
    for (let i = 0; i < value.length; i++) {
      hashCode += value.charCodeAt(i);
    }
    return hashCode % this.bucketSize;
  }

  rehash() {
    let oldBuckets = this.buckets;
    this.buckets = [];
    this.bucketSize *= 2;
    for (let list of oldBuckets) {
      console.log(list);
      if (list) {
        let currentNode = list.head;
        while (currentNode !== null) {
          let key = currentNode.value;
          this.set(key);
          currentNode = currentNode.nextNode;
        }
      }
    }
  }

  set(key) {
    // grow bucket size if capcity is full.
    if (this.getBucketsNodesAmount() >= this.calcBucketsFormula()) {
      this.rehash();
    }
    // add node to buckets with checks for collison.
    let index = this.hash(key);
    this.checkBounds(index);
    let newList = new setLinkedList(key);
    if (this.buckets[index] === undefined) {
      this.buckets[index] = newList;
    } else if (this.buckets[index].contains(key)) {
      let findIndex = this.buckets[index].find(key);
      this.buckets[index].removeAt(findIndex);
      this.buckets[index].insertAt(key, findIndex);
    } else {
      this.buckets[index].append(key);
    }
  }

  has(key) {
    // takes a key as an argument and returns true or false based on whether or not the key is in the hash map.
    let index = this.hash(key);
    this.checkBounds(index);
    if (!this.buckets[index]) {
      return false;
    }
    let result = this.buckets[index].find(key);
    if (result === null) {
      return false;
    } else {
      return true;
    }
  }

  remove(key) {
    let index = this.hash(key);
    this.checkBounds(index);
    if (!this.buckets[index]) {
      return false;
    }
    let result = this.buckets[index].find(key);
    if (result === null) {
      return false;
    } else {
      this.buckets[index].removeAt(result);
      return true;
    }
  }

  length() {
    // return number of stored keys in map
    let buckets = this.buckets;
    let numOfKeys = 0;
    buckets.forEach((bucket) => {
      let currentNode = bucket.head;
      while (currentNode !== null) {
        numOfKeys += 1;
        currentNode = currentNode.nextNode;
      }
    });
    return numOfKeys;
  }

  clear() {
    this.buckets = [];
  }

  keys() {
    //  returns an array containing all the keys inside the hash map.
    let keysArr = [];
    let buckets = this.buckets;
    buckets.forEach((bucket) => {
      let currentNode = bucket.head;
      while (currentNode !== null) {
        keysArr.push(currentNode.value);
        currentNode = currentNode.nextNode;
      }
    });
    return keysArr;
  }
}
