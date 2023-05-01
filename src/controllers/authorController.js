const { log } = require('console');
// const authorModel = require('../models/authorModel.js');
const AuthorModel = require('../models/authorModel.js');
const jwt = require('jsonwebtoken');

//----------------------------------------------------------------------------------------------------//

const createAuthor = async function (req, res) { 
  try {
    const authorData = req.body;
    
    if (Object.keys(authorData).length == 0)
      return res.status(400).send({ status: false, msg: 'enter body' });
    let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    let mailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    let passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!authorData.fname)
      return res
        .status(400)
        .send({ status: false, msg: 'first name required' });

    if (!authorData.lname)
      return res.status(400).send({ status: false, msg: 'last name required' });

    if (
      !nameRegex.test(authorData.fname) || !nameRegex.test(authorData.lname)
    ) {
      return res.status(400).send({ msg: 'Please enter valid characters only in fname and lname' });
    }

    if (!mailRegex.test(authorData.email)) {
      return res.status(400).send({ msg: 'Please enter valid mailId' });
    }
    if (!authorData.email)
      return res.status(400).send({ status: false, msg: 'email required' });
      
    const email = await AuthorModel.findOne({ email: authorData.email });
    if (email) return res.status(400).send({ status: false, msg: 'email already taken' });
  

    if (!authorData.password)
      return res.status(400).send({ status: false, msg: 'password required' });

    if (!passRegex.test(authorData.password))
      return res.status(400).send({
        msg: 'Please enter a password which contains min 8 letters, at least a symbol, upper and lower case letters and a number',
      });
 console.log(".............58");
    const savedData = await AuthorModel.create(authorData);

    res.status(201).send({ status: true, msg: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//----------------------------------------------------------------------------------------------------//
const findAuthor=async function(req,res){
  try {
    let data = req.query;
    // let filter = { isDeleted: false};
    

    if (Object.keys(data).length == 0) {
     console.log("..........66");
      let s = await AuthorModel.find(data);
      res.status(200).send(s);}


    // } else {
    //   console.log("..........72");
    //   filter['$or'] = [
    //     { authorId: data.authorId },
    //     { fname: data.fname },
    //     { lname: data.lname }
    //   ];
    //   console.log(filter);
    //          let allAuthor = await AuthorModel.find(filter);

    //   if (allAuthor.length == 0) {
    //     return res.status(404).send({ status: false, msg: 'author not found' });
    //   } 
    //   res.status(200).send(allAuthor);
    // }
//......................
// const findAuthor = async function(req, res) {
//   try {
//     let data = req.query;
//     let filter = { isDeleted: false };

//     if (Object.keys(data).length == 0) {
//       let s = await AuthorModel.find(filter);
//       res.status(200).send(s);
//     } else {
//       let orCondition = [];

//       if (data.authorId) {
//         orCondition.push({ authorId: data.authorId })}

//       if (data.fname) {
//         orCondition.push({ fname: data.fname })}

//       if (data.lname) {
//         orCondition.push({ lname: data.lname })}

//       if (orCondition.length == 0) {
//         return res.status(400).send({ status: false, msg: 'Invalid query parameters' })}

//       filter['$or'] = orCondition;

//       let allAuthor = await AuthorModel.find(filter);

//       if (allAuthor.length == 0) {
//         return res.status(404).send({ status: false, msg: 'Author not found' });
//       }

//       res.status(200).send(allAuthor);
//     }
//   } catch (err) {
//     res.status(500).send({ msg: 'Error', error: err.message });
//   }
// };
//...................
if(data.fname){
  let allAuthor = await AuthorModel.find({fname: data.fname});

      if (allAuthor.length == 0) {
        console.log("........130");
        return res.status(404).send({ status: false, msg: 'author not found' });
      } 
      res.status(200).send(allAuthor);
}

if(data.lname){
  let allAuthor = await AuthorModel.find({lname: data.lname});

      if (allAuthor.length == 0) {
        console.log("........139");
        return res.status(404).send({ status: false, msg: 'author not found' });
      } 
      res.status(200).send(allAuthor);
}
if(data.authorId){
  let allAuthor = await AuthorModel.findById({_id:data.authorId});
      if (allAuthor.length == 0) {
        console.log(".......148");
        return res.status(404).send({ status: false, msg: 'author not found' });
      } 
      res.status(200).send(allAuthor);
}

  } catch (err) {
    res.status(500).send({ msg: 'Error', error: err.message });
  }
};

//.....................................................................................................

const updateAuthor = async function (req, res) {

  try {
    console.log("......93");
    let id = req.params.authorId;
    let data = req.body;
    let author = await AuthorModel.findOne({ _id: id, isDeleted: false });
    if (Object.keys(author).length == 0) {
      return res.status(404).send('No such author found');
    }
  
    if (data.fname) {author.fname = data.fname;}
    if (data.lname)  {author.lname = data.lname;}


    author.isPublished = true;
    author.publishedAt = Date();
    let updateData = await AuthorModel.findByIdAndUpdate({ _id: id }, author, {
      new: true,
    });
    res.status(200).send({ status: true, msg: updateData });
    console.log(updateData)
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
//......................................................................................................

const deleteAuthor = async function (req, res) {
  try {
    let id = req.params.authorId;
    const allAuthor = await AuthorModel.findOne({ _id: id, isDeleted: false });
    if (!allAuthor) { return res.status(404).send({ status: false, msg: 'This author is not found or deleted.' });}
    allAuthor.isDeleted = true;
    const updated = await AuthorModel.findByIdAndUpdate({ _id: id }, allAuthor, {
      new: true,
    });
    res.status(200).send({ status: true, msg: 'Successfully Deleted' });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//....................................................................................................

const loginAuthor = async function (req, res) {
  try {
    let userName = req.body.emailId;
    if (!userName)
      return res
        .status(400)
        .send({ status: false, msg: 'please enter emailId' });

    let password = req.body.password;
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: 'please enter password' });

    let findAuthor = await AuthorModel.findOne({
      email: userName,
      password: password,
      isDeleted:false
    });
    if (!findAuthor)
      return res.status(404).send({
        status: false,
        msg: 'Email or Password is not valid',
      });

    let token = jwt.sign(
      {
        authorId: findAuthor._id.toString(),
      },
      'group-21'
    );
    res.setHeader('x-api-key', token);
    res.status(200).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.findAuthor=findAuthor
module.exports.loginAuthor = loginAuthor;
module.exports.updateAuthor=updateAuthor
module.exports.deleteAuthor=deleteAuthor
