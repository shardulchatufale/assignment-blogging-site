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

    if (!nameRegex.test(authorData.fname) || !nameRegex.test(authorData.lname)) {
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

if(data.fname){
  let allAuthor = await AuthorModel.find({fname: data.fname,isDeleted:false});

      if (allAuthor.length==0) {
        console.log("........130");
        return res.status(404).send({ status: false, msg: 'author not found.......' });
      }
     
      res.status(200).send(allAuthor);
}

if(data.lname){
  let allAuthor = await AuthorModel.find({lname: data.lname,isDeleted:false});

      if (allAuthor.length==0) {
        console.log("........139");
        return res.status(404).send({ status: false, msg: 'author not found' });
      } 
    
      res.status(200).send(allAuthor);
}
if(data.authorId){
  let allAuthor = await AuthorModel.findById({_id:data.authorId});
  if(allAuthor.isDeleted==true){
    return res.status(404).send({ status: false, msg: 'author not found' });
  }
      res.status(200).send(allAuthor);
}

  } catch (err) {
    res.status(500).send({ msg: 'Error', error: err.message });
  }
};

//.....................................................................................................

let updateAuthor = async (req, res) => {
  try {
   
      let data = req.body;
 
      let { fname, lname,password, authorId, email,...rest } = data;

      let nameRejex=/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      let passRejex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/
      let emailRejex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

     
      if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `you can't update on ${Object.keys(rest)} key` })

     
      let finduser = await AuthorModel.findById({_id:data. authorId});
    
      
      if (!finduser) return res.status(404).send({ status: false, message: 'user id does not exist' });
    

      if (fname) {          //Update first name
          if (!nameRejex.test(fname)) return res.status(400).send({ status: false, message: 'Please enter first name in right formate' })
          finduser.fname = fname;
      }

      if (lname) {        //Update last name
          if (!nameRejex.test(lname)) return res.status(400).send({ status: false, message: 'Please enter last name in right formate' })
          finduser.lname = lname;
      }

      if (email) {        //Update email
          if (!emailRejex.test(email)) return res.status(400).send({ status: false, message: 'Please enter valid email' })
          const emailUnique = await AuthorModel.findOne({ email })
          if (emailUnique) return res.status(400).send({ status: false, message: 'Already register Email' })
          finduser.email = email
      }

      if (password) {     //Update password
          if (!passRejex.test(password)) return res.status(400).send({ status: false, message: 'Password should be between 8 to 15 character' })
          finduser.password = password
      }

let token = req.headers['x-api-key']

if (!token) return res.status(400).send({ status: false, message: "token must be present" });

// token = token.split(" ")[1]

jwt.verify(token, "group-21", function (err, decoded) {
    if (err) {
       return res.status(401).send({ status: false, message: err.message })
    } else {
        req.decodedToken = decoded
    }
})

      let tokenUserId = req.decodedToken.authorId

      if (authorId != tokenUserId) {
          return res.status(403).send({ status: false, message: "UnAuthorized Access!!" })
      }
      //Update Profile
      let updateProfile = await AuthorModel.findByIdAndUpdate({ _id: authorId }, finduser, { new: true });

      //Send Response
      res.status(200).send({ status: true, message: "User profile updated", data: updateProfile });

  } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
  }
}
//......................................................................................................

const deleteAuthor = async function (req, res) {
  try {
    let id = req.params.authorId;
    const allAuthor = await AuthorModel.findOne({ _id: id, isDeleted: false });
    if (!allAuthor) { return res.status(404).send({ status: false, msg: 'This author is not found or deleted.' });}
    allAuthor.isDeleted = true;
console.log("........186");

let token = req.headers['x-api-key']

if (!token) return res.status(400).send({ status: false, message: "token must be present" });

    jwt.verify(token, "group-21", function (err, decoded) {
      if (err) {
         return res.status(401).send({ status: false, message: err.message })
      } else {
          req.decodedToken = decoded
      }
  })
  console.log(".....194");
        let tokenUserId = req.decodedToken.authorId
  
        if (id != tokenUserId) {
            return res.status(403).send({ status: false, message: "UnAuthorized Access!!" })
        }
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
