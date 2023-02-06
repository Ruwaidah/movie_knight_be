const db = require("../../database/dbConfig.js");

async function add(data, tb) {
    const [id] = await db(tb).insert(data, "id"); return findBy({ id: id }, tb);
}

const findBy = (data, tb) =>
    db(tb).where(data).first();



async function updateUser(data, tb, id) {
    await db(tb).where(id).update(data);
    return findBy(id, tb)
}


const findBytheater = (data) => {
    console.log(data)
    return db("favoriteTheatre").where(data).select("id", "theatreId", "theatre", "street", "state", "city", "zip")
}

const deleteData = (data, tb) =>
    db(tb).where(data).del()





module.exports = {
    findBy, add, updateUser, findBytheater, deleteData
};