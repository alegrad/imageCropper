angular.module('controllers', []);

angular.module('controllers')
    .controller('MainController', function ($scope, $http, $state, $window, $rootScope, CropInitService) {
        $scope.imageUpload =  imageUpload;
        $scope.crop = crop;
        $scope.loadCroppedImagePage = loadCroppedImagePage;


        function initCropper() {
            var fd = new FormData();
            fd.append('image', $scope.file);
            console.log($scope.file);
            var request = $http({
                method: 'POST',
                url: '/',
                data: fd,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
            request.then(function () {
                $scope.imgSrc = 'uploads/' + $scope.file.name;
                CropInitService.bind($scope.imgSrc);
            });
        }

        function imageUpload(event) {
            $scope.file = event.target.files[0];
            console.log($scope.file.name);
            initCropper();
        }



        function crop() {
            CropInitService.result('canvas', 'viewport').then(function (result) {

                $http({
                    method: 'POST',
                    url: '/cropped/' + $scope.file.name,
                    data: {img: result},
                    //transformRequest: angular.identity,
                    headers: {'Content-Type': "application/json"}
                }).then(function (res) {
                    $scope.loadCroppedImagePage(res.data);
                });
            });

        }

        function loadCroppedImagePage(path) {
            $state.go('cropped', {
                file: path
            });
        }

    });

angular.module('controllers')
    .controller('CroppedController', function ($scope, $http, $stateParams, $window) {
        $scope.fileName = $stateParams.file;
        $scope.download = download;
        $scope.share = share;

        function share() {
            SocialShare.share("twitter", {
                url: '/uploads/' + $scope.fileName,
                text: "Check out this image",
                hashtags: "imagecrop",
                via: $scope.userName
            });
        }

        function download() {
            console.log('download link ' + '/cropped/download/' + $scope.fileName);
            $window.open('/cropped/download/' + $scope.fileName);
        }
    });