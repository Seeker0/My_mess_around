const client = require('../models/redis.js');

const promises = {
  setUser: user => {
    return new Promise((resolve, reject) => {
      client.hmset(
        user,
        'userName',
        user,
        'pockets',
        `${user}:pockets`,
        (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        }
      );
    });
  },

  setPocket: (user, pocket) => {
    return new Promise((resolve, reject) => {
      client.hset(
        `${user}:pockets`,
        pocket,
        `${user}:${pocket}`,
        (err, data) => {
          if (err) {
            return reject(err);
          }
          console.log(data);
          return resolve(data);
        }
      );
    });
  },

  setItems: (user, pocket, item, link) => {
    return new Promise((resolve, reject) => {
      client.hset(`${user}:${pocket}`, item, link, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },

  getData: user => {
    return new Promise((resolve, reject) => {
      client.hgetall(user, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  },

  userBuilder: user => {
    let newObj = {};
    let userName;
    let pockets;
    return promises
      .getData(user)
      .then(data => (userName = data.userName))
      .then(data =>
        promises.getData(`${user}:pockets`).then(data => {
          pockets = data;
          newObj.userName = userName;
          newObj.pockets = pockets;
          // console.log(newObj);
          return newObj;
        })
      );

    // return newObj;
  },

  getItems: pocket => promises.getData(`${user}:${pocket}`),

  getPockets: user =>
    this.getData(user)
      .then(data => getData(data.pockets))
      .then(console.log)
};
module.exports = promises;
