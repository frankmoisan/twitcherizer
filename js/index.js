$(document).ready(function() {
  var streamList = ['freecodecamp', 'superclumpgaming', 'MedryBW', 'storbeck', 'terakilobyte', 'brunofin', 'habathcx', 'RobotCaleb', 'thomasballinger', 'noobs2ninjas', 'beohoff', 'comster'];
  var listBuilder1 = "<a target='_blank' href='";
  var listBuilder15 = "'><div class='row row-fluid streamer ";
  var listBuilder16 = "'><span class='col-xs-1 stream-logo-container'><img class='stream-logo' src='";
  var listBuilder2 = "'></img></span><div class='col-xs-10 stream-info'><h4 class='stream-name'>";
  var listBuilder3 = "</h4><span class='stream-subtext'>";
  var listBuilder4 = "</span></div><div class='col-xs-1 stream-check'><i class='fa fa-spinner fa-pulse fa-2x' id='status";
  var listBuilder5 = "'></i></div></div></a>";
  var urlChannels = 'https://api.twitch.tv/kraken/channels/';
  var urlStreams = 'https://api.twitch.tv/kraken/streams/';
  var id = 0,
    name, logo, channel, status, online, url, closed, failId = 100;

  getInfo(streamList);

  function getInfo(list) {
    list.forEach(function(user) {
      $.getJSON(urlChannels + user, function(channel) {
        $.getJSON(urlStreams + user, function(stream) {

          if (channel.display_name == '' || channel.display_name === null) {
            name = 'Not found';
          } else {
            name = channel.display_name;
          }
          if (!channel.logo) {
            logo = "http://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.jpeg";
          } else {
            logo = channel.logo;
          }
          if (!channel.status) {
            status = '';
          } else {
            status = truncate(channel.status, 50);
          }
          if (!channel.url) {
            url = 'https://www.twitch.tv/';
          } else {
            url = channel.url;
          }
          if (!stream.stream) {
            online = 'offline';
          } else {
            online = 'online';
          }

          $('.stream-list').append(listBuilder1 + url + listBuilder15 + online + listBuilder16 + logo + listBuilder2 + name + listBuilder3 + status + listBuilder4 + id + listBuilder5);

          // Replace status icon AFTER loading up the list, in case we get a late response
          if (!stream.stream) {
            $('#status' + id).removeClass('fa-spinner fa-pulse').addClass('fa-exclamation-circle');
          } else {
            $('#status' + id).removeClass('fa-spinner fa-pulse').addClass('fa-check-circle');
          }
          
          // Get rid of 'undefined' class
          $('.undefined').addClass('offline').removeClass('undefined');

          id++;
        });
      }).fail(function(jqXHR) {
        var msg = jqXHR.responseJSON.message.split(' ');
        var failedUser = msg[1].substring(1, msg[1].length - 1);
        logo = 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Red_X.svg';
        status = 'CLOSED';
        url = 'http://www.twitch.tv';
        $('.stream-list').append(listBuilder1 + url + listBuilder15 + online + listBuilder16 + logo + listBuilder2 + failedUser + listBuilder3 + status + listBuilder4 + failId + listBuilder5);
        $('#status' + failId).removeClass('fa-spinner fa-pulse').addClass('fa-times-circle');
        //$('.online').removeClass('online').addClass('offline');
        failId++;
      });
    });
  }
  
  $('#btnAll').on('click', function() {
    $('.online, .offline').removeClass('hidden');
  });
  
  $('#btnOnline').on('click', function() {
    $('.online').removeClass('hidden');
    $('.offline').addClass('hidden');
  });
  
  $('#btnOffline').on('click', function() {
    $('.offline').removeClass('hidden');
    $('.online').addClass('hidden');
  });

  function truncate(str, num) {
    // Truncate stream subtext
    var newStr;
    if (str.length > num) {
      newStr = str.slice(0, (num - 3));
      newStr += '...';
    } else if (str === null) {
      newStr = '';
    } else {
      newStr = str;
    }
    return newStr;
  }
});