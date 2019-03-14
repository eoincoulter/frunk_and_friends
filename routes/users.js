var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Relationship = require('../models/relationships');
var jwt = require('jsonwebtoken');




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.get('/register', function(req, res, next) {
    res.render('register');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

/* Get feed page*/
router.get('/feed', function(req, res, next) {
    res.render('feed');
});

router.get('/home', function(req, res, next) {
    res.render('home');
});

router.get('/friendlist', function(req, res, next) {
    res.render('friendlist');
});



// router.post('/register', function(req, res, next){
//     var email = req.body.email;
//     var username = req.body.user_name;
//     var password = req.body.password;
//     // Check if account already exists
//     User.findOne({ 'email' :  email }, function(err, user)
//     {
//         if (err)
//             res.send(err);
//         // check to see if theres already a user with that email
//         if (user) {
//             res.status(401).json({
//                 "status": "info",
//                 "body": "Email already taken"
//             });
//         }
//         User.findOne({ 'user_name' :  username }, function(err, user)
//         {
//             if (err)
//                 res.send(err);
//             // check to see if theres already a user with that email
//             if (user) {
//                 res.status(401).json({
//                     "status": "info",
//                     "body": "Username already taken"
//                 });
//             } else {
//               // If there is no user with that username create the user
//               var newUser = new User();
//
//               // set the user's local credentials
//               newUser.email = email;
//               newUser.user_name = username;
//               newUser.password = newUser.generateHash(password);
//               newUser.access_token = createJwt({user_name:username});
//               newUser.save(function(err, user) {
//                   if (err)
//                       throw err;
//   	     res.cookie('Authorization', 'Bearer ' + user.access_token);
//                   res.json({'success' : 'account created'});
//
//               });
//           });
//       });
//     });
// });



router.post('/register', function(req, res, next){

    var username = req.body.user_name;
    var password = req.body.password;
    var email = req.body.email;
    // Check if account already exists
    User.findOne({ 'user_name' :  username }, function(err, user)
    {
        if (err)
            res.send(err);
        // check to see if theres already a user with that email
        if (user) {
            res.status(401).json({
                "status": "info",
                "body": "Username already taken"
            });
        }
        User.findOne({ 'email' :  email }, function(err, user)
        {
            if (err)
                res.send(err);
            // check to see if theres already a user with that email
            if (user) {
                res.status(401).json({
                    "status": "info",
                    "body": "email already taken"
                });
            } else {
            // If there is no user with that username create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.user_name = username;
            newUser.password = newUser.generateHash(password);
            newUser.email = email;
            newUser.access_token = createJwt({user_name:username});
            newUser.save(function(err, user) {
                if (err)
                    throw err;
	     res.cookie('Authorization', 'Bearer ' + user.access_token);
                res.json({'success' : 'account created'});

            });
        }
    });
    });
});










router.post('/login', function(req, res, next){
    var username = req.body.user_name;
    var password = req.body.password;
    User.findOne({'user_name': username}, function (err, user) {
        // if there are any errors, return the error
        if (err)
            res.send(err);
        // If user account found then check the password
        if (user) {
          // Compare passwords
            if (user.validPassword(password)) {
                // Success : Assign new access token for the session
                user.access_token = createJwt({user_name: username});
                user.save();
                res.cookie('Authorization', 'Bearer ' + user.access_token);
                res.json({'success' : 'loggedIn'});
            }
            else {
                res.status(401).send({
                    "status": "error",
                    "body": "Email or password does not match"
                });
            }
        }
        else
        {
            res.status(401).send({
                "status": "error",
                "body": "Username not found"
            });
        } }); });



//***GOOD
router.post('/relationship',  function(req, res, next){
  UserA = req.body.userOne;
  UserB = req.body.userTwo;
  //status = req.body.status;

              // If there is no user with that username create the user
              var newRelationship = new Relationship();

              // set the relationships' local credentials
              newRelationship.requester = UserA;
              newRelationship.recipient = UserB;
          //    newRelationship.status = status;
              newRelationship.save(async function(err, user) {
                  if (err)
                      throw err;
                  res.cookie('Authorization', 'Bearer ' + user.access_token);

                  const docA = await Relationship.findOneAndUpdate(
                          { requester: UserA, recipient: UserB },
                          { $set: { status: 1 }},
                          { upsert: true, new: true }
                      )
                      const docB = await Relationship.findOneAndUpdate(
                          { recipient: UserA, requester: UserB },
                          { $set: { status: 2 }},
                          { upsert: true, new: true }
                      )
                      const updateUserA = await  User.findOneAndUpdate(
                          { _id: UserA },
                          { $push: { friends: docA._id }}
                      )
                      const updateUserB = await User.findOneAndUpdate(
                          { _id: UserB },
                          { $push: { friends: docB._id }}
                      )

                  res.json({'success' : 'Relationship created'});

              });
});

//update relationship status
router.patch('/relationship', function(req, res, next){
    // var userOne = req.body.u1ID;
    // var userTwo = req.body.u2ID;
  //  tesst
        rID = req.body.rID;
        status = req.body.status;


          Relationship.findOneAndUpdate({'_id': rID },{status: status}, function (err, relationship){
              // if there are any errors, return the error
              if (err)
                  res.send(err);
              //if userOne account found
              if (relationship) {

                    if (err)
                        throw err;
                    res.json({'success' : 'Relationship updated'});
              } else
              {
                  res.status(401).send({
                      "status": "error",
                      "body": "Username not found"
                  });
              }
   });
});

router.get('/relationship1', function(req, res, next) {
  var userOne = req.body.userOne;
  var userTwo = req.body.userTwo;

      Relationship.
        findOne({ 'u1ID': userOne,'u2ID': userTwo }).
        populate('u2ID').
        exec(function (err, relationship) {
          // if there are any errors, return the error
          if (err) return handleError(err);
          // If user account found then get id
          if (relationship) {

            console.log('The user is %s', relationship.u2ID.user_name);
            res.json({'success' : 'Relationship found'});
            // prints "The author is Ian Fleming"
        }

        else
        {
            res.status(401).send({
                "status": "error",
                "body": "Relationship not found"
            });
        }
    });
});



//***NOT WORKING
//*** SUCCESSFUL FOR USERS AND NOT USERS
  router.get('/friendslist', function(req, res, next) {
    var userOne = req.body.userOne;

         User.
          find({ 'user_name': userOne}).
          populate({
            path: 'friends',
            match: { status : 3},
            populate: { path: "recipient", select: 'user_name'}
          }).
          exec(function (err, friends) {
            // if there are any errors, return the error
            if (err) return handleError(err);
            // If user account found then get id
            if (friends) {

          //    console.log('The user is %s', relationship.u2ID.user_name);
              res.json({'success' : 'Friends found'});
            	res.json(friends);
              // prints "The author is Ian Fleming"
          }

          else
          {
              res.status(401).send({
                  "status": "error",
                  "body": "No friends found"
              });
          }
      });

      // User.aggregate([
      //   { "$lookup": {
      //     "from": Friend.collection.name,
      //     "let": { "friends": "$friends" },
      //     "pipeline": [
      //       { "$match": {
      //         "recipient": userOne,
      //         "$expr": { "$in": [ "$_id", "$$friends" ] }
      //       }},
      //       { "$project": { "status": 1 } }
      //     ],
      //     "as": "friends"
      //   }},
      //   { "$addFields": {
      //     "friendsStatus": {
      //       "$ifNull": [ { "$min": "$friends.status" }, 0 ]
      //     }
      //   }}
      // ])

  });




  // ////////////////////////////////////////////////////////////////
  // // EVENTS CODE
  //
  //OKAY NOT PERFECT
  router.post('/event', function(req, res, next){
    location = req.body.location;
    description = req.body.description;
    time = req.body.time;
    //duration = req.body.duration;
    UserA = req.body.userID;

                //  create the Event
                var newEvent = new Event();

                // set the relationships' local credentials
                newEvent.location = location;
                newEvent.description = description;
                newEvent.time = time;
                //newEvent.duration = duration;
                newEvent.creater = UserA;
                newEvent.save(async function(err, user) {
                    if (err)
                        throw err;
                   res.cookie('Authorization', 'Bearer ' + user.access_token);

                    const docA = await Event.findOne(
                            { creater: UserA }//, location: location, discription: discription, time: time} //, duration: duration},
                            // ^^^^^^^^^^^^^ NOT going to work in the long run ie if a user creates 2 or more events
                            //{ upsert: true, new: true }
                        )
                        const updateUserA = await  User.findOneAndUpdate(

                            { _id: UserA },
                            { $push: { events: docA._id }}
                        )

                    res.json({'success' : 'Event created'});


                });
    });





  router.get('/event', function(req, res, next) {
      var username = req.body.user_name;
      var stat = req.body.stat;

      User.findOne({'user_name': username}, function (err, user) {
          // if there are any errors, return the error
          if (err)
              res.send(err);
          // If user account found then get id
          if (user) {
            email = User.email;
            user_name = User.user_name;

          }
        });
    });



/////////////////////////////////////////////
//EVENT RELATIONSHIP


//OKAY GOOD
router.post('/eventRelationship', async  function(req, res, next){
  eventID = req.body.event;
  UserA = req.body.userOne;
  UserB = req.body.userTwo;
  //status = req.body.status;

 //  const doc1 = await Event.findOne(
 //          { eventID: eventID},
 //          'creater',
 //           function (err, event) {}
 //         )
 // const doc2 = await Event.findOne(
 //         { eventID: eventID},
 //
 //          function (err, event) {}
 //        ).populate({path: 'invitees', select: 'requester'})


  // if(doc1 != UserB || doc2 != UserB)
  //     {

        //  create the EventRelationship
        var newEventRelationship = new EventRelationship();

        // set the relationships' local credentials
        newEventRelationship.eventID = eventID;
        newEventRelationship.requester = UserA;
        newEventRelationship.recipient = UserB;
        //newEventRelationship.eventRelationshipStatus = 0;
        //    newRelationship.status = status;
        newEventRelationship.save(async function(err, user) {
            if (err)
                throw err;
            res.cookie('Authorization', 'Bearer ' + user.access_token);

              //NB
              //the requester should be already going
              //NB

            const docA = await Event.findOneAndUpdate(
                    { eventID: eventID} //,
                    // { $set: { eventRelationshipStatus: 1 }},
                    // { upsert: true, new: true }
                )
            const docB = await EventRelationship.findOneAndUpdate(
                { eventID : eventID, requester: UserA, recipient: UserB } ,
                { $set: { eventRelationshipStatus: 0 }},
                { upsert: true, new: true }
            )

              // const updateEventA = await  Event.findOneAndUpdate(
              //     { _id: eventID },
              //     { $push: {invitees: docA._id }}
              // )

              const updateEventB = await  Event.findOneAndUpdate(
                  { _id: eventID },
                  { $push: {invitees: docB._id }}
              )

              // const updateUserA = await  User.findOneAndUpdate(
              //     { _id: UserA },
              //     { $push: { events: docA._id }}
              // )

            const updateUserB = await User.findOneAndUpdate(
                { _id: UserB },
                { $push: { events: docA._id }}
            )

              res.json({'success' : 'Event Relationship created'});

        });
      // }
      // else{
      //   res.json({'error' : 'User already an invitee'});
      // }
});


//*** GOOD
router.patch('/eventaccept', function(req, res, next){
  eventID = req.body.event;
  UserA = req.body.userOne;
  UserB = req.body.userTwo;

  EventRelationship.findOneAndUpdate(
        {eventID  : eventID , requester: UserA, recipient: UserB },
        { $set: { eventRelationshipStatus: 1 }},
         function (err, eventrelationship){
                // if there are any errors, return the error
                if (err)
                    res.send(err);
                //if userOne account found
                if (eventrelationship) {
                      if (err)
                          throw err;
                      res.json({'success' : 'Event Relationship updated'});
                } else
                {

                  EventRelationship.findOneAndUpdate(
                        { eventID  : eventID, requester: UserA, recipient: UserB },
                        { $set: {   eventRelationshipStatus : 1 }},
                         function (err, relationship){
                                // if there are any errors, return error
                                if (err)
                                    res.send(err);
                                //if userOne account found
                                if (relationship) {
                                      if (err)
                                          throw err;
                                      res.json({'success' : 'Event Relationship updated'});
                                } else
                                {
                                    res.status(401).send({
                                        "status": "error",
                                        "body": "Event Relationship not found"
                                    });
                                }
                     });
                }
     });



   });


//***GOOD
   router.patch('/eventreject',async function(req, res, next){
     eventID = req.body.event;
     UserA = req.body.userOne;
     UserB = req.body.userTwo;

    const docA = await EventRelationship.findOneAndRemove(
        { eventID  : eventID, requester: UserA, recipient: UserB }
      )
    // const docB = await Event.findOneAndRemove(
    //     { recipient: UserA, requester: UserB }
    //   )

    const updateEvent = await Event.findOneAndUpdate(
          { _id: eventID },
          { $pull: { invitees: docA._id }},
          async  function (err, user){
                   // if there are any errors, return the error
                   if (err)
                       res.send(err);
                   //if userOne account found
                   if (user) {
                         if (err)
                             throw err;
                         res.json({'success' : 'Relationship A updated'});
                   } else
                   {


                           const updateUser = await User.findOneAndUpdate(
                                 { _id: UserB },
                                 { $pull: { events: eventID }},
                                  function (err, relationship){
                                         // if there are any errors, return the error
                                         if (err)
                                             res.send(err);
                                         //if userOne account found
                                         if (relationship) {
                                               if (err)
                                                   throw err;
                                               res.json({'success' : 'Relationship B updated'});
                                         } else
                                         {
                                             res.status(401).send({
                                                 "status": "error",
                                                 "body": "User ID not found"
                                             });
                                         }
                              });

                   }
        });

      });










/*
 Creates a JWT
 */
function createJwt(profile) {
    return jwt.sign(profile, 'CSIsTheWorst', {
        expiresIn: '10d'
    });
}



module.exports = router;
