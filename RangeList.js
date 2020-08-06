
// Problem Set below:
// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)
/**
 *
 * NOTE: Feel free to add any extra member variables/functions you like.
 */


class RangeNode {
    constructor(range) {
        this.range = range;
        this.max = 0;
        this.left = null;
        this.right = null;

    }
}


class IntervalTree {
    constructor(){
        this.root = null;
    }

    createNewRangeNode(range) {
        var tempNode = new RangeNode(range);
        tempNode.max = range[1];
        tempNode.left = null;
        tempNode.right = null;

        return tempNode;
    }

    insert(root, range) {

        if (root === null) {
            return this.createNewRangeNode(range);
        }

        var rootLowVal = root.range[0];

        if (range[0] < rootLowVal) {
            root.left = this.insert(root.left, range);
        }
        else {
            root.right = this.insert(root.right, range);
        }

        // Update max value of this root if it's less than current range high value
        if (root.max < range[1]) {
            root.max = range[1];
        }

        return root;
    }

    remove(root, range) {
        if (root === null) {
            return null;
        }

        var rootLowVal = root.range[0];

        if (range[0] < rootLowVal) {
            root.left = this.remove(root.left, range);
            return root;
        }
        else if (range[0] > rootLowVal) {
            root.right = this.remove(root.right, range);
            return root;
        }
        else {
            if (root.left === null && root.right === null) {
                root = null;
                return root;
            }

            if (root.left === null) {
                root = root.right;
                return root;
            }
            else if (root.right === null) {
                root = root.left;
                return root;
            }

            var replacementRangeNode = this.findMinRangeNode(root.right);
            root.range = replacementRangeNode.range;
            root.max = replacementRangeNode.max;

            // Remove the replacement node
            root.right = this.remove(root.right, replacementRangeNode.range);
            return root;
        }
    }

    isWithin(range1, range2) {
        if (range1[0] <= range2[1] && range2[0] <= range1[1]) {
            return true;
        }
        else {
            return false;
        }
    }

    isWithInSearch(root, range) {
        if (root === null) {
            return null;
        }

        if (this.isWithin(root.range, range)) {
            return root;
        }

        if (root.left !== null && root.left.max >= range[0]) {
            return this.isWithInSearch(root.left, range);
        }
        else {
            return this.isWithInSearch(root.right, range);
        }
    }

    search(root, range, overlappingRanges) {
        if (root === null) {
            return;
        }

        if (range[0] > root.max) {
            return;
        }

        if (root.left !== null) {
            this.search(root.left, range, overlappingRanges);
        }

        if (this.isWithin(root.range, range)) {
            overlappingRanges.push(root);
        }

        if (range[1] < root.range[0]) {
            return;
        }

        if (root.right !== null) {
            this.search(root.right, range, overlappingRanges);
        }
    }

    findMinRangeNode(root) {
        if (root.left === null) {
            return root;
        } else {
            return this.findMinRangeNode(root.left);
        }
    }

    print(root) {
        var rangeNodeList = [];
        this.nodesInOrder(root, rangeNodeList);
        
        var rangeNodeListString = "";
        var i;
        for (i = 0; i < rangeNodeList.length; i++) {
            rangeNodeListString += "[" + rangeNodeList[i][0].toString() + ", " + rangeNodeList[i][1].toString() + ") ";
        }

        console.log(rangeNodeListString);
    }

    nodesInOrder(root, rangeNodeList) {
        if (root === null) {
            return;
        }

        this.nodesInOrder(root.left, rangeNodeList);
        rangeNodeList.push(root.range);
        this.nodesInOrder(root.right, rangeNodeList);
    }
}


class RangeList {
    constructor() {
        this.data = new IntervalTree();
    }

    /**
     * Adds a range to the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    add(range) {
        // Invalid range passed
        if (range.length != 2) {
            return;
        }

        // Find all ranges that overlap the supplied range
        var overlappingRanges = [];
        this.data.search(this.data.root, range, overlappingRanges);

        // If doesn't exist then simply add it
        if (overlappingRanges.length == 0) {
            this.data.root = this.data.insert(this.data.root, range);
            return;
        }

        // Handle case where supplied range fully overlaps multiple ranges in the list
        var i;
        var rangeNode;
        var newRangeAdded = false;
        for (i = overlappingRanges.length - 1; i >= 0; i--) {
            rangeNode = overlappingRanges[i];
            if (range[0] <= rangeNode.range[0] && range[1] >= rangeNode.range[1]) {
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                if (newRangeAdded == false) {
                    this.data.root = this.data.insert(this.data.root, range);
                    newRangeAdded = true;
                }
                overlappingRanges.splice(i, 1);    
            }
        }

        // Handle cases of partial overlap
        for (i = 0; i < overlappingRanges.length; i++) {
            rangeNode = overlappingRanges[i];

            // Existing range already covers new range
            if(rangeNode.range[0] <= range[0] && rangeNode.range[1] >= range[1]) {
                return;
            }
            // New range decrements the low of the existing range
            else if (range[0] < rangeNode.range[0] && rangeNode.range[1] >= range[1]) {
                rangeNode.range[0] = range[0];
            }
            // New range increments the high of the existing range
            // Remove and Insert to maintain tree max
            else if (rangeNode.range[0] <= range[0] && range[1] > rangeNode.range[1]) {
                var newRange = [rangeNode.range[0], range[1]];
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                this.data.root = this.data.insert(this.data.root, newRange);
            }
        }
    }

    /**
     * Removes a range from the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    remove(range) {
        if (range.length != 2) {
            return;
        }

        // Find all ranges that overlap the supplied range
        var overlappingRanges = [];
        this.data.search(this.data.root, range, overlappingRanges);

        var i;
        var rangeNode;
        for (i = 0; i < overlappingRanges.length; i++) {
            rangeNode = overlappingRanges[i];

            // Existing range fully overlaps supplied range. Remove existing fully.
            if (rangeNode.range[0] >= range[0] && rangeNode.range[1] <= range[1]) {
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
    
            } 
            // Trim the low end of the existing range based on supplied range
            else if (range[0] <= rangeNode.range[0] && rangeNode.range[1] > range[1]) {
                rangeNode.range[0] = range[1];
            }
            // Overlap is on the high end. Remove existing range and insert new range
            // the satisfies a smaller high end. Remove, insert to maintain max of tree
            else if (rangeNode.range[0] < range[0] && range[1] >= rangeNode.range[1]) {
                var newRange = [rangeNode.range[0], range[0]];
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                this.data.root = this.data.insert(this.data.root, newRange);
            }
            // Supplied range splits existing range in the middle.
            // Remove overlapping sectiond and insert back non-overlapping sections
            else if (rangeNode.range[0] < range[0] && rangeNode.range[1] > range[1]) {
                var firstNewRange = [rangeNode.range[0], range[0]];
                var secondNewRange = [range[1], rangeNode.range[1]];
    
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                this.data.root = this.data.insert(this.data.root, firstNewRange);
    
                this.data.root = this.data.insert(this.data.root, secondNewRange);
            } 
        }

    }

    /**
     * Prints out the list of ranges in the range list
     */
    print() {
        this.data.print(this.data.root);
    }

}


// Example run
let rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)