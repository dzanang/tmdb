var app = angular.module("Rubicon", ["ui.router"]);

//ROUTING SETUP
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/movies');

    $stateProvider

  .state('movies', {
      url: '/movies',
      views: {
          '': { templateUrl: 'views/movies.html' },
          'movie@movies': {
              templateUrl: 'views/search-movies.html',
              controller: 'MoviesController'
          }
      }
  })

        .state('detail', {
            url: '/detail/:id',
            templateUrl: 'views/movie-detail.html',
            controller: 'MovDetController',
            resolve: {
                details: function ($http, $stateParams) {
                    var url = 'https://api.themoviedb.org/3/movie/' + $stateParams.id + '?api_key=5a06c55fb8ca078014f8be4126cb9a73&language=en-US';
                    return $http.get(url)
                        .then(function (res) { return res.data; });
                }
            }
        })

          .state('tvdetail', {
              url: '/tvdetail/:id',
              templateUrl: 'views/tvshow-detail.html',
              controller: 'TvDetController',
              resolve: {
                  tvdetails: function ($http, $stateParams) {
                      var url = 'https://api.themoviedb.org/3/tv/' + $stateParams.id + '?api_key=5a06c55fb8ca078014f8be4126cb9a73&language=en-US';
                      return $http.get(url)
                          .then(function (res) { return res.data; });
                  }
              }
          })

        .state('searchMov', {
            url: '/movie/:search',
            templateUrl: 'views/search-movies.html',
            controller: 'MoviesController',
            resolve: {
                details: function ($http, $stateParams) {
                    var url = 'https://api.themoviedb.org/3/search/movie?api_key=5a06c55fb8ca078014f8be4126cb9a73&language=en-US&query=' + $stateParams.search;
                    return $http.get(url)
                        .then(function (res) { return res.data; });
                }
            }
        })

     .state('tvshows', {
         url: '/tvshows',
         views: {
             '': { templateUrl: 'views/tvshows.html' },
             'tv@tvshows': {
                 templateUrl: 'views/search-tvshows.html',
                 controller: 'TvshowsController'
             }
         }
     })
});

//DATA SERVICE
app.factory('dataService', function ($http) {
    return {
        fetchMovies: function (callback) {
            $http.get("https://api.themoviedb.org/3/movie/top_rated?api_key=5a06c55fb8ca078014f8be4126cb9a73&language=en-US").success(callback);
        },

        fetchTv: function (callback) {
            $http.get('https://api.themoviedb.org/3/tv/top_rated?api_key=5a06c55fb8ca078014f8be4126cb9a73&language=en-US').success(callback);
        }
    };
});

//CONTROLLERS
app.controller("MoviesController", function ($scope, $http, $rootScope, dataService) {
    $scope.movies = [];
    $rootScope.loaded = false;

    $scope.$watch('search', function () {
        loadData();
    });

    function loadData() {
        var search = $("#search").val();
        $scope.search = search;
        if ($scope.search.length > 2) {
            $http.get('https://api.themoviedb.org/3/search/movie?api_key=5a06c55fb8ca078014f8be4126cb9a73&query=' + $scope.search)
              .success(function (response) {
                  $scope.movies = response.results;
                  $rootScope.loaded = true;
              });
        } else {
            dataService.fetchMovies(function (data) {
                $scope.movies = data.results;
                $rootScope.loaded = true;
            })
        }
    }
});

app.controller("TvshowsController", function ($scope, $http, $rootScope, dataService) {
    $scope.tvshows = [];
    $rootScope.loaded = false;

    $scope.$watch('search', function () {
        loadData();
    });

    function loadData() {
        var search = $("#search").val();
        $scope.search = search;
        if ($scope.search.length > 2) {
            $http.get('https://api.themoviedb.org/3/search/tv?api_key=5a06c55fb8ca078014f8be4126cb9a73&language=en-US&query=' + $scope.search)
              .success(function (response) {
                  $scope.tvshows = response.results;
                  $rootScope.loaded = true;
              });
        } else {
            dataService.fetchTv(function (data) {
                $scope.tvshows = data.results;
                $rootScope.loaded = true;
            })
        }
    }
});

app.controller('MovDetController', ['$scope', 'details', function ($scope, details) {

    $scope.title = details.original_title;
    console.log($scope.title)

    $scope.overview = details.overview;

    $scope.poster = "http://image.tmdb.org/t/p/w370/" + details.poster_path;
    console.log($scope.poster);

    $scope.rating = details.vote_average;
    $scope.release = details.release_date;
    $scope.genres = details.genres;
    $scope.genre = $scope.genres.map(function (obj) { return obj.name; }).join(', ');
}]);


app.controller('TvDetController', ['$scope', 'tvdetails', function ($scope, tvdetails) {

    $scope.tvtitle = tvdetails.name;
    $scope.overview = tvdetails.overview;
    $scope.tvposter = "http://image.tmdb.org/t/p/w370/" + tvdetails.poster_path;
    $scope.rating = tvdetails.vote_average;
    $scope.release = tvdetails.first_air_date;
    $scope.genres = tvdetails.genres;
    $scope.genre = $scope.genres.map(function (obj) { return obj.name; }).join(', ');
    $scope.seasons = tvdetails.number_of_seasons;
    $scope.status = tvdetails.status;
    if ($scope.status == "Ended") {
        $scope.myStyle = {
            "color": "red",
            "font-weight": "bold"
        }
    }

    if ($scope.status == "Returning Series") {
        $scope.myStyle = {
            "color": "green",
            "font-weight": "bold"
        }
    }

}]);