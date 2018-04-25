// function asyncFunction () {
//     return new Promise((resolve, reject) => {
//         setTimeouts(() => {
//             console.log('async resolved...');
//             resolve('data');
//         }, 1000);
//     });
// }

// asyncFunction().then((data) => {
//     console.log(data);
// }).catch(() => {
//     console.log('async rejected');
// });

// function getURL (url) {
//     return new Promise ((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url, true);
//         xhr.onload = () => {
//             if (xhr.status == 200) {
//                 resolve(JSON.stringify(xhr.data));
//             } else {
//                 reject(new Error(xhr.statusText));
//             }
//         };
//         xhr.onerror = () => {
//             reject(new Error(xhr.statusText));
//         }
//         xhr.send();
//     });
// }

// const url = 'http://httpbin.org/get';

// getURL(url).then(
//     res => {
//         console.log(res);
//     },
//     err => {
//         console.log(err);
//     }
// );

var promise = new Promise (function (resolve, reject) {
    console.log('in promise');
    resolve(2);
});

promise.then((res) => {
    console.log(res);
});

console.log('outer...');
