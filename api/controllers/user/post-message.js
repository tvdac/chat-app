/**
 * Module dependencies
 */

// ...


/**
 * user/post-message.js
 *
 * Post message.
 */
module.exports = async function postMessage(req, res) {

  if (!req.isSocket) {
    return res.badRequest();
  }

  try {
    console.log('> post-message > find id from session ' +req.session.userId);
    let user = await User.findOne({id: req.session.userId });
    // sails.log('Find user: '+ user);
    let mesg = await ChatMessage.create({
      message: req.body.message, createdBy: user.id
    }).fetch();
    console.log('> post-message > save message successfully: '+ mesg.id);
    // sails.log('Create new message: '+mesg);
    if (!mesg) {
      throw new Error('Message processing failed!');
    }
    mesg.createdBy = user;
    // ChatMessage.publish([mesg.id], mesg);
    console.log(mesg);
    console.log('> post-message > publish');
    sails.sockets.blast('chatmessage', {
      verb: 'created',
      id: mesg.id,
      data: mesg
    });
  } catch (err) {
    return res.serverError(err);
  }
  // sails.log('Ok');
  return res.ok();

};
