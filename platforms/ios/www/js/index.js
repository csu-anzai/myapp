// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

// document.addEventListener('deviceready', function () {
//   // Enable to debug issues.
//   // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});


//   var notificationOpenedCallback = function(jsonData) {
//     var data = jsonData;
//     window.location = 'post.html#' + data.notification.payload.additionalData.post_id;
//   };

//   window.plugins.OneSignal
//     .startInit("ae305c36-5d9d-4e34-8154-924268faea8c")
//     .handleNotificationOpened(notificationOpenedCallback)
//     .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
//     .endInit();
// }, false);
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {


  home: function() {
    $('#loading').show();

      // get posts for slider
      const data1 = new Promise(function(resolve, reject){

        axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&categories=77&per_page=5").then(function(response) {
        // axios.get("test/data.json").then(function(response) {     // For testing

          response.data.forEach(post => {

            document.getElementById("slider").innerHTML += "<div class='slider slider1 '>" +
              "<img src='" + post._embedded['wp:featuredmedia'][0].source_url + "' alt='slider-img' class='w-100 h-100'>" +
              "<p><a href='post.html#" + post.id + "' >" + post.title.rendered + "</a></p>" +
            "</div>";

          });

        }).then(function(){

          $('.slick').slick({
                dots: true,
                arrows: false,
                rtl: true
            });

          resolve(true);
        });
      });

      // get posts for latest news
      const data2 = new Promise(function(resolve, reject){

        axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&categories_exclude=77&per_page=5").then(function(response) {
        // axios.get("test/data.json").then(function(response) {     // For testing

          response.data.forEach(post => {

            var date = moment(post.date);

            var a = date.format('a') == 'am' ? 'صباحا' : 'مساءا';

            document.getElementById("posts").innerHTML += "<div class='card mb-4'>" +
              "<a href='post.html#" + post.id + "' >" +
              "<img class='card-img-top' src='" + post._embedded['wp:featuredmedia'][0].source_url + "' height='150px' alt='Card image cap' >" +
              "</a>" +
              "<div class='card-body'>" +
                "<a class='news-title d-inline-block' href='post.html#" + post.id + "'>" +
                "<h4 class='card-title news-title'>" + post.title.rendered + "</h4>" +
                "<p class='card-text news-sub-title'>" +
                "<span>" + date.locale('ar').format('dddd ') + date.locale('en').format('YYYY/M/D - h:mm ') + a + "</span><br />" +
                "</p>" +
                "</a>" +
                "<i class='mdi mdi-share-variant' onclick=\"app.share('" + post.link + "')\" ></i>" +
              "</div>" +
            "</div>";

          });

        }).then(() => {
          resolve(true);
        });
      });

      Promise.all([data1, data2]).then(function(values){
        $('#loading').hide();
      }).catch(function(){
        $('#loading').hide();
      });

  },


  news: function(search=false, page=1) {

    //show loading gif
    $('#loading').show();
    
    var param = "";
    search = search ? search : decodeURI(window.location.hash.substr(1));
    if(search){
      param = "&search=" + search;
      window.location = "news.html#" + search;
    }

    param += "&page=" + page;

      axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&per_page=10" + param).then(function(response) {
      // axios.get("test/data.json").then(function(response) {     // For testing
        var posts = response.data;

        posts.forEach(post => {
          var date = moment(post.date);

          var a = date.format('a') == 'am' ? 'صباحا' : 'مساءا';

          document.getElementById("posts").innerHTML += "<div class='card mb-4'>" +
              "<a href='post.html#" + post.id + "' >" +
              "<img class='card-img-top' src='" + post._embedded['wp:featuredmedia'][0].source_url + "' height='150px' alt='Card image cap' >" +
              "</a>" +
              "<div class='card-body'>" +
                "<a class='news-title d-inline-block' href='post.html#" + post.id + "'>" +
                "<h4 class='card-title news-title'>" + post.title.rendered + "</h4>" +
                "<p class='card-text news-sub-title'>" +
                "<span>" + date.locale('ar').format('dddd ') + date.locale('en').format('YYYY/M/D - h:mm ') + a + "</span><br />" +
                "</p>" +
                "</a>" +
                "<i class='mdi mdi-share-variant' onclick=\"app.share('" + post.link + "')\" ></i>" +
              "</div>" +
            "</div>";
          });

        }).then(function(){
          $('#loading').hide();
        }).catch(function(){
          $('#loading').hide();
        });
  },


  post: function(id) {

    //show loading gif
    $('#loading').show();

      axios.get("http://www.tantasc.net/wp-json/wp/v2/posts/" + id + "?_embed").then(function(response) {
      // axios.get("test/post.json").then(function(response) {     // For testing
        var post = response.data;

        var date = moment(post.date);

        var a = date.format('a') == 'am' ? 'صباحا' : 'مساءا';

          document.getElementById("img").setAttribute('src', post._embedded['wp:featuredmedia'][0].source_url);
          document.getElementById("title").innerHTML = post.title.rendered;
          document.getElementById("date").innerHTML = date.locale('ar').format('dddd ') + date.locale('en').format('YYYY/M/D - h:mm ') + a;
          document.getElementById("article").innerHTML = post.content.rendered;
          $(".mdi-share-variant").on("click", function(e){
            app.share(post.link);
          });

        }).then(function(){
          $('#loading').hide();
        }).catch(function(){
          $('#loading').hide();
        });

  },
  page: function(id) {

    // show loading gif
    $('#loading').show();

      axios.get("http://www.tantasc.net/wp-json/wp/v2/pages/" + id).then(function(response) {
      // axios.get("test/page.json").then(function(response) {     // For testing
        var page = response.data;

          // document.getElementById("img").setAttribute('src', post._embedded['wp:featuredmedia'][0].source_url);
          document.getElementById("title").innerHTML = page.title.rendered;
          document.getElementById("article").innerHTML = page.content.rendered;
          $(".mdi-share-variant").on("click", function(e){
            app.share(page.link);
          });

        }).then(function(){
          $('#loading').hide();
        }).catch(function(){
          $('#loading').hide();
        });
  },

  share: function(url){
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
      url: url
    };

    var onSuccess = function(result) {
      console.log('share success');
    };

    var onError = function(msg) {
      console.log("Sharing failed with message: " + msg);
    };

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
  }
};
