const { getProvinceList } = require("../services/master-services");

var redisClient = null;
class Redis {
     
    constructor(c){
        if (c)
        redisClient = c;
    }

    get(){
        return redisClient;
    }
    async setProvinceList(){
        getProvinceList().then(res => {
            redisClient.setAsync("provinces", JSON.stringify(res));
          }).catch(err => console.log(err));
    }
    async getProvinceList(){
        return redisClient.getAsync("provinces");
    }
    async getSocketPoolling(){
        return redisClient.getAsync("sockets");
    }
    async setSetSocket(id){
        getSocketPoolling().then(res => {
            let newRes = res;
            newRes.push(id);
            redisClient.setAsync("sockets", JSON.stringify(newRes));
          }).catch(err => console.log(err));
    }
}

module.exports = Redis;
