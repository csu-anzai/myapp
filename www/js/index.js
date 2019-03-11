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
    console.log('show splash screen');
    navigator.splashscreen.show();


      // get posts for slider
      const data1 = new Promise(function(resolve, reject){
        console.log('sent slider posts request');
        // axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&categories=77&per_page=5").then(function(response) {
        axios.get("test/data.json").then(function(response) {
          
        console.log('recieved slider posts request');
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
        console.log('finish render posts');
          resolve(true);
        });
      });

      // get posts for latest news

      const data2 = new Promise(function(resolve, reject){
        console.log('sent body posts request');
        moment().format();
        // axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&categories_exclude=77&per_page=3").then(function(response) {
        axios.get("test/data.json").then(function(response) {
        
        console.log('recieved body posts request');

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
          console.log('finish render body posts');
          resolve(true);
        });
      });

      Promise.all([data1, data2]).then(function(values){
        navigator.splashscreen.hide();
        console.log('finish two requests and hide splash screen')
      });
    
  },


  news: function(search=false) {
    var param = "";
    if(search){
      param = "&search=" + search;
    }

    if(!sessionStorage.page){
      sessionStorage.page = 1;
    }

    param += "&page=" + sessionStorage.page;

    navigator.splashscreen.show();
      // axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&per_page=10" + param).then(function(response) {
      axios.get("test/data.json" + param).then(function(response) {
        var posts = response.data;

        if(sessionStorage.page == 1){
          var d = new Date(firstPost.date);
        }

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
  details: function() {},
  about: function() {}
};
