global.jQuery = require('jquery'); // this is because media alement js search for global jquery

var $      = require('jquery'),
    ko     = require('knockout'),
    moment = require('moment');

require('melement');
var player = null;

var VM = {
    Comments    : ko.observableArray([]),
    newComments : ko.observable(""),
    selectedTab : ko.observable(null),
    init        : ko.observable(1),
    hasVideoUrl : ko.observable(1),
    videUrl     : ko.observable(""),

    insertComment : function(d,e) {
        var self = this;

        if (e.keyCode === 13) {
            debugger;
            var c = new Comment({ text: self.newComments(), owner: 'Irina Marinova', date: moment().format('LLL') });
            self.addComment(c);    
            self.newComments(null);
        }
       return true;
    },

    addComment : function(comment) {
        this.Comments.push( comment );
    },

    insertVideo : function(data, event) {
        var self = this;
        if (event.keyCode === 13 && validateYouTubeUrl(self.videUrl())) {
            self.hasVideoUrl(-2);
        }
    },

    //Get Tab Href
    getHref : function() {
        var target,
            element = event.target.hash;

            target = element.substr(1);
            return target;

    },
    //Show tab
    showBlock : function() {
        var target = this.getHref();
        this.selectedTab(target);
        this.init(2);

    }
} 


function validateYouTubeUrl(urlVideo) {  
    var url = urlVideo;
    if (url != undefined || url != '') {        
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            var myVideoPlayer = new MediaElementPlayer('#player1');
            myVideoPlayer.media.pluginApi.loadVideoById('g5vUBQBykJ4');

        } else {
            
            $('.error').show().text('This is not a valid youtube url')
            return;
        }
        return true;
    }
}

function Comment(config){
    this.owner = ko.observable(config.owner);
    this.date = ko.observable(config.date);
    this.text = ko.observable(config.text);
}

 
$(function() {
    player = $('#player1').mediaelementplayer();

    VM.addComment(new Comment({
        text: 'Sed quis diam egestas, egestas mauris in, dapibus eros. Duis nisi nulla, accumsan eu libero sit amet, faucibus ornare nisi. Phasellus cursus dolor ante, at placerat est tincidunt vel. In ullamcorper pulvinar est id congue. Pellentesque scelerisque ante vel justo varius, non aliquet est eleifend. Aliquam erat volutpat. Curabitur blandit, lorem eget',
        owner: 'Irina Marinova',
        date: moment().format('LLL'),
    }));

    ko.applyBindings(VM);

});
