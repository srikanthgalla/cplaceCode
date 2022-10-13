// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
var someValues = [1,2,3,4,6,10];
let isvalid = false;
someValues.forEach((element) => {
    if(element==2){
        console.log(" find");
        isvalid = true;
        return false;
    }
});
if(!isvalid){
    return messages.get('invalid');
}