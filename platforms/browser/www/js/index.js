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
    // navigator.splashscreen.show();


      // get posts for slider
      const data1 = new Promise(function(resolve, reject){
        axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&categories=77&per_page=3").then(function(response) {
          response.data.forEach(post => {
            document.getElementById("slider").innerHTML += "<div class='slider'>" +
              "<img src='" + post._embedded['wp:featuredmedia'][0].source_url + "' alt='slider-img' class='w-100 h-100'>" +
              "<p>" + post.title.rendered + "</p>" +
            "</div>";
          });
        }).then(function(){
          resolve(true);
        });
      });

      // get posts for latest news

      const data2 = new Promise(function(resolve, reject){
        axios.get("http://www.tantasc.net/wp-json/wp/v2/posts?_embed&categories_exclude=77&per_page=3").then(function(response) {
          response.data.forEach(post => {
            document.getElementById("news-items").innerHTML += "<a href='" + post.link + "' class='media mb-4'>"+
                      "<img class='d-flex mr-3 mb-3' src='" + post._embedded['wp:featuredmedia'][0].source_url + "' alt='صورة الخبر'>"+
                      "<div class='media-body'>"+
                          "<p>" + post.title.rendered + "</p>"+
                          "<span>" + post.date + "</span>" +
                      "</div>"+
                  "</a>";
          });
        }).then(() => {
          resolve(true);
        });
      });

      Promise.all([data1, data2]).then(function(values){
        console.log(values);
        navigator.splashscreen.hide();
      });
    
  },


  news: function(search) {
    var param = "";
    if(search){
      param = "?search=" + search;
    }

    navigator.splashscreen.show();
      axios.get("http://www.tantasc.net/wp-json/wp/v2/posts" + param).then(function(response) {
          response.data.forEach(post => {
            document.getElementById("news-items").innerHTML += "<a href='" + post.link + "' class='media mb-4'>"+
                      "<img class='d-flex mr-3 mb-3' src='img/bg/bg-3.jpg' alt='Generic placeholder image'>"+
                      "<div class='media-body'>"+
                          "<p>" + post.title.rendered + "</p>"+
                          // <span> الثلاثاء 10/10/2017 - 8.00 مساءا </span>
                      "</div>"+
                  "</a>";
          });
        }).then(function(){
          navigator.splashscreen.hide();
        });
  },
  details: function() {},
  about: function() {}
};
