const fs = require("fs");
const path = require("path");
const toCrypt = require("sha256");
const { ServerError, ClientError } = require("../utils/error");
const model = (req, res, next) => {
  req.getData = function (fileName) {
    try{
      let data = fs.readFileSync(
        path.join(process.cwd(), "src", "database", `${fileName}.json`)
      );
      data = data ? JSON.parse(data) : [];
      return data;
    }catch(error){
      throw new ServerError()
    }
  };
  req.writeData = function (fileName, data) {
    try{
      fs.writeFileSync(
        path.join(process.cwd(), "src", `database`, `${fileName}.json`),
        JSON.stringify(data, null, 4)
      );
      return true;
    }catch(error){
      throw new ServerError()
    }
  };
  req.searchParams = function (store, query, keys) {
    if (keys.includes("min_year") && !keys.includes("max_year")) {
      store = store.filter((movie) => movie.movie_year > query["min_year"]);
      delete query.min_year;
    }
    if (!keys.includes("min_year") && keys.includes("max_year")) {
      store = store.filter((movie) => movie.movie_year < query["max_year"]);
      delete query.max_year;
    }
    if (keys.includes("min_year") && keys.includes("max_year")) {
      store = store.filter(
        (movie) =>
          movie.movie_year > query["min_year"] &&
          movie.movie_year < query["max_year"]
      );
      delete query.min_year;
      delete query.max_year;
    }
    if (keys.includes("page")) {
      delete query.page;
    }
    if (Object.keys(query).length) {
      let res = [];
      for (let serverData of store) {
        let counter = 0;
        for (let key in query) {
          if (serverData[key] == query[key]) counter++;
        }
        if (Object.keys(query).length == counter) res.push(serverData);
      }
      return res;
    } else {
      return store;
    }
  };
  req.searchDataParams = function (store, query) {
    let keys = Object.keys(query);
    let res = [];
    if (keys.includes("title")) {
      const titleRegex = new RegExp(query["title"], "gi");
      res = store.filter((movie) => movie.title.match(titleRegex));
      delete query.title;
      if (Object.keys(query).length) {
        res = req.searchParams(res, query, Object.keys(query));
      } else {
        return res;
      }
    } else {
      res = req.searchParams(store, query, keys);
    }
    return res;
  };
  req.searchData = function (fileName) {
    const data = req.getData(fileName);
    const query = structuredClone(req.query);
    let store = [];
    let keys = Object.keys(query);
    if (keys.includes("categorie")) {
      if (query["categorie"] !== "all") {
        store = data.filter((movie) =>
          movie.categories.includes(query["categorie"])
        );
        delete query.categorie;
        let res = req.searchDataParams(store, query);
        return res;
      } else if (query["categorie"] == "all") {
        delete query.categorie;
        let res = req.searchDataParams(data, query);
        return res;
      }
    } else {
      let res = req.searchDataParams(data, query);
      return res;
    }
  };
  req.paginationData = function (data, querys) {
    const { page, limit } = req.PAGINATION;
    let sliceData = [];
    req.maxPage = Math.round(data.length / limit);
    if (querys.includes("page")) {
      sliceData = data.slice(
        (+req.query["page"] - 1) * limit,
        +req.query["page"] * limit
      );
    } else {
      sliceData = data.slice((page - 1) * limit, page * limit);
    }
    return sliceData;
  };
  req.updateUser = function () {
    const users = req.getData("users");
    const { userId } = req.defUser;
    const findUser = users.find((user) => user.userId == userId);
    const idx = users.findIndex((user) => user.userId == findUser.userId);
    const newUser = {
      ...findUser,
      ...req.body,
    };
    if(req.file){
        newUser.avatar = req.file.filename
    }
    newUser.password = toCrypt(newUser.password);
    users[idx] = newUser;
    req.writeData("users", users);
    return {
        findUser,
        newUser
    };
  };  
  req.sendVideo = function(videoId){
    try{
      const videos = req.getData("videos");
      const idx = videos.findIndex((video) => video.videoId == videoId);
      if(idx >= 0 || idx == 0) {
        let filePath = path.join(process.cwd(), "src", "assets", "videos", videos[idx].videoName);
        const existType = fs.existsSync(filePath);
        if(existType) {
          const videoFormat = path.extname(videos[idx].videoName).replace(".", "");
          res.setHeader("Content-type", `video/${videoFormat}`)
          return fs.readFileSync(filePath);
        } else throw new ClientError(404, "Video not Found")
      } else throw new ClientError(404, "Video not found !");
    }catch(error){
      return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500 });
    };
  };
  return next();
};

module.exports = { model };