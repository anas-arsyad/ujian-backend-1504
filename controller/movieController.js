const db = require("../database/")
const { generateQuery, asyncQuery} = require("../helpers/queryHelp")


module.exports={
    getAll:async(req,res)=>{
        try {
            const queryMovie=`select m.name,m.release_date,m.release_month,m.release_year,m.genre,m.description,ms.status,l.location,st.time from movies m
            join schedules s on m.id=s.movie_id
            join locations l on l.id=s.location_id
            join show_times st on st.id=s.time_id
            join movie_status ms on m.status=ms.id `

            const result=await asyncQuery(queryMovie)

            res.status(200).send(result)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    getMovies:async(req,res)=>{
        console.log(req.query);
        try {
            const queryMovie=`select m.name,m.release_date,m.release_month,m.release_year,m.genre,m.description,ms.status,l.location,st.time from movies m
            join schedules s on m.id=s.movie_id
            join locations l on l.id=s.location_id
            join show_times st on st.id=s.time_id
            join movie_status ms on m.status=ms.id 
            where ${generateQuery(req.query)}`
            console.log(queryMovie);
            const result=await asyncQuery(queryMovie)
            res.status(200).send(result)

        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    addMovies:async (req, res) => {
        const { name, genre, release_date, release_month,release_year,duration_min,description } = req.body
        try {
            const addQuery = `insert into movies (name, genre, release_date, release_month,release_year,duration_min,description) 
                              values (${db.escape(name)}, ${db.escape(genre)}, ${db.escape(release_date)}, ${db.escape(release_month)},${db.escape(release_year)},${db.escape(duration_min)},${db.escape(description)})`

            const result = await asyncQuery(addQuery)

            const getQuery = `select id,name, genre, release_date, release_month,release_year,duration_min,description from movies where id=${result.insertId}`

            const resultUpdate = await asyncQuery(getQuery)

            res.status(200).send(resultUpdate)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    edit:async(req,res)=>{
        try {
            const queryStatus=`select * from users where uid=${db.escape(req.user.uid)}`
            const result= await asyncQuery(queryStatus)
            if (req.user.role===2 ) return res.status(400).send("tidak bisa edit")
            const querUpdate = `UPDATE movies SET status=${db.escape(req.body.status)} WHERE id=${req.params.id}`
            const result1= await asyncQuery(querUpdate)
            let obj={
                id:req.params.id,
                message:"status has been changed"
            }

            res.status(200).send(obj)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
    set:async(req,res)=>{
        try {
            if (req.user.role===2 ) return res.status(400).send("tidak bisa edit")
            const querUpdate = `UPDATE schedules SET location_id=${db.escape(req.body.location_id)}, time_id=${db.escape(req.body.time_id)} WHERE movie_id=${req.params.id}`
            const result1= await asyncQuery(querUpdate)

            let obj={
                id:req.params.id,
                message:"schedules has been added"
            }

            res.status(200).send(obj)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    }
}