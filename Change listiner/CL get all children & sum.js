const page = changeEvent.getEntity();

const VALUE = 'cf.cplace.value';

let sum = 0;
cplace.each(page.getParent().getAllChildren(), (item) => {sum+= item.get(VALUE)})
cplace.log("sum of values change event trigred");
let obj={
  customAttributes: {
    ['cf.cplace.sumOfValues']: sum
  }
};
cplace.log(JSON.stringify(obj));
cplace.actions().updatePage(page.getParent(), obj);