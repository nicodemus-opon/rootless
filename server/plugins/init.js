const path = require('path');
console.log("lil loaded")
function say(req,res){
    var pp=path.join(__dirname + "/../")
    return res.sendFile(path.join(pp+"public/uploads/260_2.png"));
}
module.exports = { say };
