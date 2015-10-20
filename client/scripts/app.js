var app = {};
app.init = function() {
  //initialize with all messages
  $('#chats').append("<div id='roomSelect'></div>");
  app.fetch();

  $('#send').submit(app.handleSubmit);
  $('#message').on('keypress', function() {
    if (event.which === 13) {
      app.handleSubmit;
    }
  });
  
  setInterval(app.fetch, 2000);
};

app.handleSubmit = function(e) {
  e.preventDefault();
  var message = $('#message').val();
  $('#message').val("");
  app.send({text: message,username:window.location.search.split('=')[1]});
  app.fetch();
}

app.server = "https://api.parse.com/1/classes/chatterbox";
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};
var dataArr;
app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
      //data is an object with one property: the results array, named 'results'
      dataArr = data.results;
      for (var i = 0; i < dataArr.length; i++) {
        app.addMessage(dataArr[i],i);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  });
}
app.clearMessages = function() {
  // var ids = _.pluck(dataArr, 'objectId');
  // for (var i = 0; i < ids.length; i++) {
  //   $.ajax({
  //     // This is the url you should use to communicate with the parse API server.
  //     url: app.server + '/' + ids[i],
  //     type: 'DELETE',
  //     contentType: 'application/json',
  //     success: function (data) {
  //       console.log('Deleted message with ID: ' + ids[i]) + 'and message' + dataArr[i].text)
  //     }
  //   });
  // }
  // app.send({
  //   username: '???',
  //   text: 'Breathing Space'
  // });
  // app.fetch();
  $('#chats').html('');
}
app.addMessage = function(message, postNum) {
  //uses .append to create the container
  $('#chats').append("<div id='" + postNum + "'></div>");
  //uses .text to set container contents, since it will not be parsed as HTML
  //this is done to prevent script injection
  $('#'+postNum).text(message.text);
  $('#'+postNum).prepend('<span></span>').find('span').text(message.username + ': ');
  $('#'+postNum).addClass(message.username);
  $('#'+postNum).addClass('username');
  $('#'+postNum).on('click',function() {
    console.log($(this))
    app.addFriend($(this).attr('class'))
  });
}

var roomNum = 0;
app.addRoom = function(room) {
  //uses .append to create the container
  $('#roomSelect').append("<div id='" + roomNum++ + "'></div>");
  //uses .text to set container contents, since it will not be parsed as HTML
  //this is done to prevent script injection
  $('#'+roomNum).text(room);
  roomNum++;
}

app.addFriend = function(user) {
  
}


$(function(){app.init()});

