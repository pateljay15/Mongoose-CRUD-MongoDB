const mongoose = require('mongoose');
const validator = require('validator')

//connection to the db or creating the db
mongoose.connect("mongodb://localhost:27017/coursesdb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } )
.then( () => console.log("Connection successful..."))
.catch( (err) => console.log(err) )
// console.log("Checking...1")

//Schema
// A Mongoose schema defines the structure of the document,
// default values, validators, etc.,

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true,
        // lowercase: true,
        // uppercase: true,
        //it trims the blank spaces from left amd right of the name
        // trim: true,
        // minlength: 2
        //if u want ur custom message to be passed on then u can use array
        minlength: [2, "minimum length"],
        maxlength: 10
    },
    // type: String,
    type: {
        type: String,
        required: true,
        // no matter user use upercase latter but it will first convert it to
        // lower case then it will check for values in enum array
        lowercase: true,
        // it will allow only those values which are present in the array
        enum: ["frontend", "backend", "database"],
    },
    videos: {
        type: Number,
        // custom validations
        // 1st way
        // validate(value){
        //     if(value < 0){
        //         throw new Error("Videos length should not be negative")
        //     }
        // }

        //2nd way
        validate: {
            validator: function(value) {
                //if it evaluates as true then validation is succesful
                //if it evalutes as false then it goes to message and print the error
              return value > 0;
            },
            message: props => `${props.value} is not a valid video length!`
          },
    },
    author: String,
    email: {
        type: String,
        required: true,
        // unique: true
        // usage of npm module validator for validation purpose
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    active: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
})

// A Mongoose model is a wrapper on the Mongoose schema.
// A Mongoose schema defines the structure of the document,
// default values, validators, etc., whereas a Mongoose model
// provides an interface to the database for creating,
// querying , updating, deleting records, etc.

//collection creation
const Playlist = new mongoose.model("Playlist", playlistSchema)


// create document or insert document


//To create or insert a one document
const createDocument = async () => {
    try{
        const reactPlaylist = new Playlist({
            name: "ReactJS",
            type: "FrontEnd",
            videos: 22,
            author: "Jay Patel",
            email : "jaypatel@gmail.com",
            active: true
        })
        
            // save method is in the document 
        const result = await reactPlaylist.save()
        console.log(result)
    }catch(err){
        console.log(err)
    }
}

createDocument()
//To insert one or many documents in collections 
// for that you have to use insertMany() method which is their in the Playlist class
// it basically takes an array of documents name
// const createDocument = async () => {
//     try{
//         const jsPlaylist = new Playlist({
//             name: "JavaScript",
//             type: "Front End",
//             videos: 150,
//             author: "Jay Patel",
//             active: true
//         })

//         const mongoosePlaylist = new Playlist({
//             name: "Mongoose",
//             type: "Database",
//             videos: 4,
//             author: "Jay Patel",
//             active: true
//         })

//         const mongoPlaylist = new Playlist({
//             name: "MongoDB",
//             type: "Database",
//             videos: 10,
//             author: "Jay Patel",
//             active: true
//         })

//         const expressPlaylist = new Playlist({
//             name: "ExpressJS",
//             type: "Back End",
//             videos: 20,
//             author: "Jay Patel",
//             active: true
//         })
        
        
//         const result = await Playlist.insertMany([jsPlaylist, mongoosePlaylist, mongoPlaylist, expressPlaylist])
//         console.log(result)
//     }catch(err){
//         console.log(err)
//     }
// }
// console.log("Checking...2")
// createDocument()
// console.log("Checking...3")


// // -------->Reading operations using mongoose

// const getDocument = async () => {
//     try{
//         // it will fetch all documents of the collection
//         // const result = await Playlist.find();
        
//         //to further query results we have to pass parameters in the find() method
//         // const result = await Playlist.find({type: "Front End"});
        
//         // if you want to get only desired fields of your choice then u can specify it in select() method
//         // the field which you want u have to put "1" infront of it , if u put "0" then you will get 
//         //all the fields expect that field in which u have put 1 infront of them
//         // const result = await Playlist.find({type: "Front End"})
//         // .select({name:1})
    
//         //if u want to fetch desired no of documents then u can achieve it by using limit() method
//         // u just have to pass no of documents u want , (it will give u documents from starting)
//         const result = await Playlist.find({type: "Front End"})
//         .select({name:1})
//         .limit(1)
    
//         console.log(result)
//     }catch(err){
//         console.log(err)
//     }
// }


// ------->Advanced queries use of comparison operator

// const getDocument = async () => {
//     try{

//         // const result = await Playlist
//         // .find({videos: {$gt : 50} })
//         // .select({name:1})
//         // .limit(1)

//         // const result = await Playlist
//         // .find({videos: {$gte : 50} })
//         // .select({name:1})
    
//         // const result = await Playlist
//         // .find({videos: {$lte : 50} })
//         // .select({name:1})

//         // the $in operator will see the array and if the values in array is match
//         //then it will show otherwise it will not show
//         // const result = await Playlist
//         // .find({type : {$in : ["Back End", "Database"] } })
//         // .select({name:1})

//         const result = await Playlist
//         .find({type : {$nin : ["Back End", "Database"] } })
//         .select({name:1})

//         console.log(result)
//     }catch(err){
//         console.log(err)
//     }
// }


// ----------> Logical operator

// const getDocument = async () => {
//     try{

//         //it will check firat type = back end , then the documents which statisfy
//         // will be fetch and then it see the second condition as author = jay patel
//         // in the remaining documents and fetches it
//         // any one condition will true it will executes it

//         // const result = await Playlist
//         // .find( {$or : [ { type: "Back End" }, { author: "Jay Patel" } ] } )
//         // .select({name:1})
        
//         // it will fetch data when both condition will be true
//         // it will fetch those whose type is back end and whose author is
//         // jay patel
//         const result = await Playlist
//         .find( {$and : [ { type: "Back End" }, { author: "Jay Patel" } ] } )
//         .select({name:1})


//         console.log(result)
//     }catch(err){
//         console.log(err)
//     }
// }


// --------->Sorting and Couting documents

// const getDocument = async () => {
//     try{

//         // const result = await Playlist
//         // .find( { author: "Jay Patel" }  )
//         // .select({name:1})
//         // .countDocuments()
        
//         // in sort method u have to pass an object and write the fields name
//         // u simply want to sort according 
//         // if 1 then ascending
//         // if -1 then decending
//         const result = await Playlist
//         .find( { author: "Jay Patel" }  )
//         .select({name:1})
//         .sort( {name: -1} )

//         console.log(result)
//     }catch(err){
//         console.log(err)
//     }
// }

// getDocument()


// -------------->Update document

// const updateDocument = async (_id) => {
//     try{

//         // this method just returns whether the document is updated or not
//         // it returns no of modified documents
//         //{ n: 1, nModified: 1, ok: 1 }
//         // const result = await Playlist.updateOne({ _id }, {
//         //     $set: {
//         //         name: "Javascript",
//         //     }
//         // })

//         //it retuns thr old document and the update that particular document
//         const result = await Playlist.findByIdAndUpdate({ _id }, {
//             $set: {
//                 name: "Javascript",
//             }
//         }, {
//             //by specifying the new = true it returns the newly modify document
//             //instead of the old document which is the default behaviour of this 
//             //method
//             new: true,
//             useFindAndModify: false
//         })

//         console.log(result)
//     }catch(err){
//         console.log(err)
//     }
// }


// updateDocument("605228a8b4e7da3b488c94a4")



// ------->Delete Document

const deleteDocument = async (_id) => {
    try{

        // this method just returns whether the document is deleted or not
        // it returns no of modified documents
        //{ n: 1, ok: 1, deletedCount: 1 }
        //u can also use deleteMany() method to delete many documents at a time
        // const result = await Playlist.deleteOne({ _id })

        //it retuns the document which is deleted
        const result = await Playlist.findByIdAndDelete({ _id })

        console.log(result)
    }catch(err){
        console.log(err)
    }
}


// deleteDocument("60534ca92762bc44dc13aba7")
