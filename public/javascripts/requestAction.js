$(document).ready(
    function() {

      $("add").click(function (event) {
        event.preventDefault();
        $.ajax({
          type: 'POST',
          url: '/user/relationship',
          dataType: 'json',
          data: {
            'userOne': ,
            'userTwo': ,
          }
        });
      });

      $("accept").click(function (event) {
          event.preventDefault();
          $.ajax({
            type: 'POST',
            url: '/user/eventaccept',
            dataType: 'json',
            data: {
              'userOne': this.token,
              'userTwo': ,
              'event': ,
                 }

          });
      });

      $("reject").click(function (event) {
          event.preventDefault();
          $.ajax({
            type: 'POST',
            url: '/user/eventreject',
            dataType: 'json',
            data: {
              'userOne': ,
              'userTwo': ,
              'event': ,
            }

          });
      });




    });
