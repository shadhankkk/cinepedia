
let vars = {};

for(let i=0; i<10000000; i++) {
  const varName = `x${i}`;
  vars[varName] = 2*i;
}

console.log(vars['x1']);