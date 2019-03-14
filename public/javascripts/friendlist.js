// Animations init
new WOW().init()

$(document).ready(

  function getFriendlist() {
    $.ajax({
      url: '/friendlist',
      type: 'GET',

    })
  }
