/**
 * Created by Hugo on 22/10/2015.
 */

'use strict'


$(document).ready(function () {

    $("#creerUtilisateur").bind('click', function () {
        var obj = {};
        var urlRegister = "http://twitter-esme.herokuapp.com/user/register";
        obj["user"] = {
            "username": $("#signup .iUsername").val(),
            "lastname": $("#signup .iNom").val(),
            "firstname": $("#signup .iPrenom").val(),
            "password": $("#signup .iPassword").val()
        };
        //console.log(obj);
        //console.log(urlRegister)


        $.ajax({
            type: "POST",
            url: urlRegister,
            data: JSON.stringify(obj),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                //console.log('coucou')
            },
            error: function (data) {
                //console.log("4444")
                //console.log(data);
            }
        });

    });


    $("#loginB").bind('click', function () {
        var urlLogin = "http://twitter-esme.herokuapp.com/user/login";
        var obj = {};
        obj["user"] = {
            "username": $("#login .iUsername").val(),
            "password": $("#login .iPassword").val()
        };

        $.ajax({
            type: "POST",
            url: urlLogin,
            data: JSON.stringify(obj),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                $("#userKey").val(data["key"]);
                $("#userKey").change();
            },
            error: function (data) {
                //console.log("4444")
                //console.log(data);
            }
        });

    });

    $('input:radio[name="choixLog"]').bind('change', function () {

        var choix = $('input:radio[name="choixLog"]:checked').val();
        //console.log(choix);
        if (choix == "login") {
            $("#signup").hide();
            $("#login").show();
        }
        else if (choix == "signup") {
            //console.log("coucou");
            $("#login").hide();
            $("#signup").show();
        }
    });

    $("#login").hide();
    $("#signup").hide();
    $('input:radio[name="choixLog"]').change();

    $("#userKey").bind('change', function () {
        if ($("#userKey").val() == "") {
            $("#logoutB").hide();
            $("#bTousTweets").hide();
            $("#ajoutTweetB").hide();
            $("#mur").hide();
            $("#login").show();
            $('#notCo').show();
        }
        else {
            $("#ajoutTweet").hide();
            $("#bTousTweets").show();
            $("#ajoutTweetB").show();
            $("#logoutB").show();
            $("#mur").hide();
            $("#login").hide();
            $('#notCo').hide();
        }
    });

    $("#logoutB").bind('click', function () {
        $("#userKey").val("");
        $("#userKey").change();
    });

    $("#logoutB").hide();
    //$("#userKey").change();


    var urlGetter = "http://twitter-esme.herokuapp.com/tweet/";
    //var urlSetter = "http://twitter-esme.herokuapp.com/tweet/"+key+id;

    /*TODO
     $(".editTweet").click(function(){
     edit(urlSetter);
     });
     */

    $("#bTousTweets").bind('click', function () {
        get(urlGetter);
        $("#userKey").change();
        $("#mur").show();
    });

    $("#bTousTweets").hide();


    $("#timestamp").val($.now());
    $("#createTweet").click(function () {
        var url = "http://twitter-esme.herokuapp.com/tweet/" + $("#keyUser").val();
        var data = {};
        if (searchData('#message').length < 140) {
            data.tweet = {message: searchData('#message'), timestamp: searchData('#timestamp')};
            put(url, data);
        }
        else {
            alert("Trop de caracteres");
        }
    });

    $("#ajoutTweet").hide();

    $("#ajoutTweetB").bind("click", function () {
        $("#userKey").change();
        $("#ajoutTweet").show();

    });
    $("#ajoutTweetB").hide();

});


//===============================================================================

/**
 * Created by chuibete on 21/10/15.
 */

function searchData(id) {
    var input = $(id);
    var search = input.val();
    return search;
}

function get(url) {
    $.ajax({
        url: url,
        type: "get",
        datatype: "json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            console.log("Request : ----- getting good -----");
            displayMur(data, "#mur", false);
        },
        error: function () {
            console.log("Request : ----- getting fail -----");
        }
    });
};

function put(url, data, callback) {
    return $.ajax({
        url: url,
        type: 'PUT',
        success: callback,
        data: JSON.stringify(data),
        datatype: "json",
        contentType: "application/json",
        success: function (dummy) {
            //console.log("Request : ----- creation good -----");

            alert("Tweet envoie");
            $('#message').val('');
            $('#timestamp').val('');
        },
        error: function () {
            //console.log("Request : ----- creation fail -----");
            alert("Echec envoie");
        }
    })
};

function edit(url, data, callback) {
    return $.ajax({
        url: url,
        type: 'PUT',
        success: callback,
        data: data,
        contentType: type,
        success: function (dummy) {
            console.log("Request : ----- edition good -----");
        },
        error: function () {
            console.log("Request : ----- edition fail -----");
        }
    });
};

//la variable objet est ici est un objet/tableau/etc d'objet
function displayMur(objet,id, modif){
    var idTweet = 0;
    $.each(objet,function(index,subobject){
        //la case
        var content = "<div class='tweet col-xs-6 col-lg-4'>";
        content = content;

        //element des objets
        $.each(subobject,function(index,value){
            content = content + "<p>" + index + " : " + value + "</p>";
        });

        content = content + "<button type='button' class='editTweet btn btn-default btn-sm'>edit</button>" +
            "<button type='button' class='delTweet btn btn-default btn-sm' id="+idTweet+" >del</button>" +"</div>";
        //mise en forme

        $(id).html($(id).html() + content);
        idTweet++;
    });
    buttonEditDel();
}

function buttonEditDel() {
    $(".delTweet").bind('click', function () {

        console.log($(this).attr('id'));
        var urlDel="http://twitter-esme.herokuapp.com/tweet/"+$(this).attr('id');
        console.log(urlDel);
        deleteTweet(urlDel);

    });
    $(".editTweet").bind('click', function () {

        alert("CA NE MARCHE PAS");
        /*
        var tmp = this;

        console.log($(this).context.attr());
        console.log($(this).context.attribute.id.nodeValue);
        */
    });
}

function deleteTweet(url){
    return $.ajax({
        url: url,
        type: 'DELETE',
        contentType: "application/json",
        success: function (dummy) {
            console.log("Request : ----- deletion good -----");
        },
        error : function (){
            console.log("Request : ----- deletion fail -----");
        }
    })
};