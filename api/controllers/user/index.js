module.exports = {


  friendlyName: 'Profile',


  description: 'User\'s profile.',


  inputs: {
  },


  exits: {
    success: {
      viewTemplatePath: 'pages/profile',
      description: 'Display the user\'s profile page for authenticated users.'
    },
    userNotFound: {
      statusCode: 404,
      description: 'The user NOT found!',
    }
  },


  fn: async function (inputs, exits) {

    try {
      let data = await User.findOne({
        id: this.req.session.userId
      });

      if (!data) {
        throw 'userNotFound';
      }
      return exits.success({ data: data });
    } catch (err) {
      throw new Error('An error occurs: ' + err);
    }

  }


};
