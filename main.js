$(document).ready(function() {

  var randBetween = function(start, end) {
    return Math.floor(Math.random() * end) + start;
  };

  var stripTags = function(html) {
    return html.replace(/(<([^>]+)>)/ig, '').split(":")[0];
  };

  var setupAudioPlayer = function(audioUrl) {
    var $player =  $(".audio-playback");
    var player = $player[0]
    player.src = audioUrl;
    player.load();
    player.play();

    var playerClasses = "player-ready player-playing player-error";

    $player.on("playing", function() {
      $(".player").removeClass(playerClasses);
      $(".player").addClass("player-playing");
    });

    $player.on("ended", function() {
      $(".player").removeClass(playerClasses);
      $(".player").addClass("player-ready");
    });
  }

  var setupAudio = function(word) {
    console.log(word)
    apiKey = "";
    apiUrl = "http://api.wordnik.com:80/v4/word.json/" + word + "/audio?useCanonical=true&limit=3&api_key=" + apiKey;
    $.ajax({
      url: apiUrl,
      success: function(data) {
        if (data.length) {
          audioUrl = data[0].fileUrl;
          setupAudioPlayer(audioUrl);
        }
      }
    });
  }

  var successCallback = function(data) {
    wordCount = data.length - 1;
    wordIndex = randBetween(0, wordCount);
    wordData = data;

    $(".loading").hide();

    $("#word").text(
      wordData["word"].toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      })
    );
    $(".page-title").html(
      wordData["word"].toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      })
    );
    $("#definition").html(wordData["descriptors"][0].definition);
    $("#partofspeech").html(wordData["descriptors"][0].partOfSpeech);
    $("#sentence").html(wordData["descriptors"][0].examples[0]);
    $("#pronounce").data('word', wordData["word"])

    if (!navigator.onLine) {
      $(".player").removeClass("player-ready");
      $(".player").addClass("player-error");
      $(".player").attr("title", "Pronunciation requires an internet connection.")
    }
  };

  $("#pronounce").click(function(e) {
    var word = $(e.currentTarget).data('word');
    if (navigator.onLine) {
      setupAudio(word);
    }
  });

  $.get('http://apis.wordgame.betafactory.tech/api/general/random/word', successCallback);

});
