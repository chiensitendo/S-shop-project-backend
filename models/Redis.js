const { getProvinceList } = require("../services/master-services");

var client = null;
class Redis {
     
    constructor(c){
        if (c)
        client = c;
    }

    get(){
        return client;
    }
    async setProvinceList(){
        getProvinceList().then(res => {
            redisClient.setAsync("provinces", JSON.stringify(res));
          }).catch(err => console.log(err));
    }
    async getProvinceList(){
        return client.getAsync("provinces");
    }
}

module.exports = Redis;
