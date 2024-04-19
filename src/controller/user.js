const userController = {
    GET: function(req, res) {
        try{
            const users = req.getData("users");
            const {userId} = req.params;
            if(userId){
                const idx = users.findIndex(user => user.userId == userId);
                if(idx >= 0) return res.status(200).json(users[idx]);
                else return res.status(404).json({message: "User not found !", statusCode: 404});
            }
            if(Object.keys(req.query).length){
                const searchData = req.searchParams(users, req.query, Object.keys(req.query));
                if(!searchData.length) return res.status(404).json({message: "User not found !", statusCode: 404})
                return res.status(200).json(searchData);
            };
            return res.status(200).json(users);
        }catch(error){
            return res.status(400).json({message: error.message})
        }
    }
}
module.exports = {userController};