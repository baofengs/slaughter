class _LazyMan {
    constructor (name) {
        this.name = name;
        this.task = [];
        this.init();
    }
    
    init () {
        const name = this.name;
        const task = ((name) => () => {
            console.log(`Hi! This is ${name}`);
            this.next();
        })(name);

        this.task.push(task);

        setTimeout(() => {
            this.next();
        }, 0);
    }

    next () {
        console.log(this.task[0]);
        const fn = this.task.shift();
        fn && fn();
    }

    eat (food) {
        let task = (food => () => {
            console.log(`Eat ${food}`);
            this.next();
        })(food);
        this.task.push(task);
        return this;
    }

    sleep (seconds) {
        const task = ((seconds) => () => {
            setTimeout(() => {
                console.log(`Wake up after ${seconds}`);
                this.next();
            }, seconds * 1000);
        })(seconds);
        this.task.push(task);
        return this;
    }

    sleepFirst (seconds) {
        const task = (seconds => () => {
            setTimeout(() => {
                console.log(`Wake up after ${seconds}`);
                this.next();
            }, seconds * 1000);
        })(seconds);
        this.task.unshift(task);
        return this;
    }
}

const LazyMan = (name) => {
    return new _LazyMan(name);
}

LazyMan('Hank').sleepFirst(1).eat('dinner').sleep(1).eat('supper');
