class CountdownLatch {
    constructor(count) {
        this.count = count;
        this.resolveFn = null;
        this.promise = new Promise((resolve) => {
            this.resolveFn = resolve;
        });
    }

    countDown() {
        this.count--;
        if (this.count === 0) {
            this.resolveFn();
        }
    }

    await() {
        return this.promise;
    }
}

module.exports = CountdownLatch