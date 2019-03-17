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
    navigator.splashscreen.show();


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

        axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&categories_exclude=77&per_page=3").then(function(response) {
        // axios.get("test/data.json").then(function(response) {     // For testing

          response.data.forEach(post => {

            var date = moment(post.date);

            var a = date.format('a') == 'am' ? 'صباحا' : 'مساءا';

            document.getElementById("posts").innerHTML += "<a href='post.html#" + post.id + "' class='card mb-4'>" +
              "<img class='card-img-top' src='" + post._embedded['wp:featuredmedia'][0].source_url + "' height='150px' alt='Card image cap' >" +
              "<div class='card-body'>" +
                "<h4 class='card-title news-title'>" + post.title.rendered + "</h4>" +
                "<p class='card-text news-sub-title'>" +
                "<span>" + date.locale('ar').format('dddd ') + date.locale('en').format('YYYY/M/D - h:mm ') + a + "</span><br />" +
                "</p>" +
                "<i class='mdi mdi-share'></i>" +
              "</div>" +
            "</a>";

          });

        }).then(() => {
          resolve(true);
        });
      });

      Promise.all([data1, data2]).then(function(values){
        navigator.splashscreen.hide();
      });
    
  },


  news: function(search=false, page=1) {
    var param = "";
    search = search ? search : decodeURI(window.location.hash.substr(1));
    if(search){
      param = "&search=" + search;
      window.location = "news.html#" + search;
    }

    param += "&page=" + page;

    navigator.splashscreen.show();
      axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&per_page=10" + param).then(function(response) {
      // axios.get("test/data.json").then(function(response) {     // For testing
        var posts = response.data;

        posts.forEach(post => {
          var date = moment(post.date);

          var a = date.format('a') == 'am' ? 'صباحا' : 'مساءا';

          document.getElementById("posts").innerHTML += "<a href='post.html#" + post.id + "' class='card mb-4'>" +
              "<img class='card-img-top' src='" + post._embedded['wp:featuredmedia'][0].source_url + "' height='150px' alt='Card image cap' >" +
              "<div class='card-body'>" +
                "<h4 class='card-title news-title'>" + post.title.rendered + "</h4>" +
                "<p class='card-text news-sub-title'>" +
                "<span>" + date.locale('ar').format('dddd ') + date.locale('en').format('YYYY/M/D - h:mm ') + a + "</span><br />" +
                "</p>" +
                "<i class='mdi mdi-share'></i>" +
              "</div>" +
            "</a>";
          });

        }).then(function(){
          navigator.splashscreen.hide();
        });
  },


  post: function(id) {

    navigator.splashscreen.show();
      axios.get("http://www.tantasc.net/wp-json/wp/v2/posts/" + id + "?_embed").then(function(response) {
      // axios.get("test/post.json").then(function(response) {     // For testing
        var post = response.data;

          document.getElementById("img").setAttribute('src', post._embedded['wp:featuredmedia'][0].source_url);
          document.getElementById("title").innerHTML = post.title.rendered;
          document.getElementById("article").innerHTML = post.content.rendered;

        }).then(function(){
          navigator.splashscreen.hide();
        });

  },
  page: function(id) {
    navigator.splashscreen.show();
      axios.get("http://www.tantasc.net/wp-json/wp/v2/pages/" + id).then(function(response) {
      // axios.get("test/page.json").then(function(response) {     // For testing
        var page = response.data;

          // document.getElementById("img").setAttribute('src', post._embedded['wp:featuredmedia'][0].source_url);
          document.getElementById("title").innerHTML = page.title.rendered;
          document.getElementById("article").innerHTML = page.content.rendered;

        }).then(function(){
          navigator.splashscreen.hide();
        });
  }
};
