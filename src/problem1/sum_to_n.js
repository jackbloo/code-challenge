var sum_to_n_a = function(n) {
    // your code here
    let result = 0;
    for(let i = 1; i <= n; i++){
        result += i
    }

    return result
};

var sum_to_n_b = function(n) {
    // your code here
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    const total = arr.reduce((accu, number) => accu += number, 0)
    return total;
};

var sum_to_n_c = function(n) {
    // your code here
    return (n * (n+1))/2
};



console.log('total a:', sum_to_n_a(5))
console.log('total b:', sum_to_n_b(5))
console.log('total c:', sum_to_n_c(5))