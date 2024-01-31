class linkedList {
  constructor(key, value) {
    this.head = new Node(key, value);
  }
  append(key, value) {
    let currentNode = this.head;
    while (currentNode.nextNode !== null) {
      currentNode = currentNode.nextNode;
    }
    currentNode.nextNode = new Node(key, value);
  }
  contains(key) {
    let currentNode = this.head;
    let result = false;
    while (currentNode !== null) {
      if (Object.keys(currentNode.value)[0] === key) {
        result = true;
      }
      currentNode = currentNode.nextNode;
    }
    return result;
  }

  getKeyValue(index) {
    let currentNode = this.head;
    if (index === 0) {
      return Object.values(currentNode.value)[0];
    }
    for (let i = 0; i < index; i++) {
      currentNode = currentNode.nextNode;
    }
    return Object.values(currentNode.value)[0];
  }

  find(key) {
    let index = 0;
    let currentNode = this.head;
    while (currentNode !== null) {
      if (Object.keys(currentNode.value)[0] === key) {
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
  insertAt(key, value, index) {
    let newNode = new Node(key, value);
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
    prevNode.nextNode = newNode;
    newNode.nextNode = toKeep;
  }
}

class Node {
  constructor(key = null, value = null, nextNode = null) {
    let obj = {};
    obj[key] = value;
    this.value = obj;
    this.nextNode = nextNode;
  }
}

class HashMap {
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
      if (list) {
        let currentNode = list.head;
        while (currentNode !== null) {
          let key = Object.keys(currentNode.value)[0];
          let value = currentNode.value[key];
          this.set(key, value);
          currentNode = currentNode.nextNode;
        }
      }
    }
  }

  set(key, value) {
    // grow bucket size if capcity is full.
    if (this.getBucketsNodesAmount() >= this.calcBucketsFormula()) {
      this.rehash();
    }
    // add node to buckets with checks for collison.
    let index = this.hash(key);
    this.checkBounds(index);
    let newList = new linkedList(key, value);
    if (this.buckets[index] === undefined) {
      this.buckets[index] = newList;
    } else if (this.buckets[index].contains(key)) {
      let findIndex = this.buckets[index].find(key);
      this.buckets[index].removeAt(findIndex);
      this.buckets[index].insertAt(key, value, findIndex);
    } else {
      this.buckets[index].append(key, value);
    }
  }

  get(key) {
    // takes one argument as a key and returns the value that is assigned to this key. If a key is not found, return null.
    let index = this.hash(key);
    this.checkBounds(index);
    if (!this.buckets[index]) {
      return false;
    }
    let result = this.buckets[index].find(key);
    if (result === null) {
      return result;
    } else {
      return this.buckets[index].getKeyValue(result);
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
        keysArr.push(Object.keys(currentNode.value)[0]);
        currentNode = currentNode.nextNode;
      }
    });
    return keysArr;
  }

  values() {
    // returns an array containing all the values.
    let valuesArr = [];
    let buckets = this.buckets;
    buckets.forEach((bucket) => {
      let currentNode = bucket.head;
      while (currentNode !== null) {
        valuesArr.push(Object.values(currentNode.value)[0]);
        currentNode = currentNode.nextNode;
      }
    });
    return valuesArr;
  }

  entries() {
    // returns an array that contains each key, value pair.
    let keyValArr = [];
    let buckets = this.buckets;
    buckets.forEach((bucket) => {
      let currentNode = bucket.head;
      while (currentNode !== null) {
        let keyVal = [];
        keyVal[0] = Object.keys(currentNode.value)[0];
        keyVal[1] = Object.values(currentNode.value)[0];
        keyValArr.push(keyVal);
        currentNode = currentNode.nextNode;
      }
    });
    return keyValArr;
  }
}

let drake = new HashMap();

drake.set('hello', 'yupper');
drake.set('gorilla19', 'yepper');
drake.set('gorilla19', 'noper');
console.log(drake.buckets[4].head);
