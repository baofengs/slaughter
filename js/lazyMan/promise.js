class _LazyMan {
    constructor (name) {
        this.name = name;
        this.init();
    }

    init () {
        console.log(`Hi! This is ${this.name}`);
    }

    sleep (seconds) {

    }

    eat (food) {

    }

    sleepFirst (seconds) {

    }
}

const LazyMan = (name) => {
    return new _LazyMan(name);
}

LazyMan('Hank');
